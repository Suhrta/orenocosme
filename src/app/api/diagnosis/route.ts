import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      skinType,
      concerns,
      age,
      currentCare,
      budget,
      priority,
      freeText,
    } = body as {
      skinType: string;
      concerns: string[];
      age: string;
      currentCare: string;
      budget: string;
      priority: string;
      freeText: string;
    };

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

    const productList = (products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      brand:
        (p.brands as unknown as { name: string } | null)?.name ?? "",
      category:
        (p.categories as unknown as { name: string } | null)?.name ?? "",
      pros: p.ai_review_pros,
      cons: p.ai_review_cons,
    }));

    const prompt = `あなたはメンズスキンケアの専門家です。以下のユーザー情報と商品データベースを元に、最適な診断結果を返してください。

【ユーザー情報】
- 肌質: ${skinType}
- 肌の悩み: ${concerns.join("、")}
- 年代: ${age}
- 現在のスキンケア: ${currentCare}
- 月予算: ${budget}
- 重視すること: ${priority}
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
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse Claude response:", text);
        return NextResponse.json(
          { error: "診断結果の解析に失敗しました" },
          { status: 500 }
        );
      }
    }

    const recommendedSlugs: string[] = (
      result.recommended_products as { slug: string; reason: string }[]
    ).map((p) => p.slug);

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
          (
            result.recommended_products as {
              slug: string;
              reason: string;
            }[]
          ).find((r) => r.slug === slug)?.reason ?? "";
        return { product, reason };
      })
      .filter((item) => item.product != null);

    return NextResponse.json({
      ...result,
      recommended_products: productsWithReasons,
    });
  } catch (err) {
    console.error("Diagnosis API error:", err);
    const errMessage =
      err instanceof Error ? err.message : "不明なエラーが発生しました";
    const errName = err instanceof Error ? err.name : "UnknownError";
    return NextResponse.json(
      { error: errMessage, errorType: errName },
      { status: 500 }
    );
  }
}
