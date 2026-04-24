require("dotenv").config({ path: ".env.local" });

const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const articles = [
  {
    title: "メンズスキンケアの始め方 — 初心者が最初に揃えるべき3アイテム",
    slug: "mens-skincare-beginners-guide",
    category: "beginner",
  },
  {
    title: "肌タイプ別おすすめスキンケアルーティン",
    slug: "skincare-routine-by-skin-type",
    category: "skincare",
  },
  {
    title: "メンズBBクリームの選び方と塗り方ガイド",
    slug: "mens-bb-cream-guide",
    category: "makeup",
  },
  {
    title: "年代別メンズスキンケア — 20代・30代・40代で変わるケア",
    slug: "skincare-by-age",
    category: "age",
  },
];

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
  const articleMatch = text.match(
    /---ARTICLE---\s*([\s\S]*?)\s*---PRODUCTS---/
  );
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
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, brands(name), categories(name), price");

  if (error) {
    console.error("Failed to fetch products:", error.message);
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

  console.log(`Loaded ${products.length} products from DB.\n`);

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`[${i + 1}/4] Generating: ${article.title} ...`);

    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [
          { role: "user", content: buildPrompt(article.title, productsJson) },
        ],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock) throw new Error("No text in response");

      const { body, productSlugs } = parseResponse(textBlock.text);

      const relatedProductIds = products
        .filter((p) => productSlugs.includes(p.slug))
        .map((p) => p.id);

      const { error: insertError } = await supabase.from("articles").upsert(
        {
          title: article.title,
          slug: article.slug,
          body,
          category: article.category,
          related_product_ids: relatedProductIds,
          published_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );

      if (insertError) throw insertError;

      console.log(
        `  Done (${body.length} chars, ${relatedProductIds.length} related products)`
      );
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }

    if (i < articles.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\nAll articles generated.");
}

main();
