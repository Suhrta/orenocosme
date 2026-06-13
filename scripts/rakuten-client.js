// 楽天市場商品検索API（2022-06-01 新仕様）クライアント
//
// 重要な注意点（2026年の仕様変更で判明）:
//  - 新エンドポイント openapi.rakuten.co.jp/ichibams/... を使う（旧 app.rakuten.co.jp は廃止）
//  - applicationId(UUID) + accessKey(pk_) をクエリに付与
//  - 許可ドメイン判定は **Origin ヘッダー** で行われる（Referer ではない）。
//    Node の fetch は Origin を禁止ヘッダーとして落とすため、node:https を使う必要がある。
const https = require("node:https");
const fs = require("node:fs");

const ENDPOINT =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601";
const ORIGIN = process.env.RAKUTEN_ORIGIN || "https://oreno-cosme.com";
const UA = "Mozilla/5.0 (orenocosme rakuten importer)";

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: "GET", headers }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.end();
  });
}

function normalize(it) {
  const img =
    it.mediumImageUrls?.[0]?.imageUrl ||
    it.smallImageUrls?.[0]?.imageUrl ||
    null;
  return {
    itemCode: it.itemCode,
    name: it.itemName,
    price: it.itemPrice ?? null,
    reviewAverage: it.reviewAverage ? Number(it.reviewAverage) : null,
    reviewCount: it.reviewCount ?? null,
    shopName: it.shopName,
    // サムネイルを ~500px に拡大（_ex=WxH をCDNが解釈する）
    imageUrl: img ? img.replace(/\?_ex=\d+x\d+$/, "?_ex=500x500") : null,
    affiliateUrl: it.affiliateUrl || it.itemUrl || null,
  };
}

async function searchItems(keyword, { hits = 10, sort = "-reviewCount" } = {}) {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affId = process.env.RAKUTEN_AFFILIATE_ID;
  if (!appId || !accessKey) {
    throw new Error("RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が未設定です");
  }
  const u = new URL(ENDPOINT);
  u.searchParams.set("applicationId", appId);
  u.searchParams.set("accessKey", accessKey);
  if (affId) u.searchParams.set("affiliateId", affId);
  u.searchParams.set("keyword", keyword);
  u.searchParams.set("hits", String(hits));
  u.searchParams.set("format", "json");
  u.searchParams.set("sort", sort);

  const { status, body } = await httpsGet(u.toString(), {
    Origin: ORIGIN,
    "User-Agent": UA,
  });
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error(`Rakuten API 応答が不正 (HTTP ${status}): ${body.slice(0, 120)}`);
  }
  if (json.errors) {
    throw new Error(`Rakuten API error ${status}: ${JSON.stringify(json.errors)}`);
  }
  return (json.Items || []).map(({ Item }) => normalize(Item));
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": UA, Origin: ORIGIN } }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`image HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          fs.writeFileSync(destPath, Buffer.concat(chunks));
          resolve();
        });
      })
      .on("error", reject);
  });
}

module.exports = { searchItems, downloadImage, ORIGIN };
