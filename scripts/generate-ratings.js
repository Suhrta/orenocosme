require("dotenv").config({ path: ".env.local" });

const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PROMPT_TEMPLATE = (brandName, productName) =>
  `以下のメンズコスメ商品のAmazon.co.jpでの評価（星の数と口コミ件数）を検索して教えてください。

出力形式（JSONのみ、他のテキストは不要）：
{"amazon_rating": 4.2, "amazon_review_count": 105}

Amazon.co.jpで該当商品が見つからない場合：
{"amazon_rating": null, "amazon_review_count": null}

商品名: ${brandName} ${productName}`;

async function fetchRating(brandName, productName) {
  const prompt = PROMPT_TEMPLATE(brandName, productName);
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
    .select("*, brands(*)")
    .is("amazon_rating", null);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    process.exit(1);
  }

  if (!products.length) {
    console.log("All products already have Amazon ratings.");
    return;
  }

  console.log(`Found ${products.length} products without Amazon ratings.\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const brandName = product.brands?.name || "";

    console.log(
      `[${i + 1}/${products.length}] ${brandName} ${product.name} ...`
    );

    try {
      const { amazon_rating, amazon_review_count } = await fetchRating(
        brandName,
        product.name
      );

      if (amazon_rating == null) {
        console.log("  SKIP: Not found on Amazon");
        skipCount++;
      } else {
        const { error: updateError } = await supabase
          .from("products")
          .update({ amazon_rating, amazon_review_count })
          .eq("slug", product.slug);

        if (updateError) throw updateError;

        console.log(
          `  ★ ${amazon_rating} (${amazon_review_count.toLocaleString()}件)`
        );
        successCount++;
      }
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      errorCount++;
    }

    if (i < products.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(
    `\nDone: ${successCount} updated, ${skipCount} skipped, ${errorCount} errors.`
  );
}

main();
