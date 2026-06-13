// 楽天APIから商品を一括取り込みするスクリプト。
//
// 使い方:
//   1. scripts/products-to-add.example.json をコピーして scripts/products-to-add.json を作る
//   2. 追加したい商品を JSON 配列で記述（name / slug / brandSlug / categorySlug / keyword 等）
//   3. まずドライラン（DB書き込み・画像DLなし）:
//        node scripts/import-rakuten.js
//   4. 内容を確認したら本番実行（DB書き込み＋画像DL）:
//        node scripts/import-rakuten.js --commit
//
// 取得・保存するもの: 価格 / 楽天評価(rakuten_rating) / レビュー件数 / 商品画像(ローカル保存) /
//                   楽天アフィリエイトリンク。Amazon評価やAIレビューは別スクリプトで付与。
require("dotenv").config({ path: ".env.local" });

const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");
const { searchItems, downloadImage } = require("./rakuten-client");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COMMIT = process.argv.includes("--commit");
const INPUT = path.join(__dirname, "products-to-add.json");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const RATE_LIMIT_MS = 1500; // 楽天APIは約1QPS

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolveCategoryId(slug) {
  const { data } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return data?.id ?? null;
}

async function resolveBrandId(brandSlug, brandName) {
  const { data } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", brandSlug)
    .maybeSingle();
  if (data?.id) return data.id;
  if (!COMMIT) return null; // ドライランでは作成しない
  const { data: created, error } = await supabase
    .from("brands")
    .insert({ slug: brandSlug, name: brandName || brandSlug })
    .select("id")
    .single();
  if (error) throw error;
  console.log(`  ブランド新規作成: ${brandSlug}`);
  return created.id;
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(
      `入力ファイルがありません: ${INPUT}\n` +
        `  scripts/products-to-add.example.json をコピーして作成してください。`
    );
    process.exit(1);
  }

  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  } catch (e) {
    console.error("products-to-add.json の JSON が不正です:", e.message);
    process.exit(1);
  }

  console.log(
    `${entries.length} 件を処理 ${
      COMMIT ? "【本番: DB書き込み + 画像DL】" : "【ドライラン: --commit で実行】"
    }\n`
  );

  let added = 0,
    skipped = 0,
    failed = 0;

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const { keyword, itemCode, name, slug, brandSlug, brandName, categorySlug } = e;
    console.log(`[${i + 1}/${entries.length}] ${name} (${slug})`);

    try {
      if (!name || !slug || !categorySlug) {
        console.log("  ERROR: name / slug / categorySlug は必須");
        failed++;
        continue;
      }

      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (existing) {
        console.log("  SKIP: 既にDBに存在");
        skipped++;
        continue;
      }

      const q = keyword || `${brandName || ""} ${name}`.trim();
      const results = await searchItems(q, { hits: 10 });
      const item = itemCode
        ? results.find((r) => r.itemCode === itemCode)
        : results[0];
      if (!item) {
        console.log(`  SKIP: 楽天で見つからず (keyword="${q}")`);
        skipped++;
        await sleep(RATE_LIMIT_MS);
        continue;
      }
      console.log(
        `  楽天: ${item.name.slice(0, 38)} / ¥${item.price} / ★${item.reviewAverage} (${item.reviewCount}件)`
      );

      const categoryId = await resolveCategoryId(categorySlug);
      if (categoryId == null) {
        console.log(`  ERROR: カテゴリが存在しません (${categorySlug})`);
        failed++;
        await sleep(RATE_LIMIT_MS);
        continue;
      }
      const brandId = brandSlug ? await resolveBrandId(brandSlug, brandName) : null;

      let imagePath = null;
      if (item.imageUrl) {
        const ext = (
          item.imageUrl.split("?")[0].match(/\.(jpe?g|png|gif|webp)$/i)?.[1] ||
          "jpg"
        ).toLowerCase();
        const rel = `/images/products/${categorySlug}/${slug}.${ext}`;
        if (COMMIT) {
          const dest = path.join(PUBLIC_DIR, rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          await downloadImage(item.imageUrl, dest);
        }
        imagePath = rel;
        console.log(`  画像: ${rel} ${COMMIT ? "(DL済)" : "(dry)"}`);
      }

      const row = {
        name,
        slug,
        brand_id: brandId,
        category_id: categoryId,
        price: item.price,
        image_url: imagePath,
        rakuten_rating: item.reviewAverage,
        rakuten_review_count: item.reviewCount,
        affiliate_links: item.affiliateUrl ? { rakuten: item.affiliateUrl } : {},
      };

      if (COMMIT) {
        const { error } = await supabase
          .from("products")
          .upsert(row, { onConflict: "slug" });
        if (error) throw error;
        console.log("  ✅ 追加完了");
        added++;
      } else {
        console.log(
          `  (dry) 追加予定: ¥${row.price} / ★${row.rakuten_rating} / brand=${brandSlug || "なし"} / cat=${categorySlug}`
        );
        added++;
      }
    } catch (err) {
      console.error("  ERROR:", err.message);
      failed++;
    }

    await sleep(RATE_LIMIT_MS);
  }

  console.log(
    `\n完了: ${added} ${COMMIT ? "追加" : "追加予定"} / ${skipped} スキップ / ${failed} 失敗`
  );
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
