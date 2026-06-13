// Claudeデスクトップ（サブスク・web検索）で作った scripts/ai-data.json を
// DBへ取り込む。Amazon評価・レビュー件数・メリット・デメリットを更新する。
//
// ai-data.json の形式（デスクトップにこの形で出力させる）:
//   [
//     {
//       "slug": "holo-bell-face-wash",
//       "amazon_rating": 4.5,            // 見つからなければ null
//       "amazon_review_count": 120,      // 同上
//       "pros": ["メリット1", "メリット2", "メリット3"],
//       "cons": ["デメリット1", "デメリット2", "デメリット3"]
//     }
//   ]
//
// 使い方:
//   node scripts/import-ai-data.js            # ドライラン（確認のみ）
//   node scripts/import-ai-data.js --commit   # DBへ書き込み
require("dotenv").config({ path: ".env.local" });

const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COMMIT = process.argv.includes("--commit");
const INPUT = path.join(__dirname, "ai-data.json");

function buildUpdate(e) {
  const u = {};
  if (typeof e.amazon_rating === "number") u.amazon_rating = e.amazon_rating;
  if (typeof e.amazon_review_count === "number")
    u.amazon_review_count = e.amazon_review_count;
  if (Array.isArray(e.pros) && e.pros.length > 0) u.ai_review_pros = e.pros;
  if (Array.isArray(e.cons) && e.cons.length > 0) u.ai_review_cons = e.cons;
  return u;
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(
      `入力ファイルがありません: ${INPUT}\n` +
        `  デスクトップで作ったJSONを scripts/ai-data.json として保存してください。`
    );
    process.exit(1);
  }

  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  } catch (e) {
    console.error("ai-data.json の JSON が不正です:", e.message);
    process.exit(1);
  }
  if (!Array.isArray(entries)) {
    console.error("ai-data.json は配列である必要があります。");
    process.exit(1);
  }

  console.log(
    `${entries.length} 件を処理 ${
      COMMIT ? "【本番: DB書き込み】" : "【ドライラン: --commit で実行】"
    }\n`
  );

  let updated = 0,
    skipped = 0,
    failed = 0;

  for (const e of entries) {
    if (!e || !e.slug) {
      console.log("  SKIP: slug がありません");
      skipped++;
      continue;
    }
    const update = buildUpdate(e);
    if (Object.keys(update).length === 0) {
      console.log(`  SKIP: ${e.slug}（更新データなし）`);
      skipped++;
      continue;
    }

    try {
      const { data: prod } = await supabase
        .from("products")
        .select("id")
        .eq("slug", e.slug)
        .maybeSingle();
      if (!prod) {
        console.log(`  SKIP: ${e.slug}（DBに該当商品なし）`);
        skipped++;
        continue;
      }

      const fields = Object.keys(update).join(", ");
      if (COMMIT) {
        const { error } = await supabase
          .from("products")
          .update(update)
          .eq("slug", e.slug);
        if (error) throw error;
        console.log(`  ✅ ${e.slug}（${fields}）`);
        updated++;
      } else {
        const r =
          update.amazon_rating != null ? `★${update.amazon_rating}` : "";
        console.log(`  (dry) ${e.slug} → ${fields} ${r}`);
        updated++;
      }
    } catch (err) {
      console.error(`  ERROR ${e.slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\n完了: ${updated} ${COMMIT ? "更新" : "更新予定"} / ${skipped} スキップ / ${failed} 失敗`
  );
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
