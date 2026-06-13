import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const anthropic = new Anthropic();

// --- 入力の許可値（src/app/diagnosis/page.tsx の選択肢と一致させる） ---
const SKIN_TYPES = [
  "全体的にテカる",
  "全体的につっぱる",
  "Tゾーンだけテカり、頬は乾く",
  "赤みやヒリつきが出やすい",
];
const CONCERNS = [
  "ニキビ・吹き出物",
  "毛穴の開き・黒ずみ",
  "シミ・くすみ",
  "乾燥・かさつき",
  "テカリ・ベタつき",
  "特になし",
];
const AGES = ["10代", "20代前半", "20代後半", "30代", "40代以上"];
const CURRENT_CARE = [
  "水で洗うだけ",
  "洗顔料を使っている",
  "洗顔＋化粧水",
  "洗顔＋化粧水＋乳液・クリーム",
];
const BUDGETS = ["〜1,000円", "1,000〜3,000円", "3,000〜5,000円", "5,000円以上"];

// 予算 → 価格上限（円）。最上位は上限なし。
const BUDGET_CEILING: Record<string, number> = {
  "〜1,000円": 1000,
  "1,000〜3,000円": 3000,
  "3,000〜5,000円": 5000,
  "5,000円以上": Number.POSITIVE_INFINITY,
};

// --- レート制限設定 ---
const BURST_MAX = 5; // 1分あたり
const BURST_WINDOW = 60;
const DAILY_MAX = 50; // 1日あたり
const DAILY_WINDOW = 86400;

const MAX_PRODUCTS_TO_LLM = 30; // LLM に渡す候補商品の上限

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    // 内部設定の不備。詳細は表に出さない。
    console.error("ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "診断サービスは現在利用できません" },
      { status: 503 }
    );
  }

  // --- 簡易 Origin チェック（自サイト以外からの素朴な乱用を弾く） ---
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // --- レート制限（IP単位・バースト＋日次の二段） ---
  const ip = getClientIp(request);
  const [burstOk, dailyOk] = await Promise.all([
    checkRateLimit(`diag:burst:${ip}`, BURST_MAX, BURST_WINDOW),
    checkRateLimit(`diag:day:${ip}`, DAILY_MAX, DAILY_WINDOW),
  ]);
  if (!burstOk || !dailyOk) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらくしてからお試しください。" },
      { status: 429 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest("リクエスト形式が正しくありません");
    }

    const b = (body ?? {}) as Record<string, unknown>;
    const skinType = b.skinType;
    const concerns = b.concerns;
    const age = b.age;
    const currentCare = b.currentCare;
    const budget = b.budget;
    const freeTextRaw = b.freeText;

    // --- 入力バリデーション（許可値以外は拒否） ---
    if (typeof skinType !== "string" || !SKIN_TYPES.includes(skinType)) {
      return badRequest("肌質の指定が不正です");
    }
    if (
      !Array.isArray(concerns) ||
      concerns.length === 0 ||
      concerns.length > CONCERNS.length ||
      !concerns.every((c) => typeof c === "string" && CONCERNS.includes(c))
    ) {
      return badRequest("肌の悩みの指定が不正です");
    }
    if (typeof age !== "string" || !AGES.includes(age)) {
      return badRequest("年代の指定が不正です");
    }
    if (typeof currentCare !== "string" || !CURRENT_CARE.includes(currentCare)) {
      return badRequest("現在のスキンケアの指定が不正です");
    }
    if (typeof budget !== "string" || !BUDGETS.includes(budget)) {
      return badRequest("予算の指定が不正です");
    }
    const freeText =
      typeof freeTextRaw === "string" ? freeTextRaw.slice(0, 200) : "";

    const concernList = concerns as string[];

    // --- 商品取得 ---
    const { data: products, error: dbError } = await supabase
      .from("products")
      .select(
        "id, name, slug, price, ai_review_pros, ai_review_cons, brands(name), categories(name)"
      );

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "商品データの取得に失敗しました" },
        { status: 500 }
      );
    }

    // --- 予算で事前フィルタしてから LLM に渡す（トークン削減＋精度向上） ---
    const ceiling = BUDGET_CEILING[budget] ?? Number.POSITIVE_INFINITY;
    const allProducts = products ?? [];
    let candidates = allProducts.filter(
      (p) => p.price == null || (p.price as number) <= ceiling
    );
    // 候補が少なすぎる場合は全件にフォールバック（提案の幅を確保）
    if (candidates.length < 10) {
      candidates = allProducts;
    }
    candidates = candidates.slice(0, MAX_PRODUCTS_TO_LLM);

    const productList = candidates.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      brand: (p.brands as unknown as { name: string } | null)?.name ?? "",
      category:
        (p.categories as unknown as { name: string } | null)?.name ?? "",
      pros: p.ai_review_pros,
      cons: p.ai_review_cons,
    }));

    const prompt = `あなたはメンズスキンケアの専門家です。以下のユーザー情報と商品データベースを元に、最適な診断結果を返してください。

【ユーザー情報】
- 肌質: ${skinType}
- 肌の悩み: ${concernList.join("、")}
- 年代: ${age}
- 現在のスキンケア: ${currentCare}
- 月予算: ${budget}
- 自由記述: ${freeText || "なし"}

【商品データベース】
${JSON.stringify(productList)}

以下のJSON形式のみで回答してください。他のテキストは不要です：
{
  "skin_type": "脂性肌 or 乾燥肌 or 混合肌 or 敏感肌",
  "skin_type_description": "肌タイプの簡潔な説明（1行）",
  "scores": {
    "moisture": 0-100の数値,
    "oil_balance": 0-100の数値,
    "texture": 0-100の数値,
    "firmness": 0-100の数値
  },
  "overall_score": 0-100の総合スコア,
  "advice": "3〜5行のパーソナライズされたアドバイス。フレンドリーな口調で。薬機法NGワード（治る、効果がある等）は避ける。",
  "recommended_products": [
    {"slug": "商品のslug", "reason": "おすすめ理由（1行）"},
    {"slug": "商品のslug", "reason": "おすすめ理由（1行）"},
    {"slug": "商品のslug", "reason": "おすすめ理由（1行）"}
  ]
}

商品選出のルール：
- ユーザーの予算に合った価格帯から選ぶ
- 現在のスキンケアが「何もしていない」→ オールインワン1本を中心に推奨
- 「洗顔のみ」→ 化粧水かオールインワンを追加推奨
- 基本は「洗顔」「化粧水/乳液/オールインワン」のステップに沿って提案
- 敏感肌の場合は低刺激な商品を優先
- ユーザーの自由記述の内容を考慮したアドバイスと商品選定をする`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    let result: unknown;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch {
          result = null;
        }
      }
    }

    // --- LLM 応答のスキーマ検証（不正なら 500 でクラッシュさせない） ---
    if (!isValidDiagnosis(result)) {
      console.error("Invalid diagnosis shape from model:", text.slice(0, 500));
      return NextResponse.json(
        { error: "診断結果の生成に失敗しました。もう一度お試しください。" },
        { status: 502 }
      );
    }

    const recommendedSlugs = result.recommended_products
      .map((p) => p.slug)
      .filter((s): s is string => typeof s === "string");

    const { data: recommendedProducts } = await supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .in("slug", recommendedSlugs);

    const productsWithReasons = recommendedSlugs
      .map((slug) => {
        const product = (recommendedProducts ?? []).find(
          (p) => p.slug === slug
        );
        const reason =
          result.recommended_products.find((r) => r.slug === slug)?.reason ??
          "";
        return { product, reason };
      })
      .filter((item) => item.product != null);

    return NextResponse.json({
      ...result,
      recommended_products: productsWithReasons,
    });
  } catch (err) {
    // 内部エラーの詳細はクライアントに返さない。
    console.error("Diagnosis API error:", err);
    return NextResponse.json(
      { error: "診断中にエラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}

// --- 型ガード ---
type RecommendedProduct = { slug: string; reason: string };
type Diagnosis = {
  skin_type: string;
  skin_type_description: string;
  scores: {
    moisture: number;
    oil_balance: number;
    texture: number;
    firmness: number;
  };
  overall_score: number;
  advice: string;
  recommended_products: RecommendedProduct[];
};

function isValidDiagnosis(value: unknown): value is Diagnosis {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.skin_type !== "string") return false;
  if (typeof v.advice !== "string") return false;
  const scores = v.scores;
  if (typeof scores !== "object" || scores === null) return false;
  const s = scores as Record<string, unknown>;
  if (
    typeof s.moisture !== "number" ||
    typeof s.oil_balance !== "number" ||
    typeof s.texture !== "number" ||
    typeof s.firmness !== "number"
  ) {
    return false;
  }
  if (typeof v.overall_score !== "number") return false;
  if (!Array.isArray(v.recommended_products)) return false;
  return true;
}
