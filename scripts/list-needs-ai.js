// AI評価（Amazon評価）・メリデメが未設定の商品を一覧化し、
// Claudeデスクトップに貼り付ける用の scripts/ai-todo.json を出力する。
//
// 使い方:
//   node scripts/list-needs-ai.js
//   → scripts/ai-todo.json が生成される。中身をデスクトップのClaudeに貼り、
//     付属のプロンプトで JSON を作らせて scripts/ai-data.json に保存 →
//     node scripts/import-ai-data.js --commit でDBへ取り込む。
require("dotenv").config({ path: ".env.local" });

const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // ai_review_pros か amazon_rating のどちらかが未設定の商品
  const { data, error } = await supabase
    .from("products")
    .select("slug, name, price, brands(name), categories(name)")
    .or("ai_review_pros.is.null,amazon_rating.is.null")
    .order("id");

  if (error) {
    console.error("取得失敗:", error.message);
    process.exit(1);
  }

  const list = (data ?? []).map((p) => ({
    slug: p.slug,
    product: `${p.brands?.name || ""} ${p.name}`.trim(),
    category: p.categories?.name || "",
    price: p.price,
  }));

  const out = path.join(__dirname, "ai-todo.json");
  fs.writeFileSync(out, JSON.stringify(list, null, 2) + "\n");
  console.log(`未設定の商品 ${list.length} 件 → ${out} に出力しました。`);
  console.log(
    "この中身をClaudeデスクトップに貼り、プロンプトでJSONを作らせて scripts/ai-data.json に保存してください。"
  );
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
