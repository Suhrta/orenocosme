require("dotenv").config({ path: ".env.local" });

const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PROMPT_TEMPLATE = (brandName, productName, categoryName, price) =>
  `以下のメンズコスメ商品について、Web検索で@cosme、LIPS、mybest、Amazon、楽天などの口コミ・レビューを調べて、実際の口コミ傾向に基づいたメリット3つとデメリット3つを日本語で簡潔にまとめてください。

出力形式（JSONのみ、他のテキストは不要）：
{"pros": ["メリット1", "メリット2", "メリット3"], "cons": ["デメリット1", "デメリット2", "デメリット3"]}

各項目は30文字以内。薬機法に抵触する表現（効果がある、治る等）は避けてください。

商品名: ${brandName} ${productName}
カテゴリ: ${categoryName}
価格: ${price}円`;

async function generateReview(brandName, productName, categoryName, price) {
  const prompt = PROMPT_TEMPLATE(brandName, productName, categoryName, price);
  let messages = [{ role: "user", content: prompt }];
  let response;

  while (true) {
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages,
    });

    if (response.stop_reason === "pause_turn") {
      messages = [
        { role: "user", content: prompt },
        { role: "assistant", content: response.content },
      ];
      continue;
    }
    break;
  }

  const textBlocks = response.content.filter((b) => b.type === "text");
  const lastText = textBlocks[textBlocks.length - 1]?.text || "";

  const jsonMatch = lastText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .is("ai_review_pros", null);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    process.exit(1);
  }

  if (!products.length) {
    console.log("All products already have reviews.");
    return;
  }

  console.log(`Found ${products.length} products without reviews.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const brandName = product.brands?.name || "";
    const categoryName = product.categories?.name || "";

    console.log(
      `[${i + 1}/${products.length}] ${brandName} ${product.name} ...`
    );

    try {
      const { pros, cons } = await generateReview(
        brandName,
        product.name,
        categoryName,
        product.price
      );

      const { error: updateError } = await supabase
        .from("products")
        .update({ ai_review_pros: pros, ai_review_cons: cons })
        .eq("slug", product.slug);

      if (updateError) throw updateError;

      console.log(`  + ${pros.join(" / ")}`);
      console.log(`  - ${cons.join(" / ")}`);
      successCount++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      errorCount++;
    }

    if (i < products.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone: ${successCount} updated, ${errorCount} errors.`);
}

main();
