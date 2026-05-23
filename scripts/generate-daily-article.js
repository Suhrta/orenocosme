require("dotenv").config({ path: ".env.local" });

const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIES = ["beginner", "skincare", "makeup", "age", "comparison", "seasonal"];

async function pickTopic(existingTitles, productsJson) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `メンズコスメ・スキンケアの記事トピックを1つ提案してください。

既存の記事タイトル（重複を避けてください）:
${existingTitles.map((t) => `- ${t}`).join("\n") || "（まだありません）"}

利用可能な商品カテゴリ:
${productsJson}

以下のJSON形式で1つだけ返してください:
{"title": "記事タイトル", "slug": "url-safe-slug", "category": "${CATEGORIES.join("|")}のいずれか"}

SEO検索ボリュームが大きいトピックを優先してください。例：
- 「メンズ 洗顔 おすすめ」「メンズ 化粧水 30代」「メンズ オールインワン 比較」
- 季節に合ったテーマ（夏の日焼け止め、冬の乾燥対策など）
- 年代別の悩み（テカリ、ニキビ跡、シワ、毛穴）

JSONのみ返してください。`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text || "";
  const match = text.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error("Failed to parse topic JSON");
  return JSON.parse(match[0]);
}

function buildPrompt(title, productsJson) {
  return `あなたはメンズスキンケアの専門ライターです。以下のテーマで、スキンケア初心者の20〜30代男性向けの記事を書いてください。
- 1,500〜2,000文字
- マークダウン形式（h2, h3, リスト、太字を使用）
- フレンドリーで読みやすい口調
- 薬機法に注意（「治る」「効果がある」は使わない。「期待できる」「ケアできる」を使う）
- 具体的な商品名を自然に紹介する
- 最後にJSON形式で関連商品slugを3つ返す

テーマ: ${title}

商品データベース:
${productsJson}

出力形式:
---ARTICLE---
(マークダウン記事本文)
---PRODUCTS---
["slug1", "slug2", "slug3"]`;
}

function parseResponse(text) {
  const articleMatch = text.match(/---ARTICLE---\s*([\s\S]*?)\s*---PRODUCTS---/);
  const productsMatch = text.match(/---PRODUCTS---\s*(\[[\s\S]*?\])/);
  const body = articleMatch ? articleMatch[1].trim() : text.trim();
  let productSlugs = [];
  if (productsMatch) {
    try {
      productSlugs = JSON.parse(productsMatch[1]);
    } catch {
      const slugMatches = productsMatch[1].match(/"([^"]+)"/g);
      if (slugMatches) productSlugs = slugMatches.map((s) => s.replace(/"/g, ""));
    }
  }
  return { body, productSlugs };
}

async function main() {
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, slug, name, brands(name), categories(name), price");

  if (prodError) {
    console.error("Failed to fetch products:", prodError.message);
    process.exit(1);
  }

  const productsJson = JSON.stringify(
    products.map((p) => ({
      slug: p.slug,
      name: `${p.brands?.name || ""} ${p.name}`.trim(),
      category: p.categories?.name || "",
      price: p.price,
    })),
    null,
    0
  );

  const { data: existingArticles } = await supabase
    .from("articles")
    .select("title");
  const existingTitles = (existingArticles || []).map((a) => a.title);

  console.log(`Products: ${products.length}, Existing articles: ${existingTitles.length}`);

  const topic = await pickTopic(existingTitles, productsJson);
  console.log(`Topic: ${topic.title} (${topic.category})`);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: buildPrompt(topic.title, productsJson) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text in response");

  const { body, productSlugs } = parseResponse(textBlock.text);
  const relatedProductIds = products
    .filter((p) => productSlugs.includes(p.slug))
    .map((p) => p.id);

  const { error: insertError } = await supabase.from("articles").upsert(
    {
      title: topic.title,
      slug: topic.slug,
      body,
      category: topic.category,
      related_product_ids: relatedProductIds,
      published_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (insertError) throw insertError;

  console.log(`Done: ${body.length} chars, ${relatedProductIds.length} related products`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
