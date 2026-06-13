// AI評価（Amazon評価）・メリデメが未設定の商品を一覧化し、
// Claudeデスクトップに「ブロック単位でコピペ」できる scripts/ai-todo.txt を出力する。
// （生データの scripts/ai-todo.json も併せて出力）
//
// 使い方:
//   node scripts/list-needs-ai.js          # 1チャンク12件で分割
//   node scripts/list-needs-ai.js 15       # 1チャンク15件で分割
//
// scripts/ai-todo.txt の各ブロックをそのままデスクトップのClaudeに貼り付け →
// 返ってきたJSONを scripts/ai-data.json にまとめて保存 →
// node scripts/import-ai-data.js --commit でDBへ取り込む。
require("dotenv").config({ path: ".env.local" });

const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CHUNK_SIZE = Math.max(1, parseInt(process.argv[2], 10) || 12);

const PROMPT = `あなたはメンズスキンケアの専門家です。以下の商品リスト(JSON)の各商品について、Web検索でAmazon.co.jp・@cosme・LIPS・mybest・楽天などの口コミを調べ、次を作成してください。

- amazon_rating: Amazon.co.jpの星評価(例 4.2)。見つからなければ null
- amazon_review_count: Amazonのレビュー件数(整数)。見つからなければ null
- pros: 実際の口コミ傾向に基づくメリット3つ(各30文字以内)
- cons: 同デメリット3つ(各30文字以内)

ルール:
- slug は入力のものをそのまま使う
- 薬機法NG表現(「効果がある」「治る」等)は避け「期待できる」「ケアできる」等にする
- 出力はJSON配列のみ。説明文は不要

出力形式:
[
  {"slug":"...","amazon_rating":4.2,"amazon_review_count":105,"pros":["...","...","..."],"cons":["...","...","..."]}
]

商品リスト:`;

async function main() {
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

  // 生データ
  const jsonPath = path.join(__dirname, "ai-todo.json");
  fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2) + "\n");

  // コピペ用ブロック
  const chunks = [];
  for (let i = 0; i < list.length; i += CHUNK_SIZE) {
    chunks.push(list.slice(i, i + CHUNK_SIZE));
  }

  let txt = `# Claudeデスクトップ貼り付け用（全${list.length}件 / ${chunks.length}ブロック）\n`;
  txt += `# 各ブロックの「===== ここから =====」〜「===== ここまで =====」を丸ごとコピーして、\n`;
  txt += `# web検索ONのClaudeデスクトップに貼り付け。返ってきたJSONを ai-data.json にためていく。\n\n`;

  chunks.forEach((chunk, idx) => {
    txt += `\n================ ブロック ${idx + 1} / ${chunks.length} （${chunk.length}件） ================\n`;
    txt += `===== ここから =====\n`;
    txt += `${PROMPT}\n`;
    txt += `${JSON.stringify(chunk, null, 2)}\n`;
    txt += `===== ここまで =====\n`;
  });

  const txtPath = path.join(__dirname, "ai-todo.txt");
  fs.writeFileSync(txtPath, txt);

  console.log(
    `未設定 ${list.length} 件を ${chunks.length} ブロック（1ブロック${CHUNK_SIZE}件）に分割しました。`
  );
  console.log(`  貼り付け用: ${txtPath}`);
  console.log(`  生データ  : ${jsonPath}`);
  console.log(
    `\nai-todo.txt をエディタで開き、ブロックごとにコピペ → 返答JSONを scripts/ai-data.json にまとめて保存 → node scripts/import-ai-data.js --commit`
  );
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
