import { Brand, Category, Product } from "./types";

export const categories: Category[] = [
  { id: 1, name: "スキンケア", slug: "skincare", sort_order: 1 },
  { id: 2, name: "日焼け止め", slug: "sunscreen", sort_order: 2 },
  { id: 3, name: "ベースメイク", slug: "base-makeup", sort_order: 3 },
  { id: 4, name: "フレグランス", slug: "fragrance", sort_order: 4 },
  { id: 5, name: "ヘアケア", slug: "haircare", sort_order: 5 },
];

export const categoryEnNames: Record<string, string> = {
  skincare: "SKIN CARE",
  sunscreen: "SUN SCREEN",
  "base-makeup": "BASE MAKEUP",
  fragrance: "FRAGRANCE",
  haircare: "HAIR CARE",
};

export const brands: Brand[] = [
  {
    id: 1,
    name: "BULK HOMME",
    slug: "bulk-homme",
    logo_url: null,
    description:
      "メンズスキンケアブランドの先駆け。シンプルで洗練されたデザインと高品質な成分で、男性の肌を考え抜いたプロダクトを展開。",
    official_url: "https://bulk.co.jp",
    created_at: "2024-01-01",
  },
  {
    id: 2,
    name: "ORBIS Mr.",
    slug: "orbis-mr",
    logo_url: null,
    description:
      "ポーラ・オルビスグループのメンズライン。オイルカット×高保湿のスキンケアで、ベタつきと乾燥の両方にアプローチ。",
    official_url: "https://www.orbis.co.jp",
    created_at: "2024-01-01",
  },
  {
    id: 3,
    name: "NULL",
    slug: "null",
    logo_url: null,
    description:
      "男性特有の肌悩みに特化したメンズコスメブランド。BBクリームやオールインワンなど実用的なラインナップが人気。",
    official_url: "https://mens-null.net",
    created_at: "2024-01-01",
  },
  {
    id: 4,
    name: "SHISEIDO MEN",
    slug: "shiseido-men",
    logo_url: null,
    description:
      "資生堂が展開するメンズ総合スキンケアライン。長年の研究に基づく高機能処方で、エイジングケアにも対応。",
    official_url: "https://www.shiseido.co.jp",
    created_at: "2024-01-01",
  },
  {
    id: 5,
    name: "uno",
    slug: "uno",
    logo_url: null,
    description:
      "資生堂のメンズマスブランド。手軽な価格帯でオールインワンジェルやBBクリームなど幅広く展開。",
    official_url: "https://www.shiseido.co.jp",
    created_at: "2024-01-01",
  },
  {
    id: 6,
    name: "LIPPS BOY",
    slug: "lipps-boy",
    logo_url: null,
    description:
      "人気メンズサロンLIPPSが手がけるコスメブランド。BBクリームやリップなどメンズメイクアイテムを展開。",
    official_url: "https://lipps.co.jp",
    created_at: "2024-01-01",
  },
];

export const products: Product[] = [
  {
    id: 1,
    brand_id: 1,
    category_id: 1,
    name: "THE FACE WASH 洗顔料",
    slug: "bulk-homme-face-wash",
    price: 2200,
    volume: "100g",
    image_url: "/images/products/product-1.svg",
    description:
      "クレイミネラルズ配合の濃密泡が、不要な汚れをしっかり落としながら、肌に必要なうるおいを残します。すっきりとした洗い上がりが特長。",
    ingredients: "カリ含有石ケン素地、水、グリセリン、ソルビトール、BG...",
    features: [
      "クレイミネラルズ配合で毛穴汚れを吸着",
      "弾力のある濃密泡",
      "洗い上がりのつっぱり感なし",
    ],
    affiliate_links: {
      amazon: "#",
      rakuten: "#",
    },
    ai_review_pros: [
      "泡立ちが非常に良く、少量で濃密な泡が作れる",
      "洗い上がりがさっぱりしつつ、つっぱらない絶妙なバランス",
      "香りが控えめで使いやすい",
      "パッケージがおしゃれでバスルームに置いても映える",
    ],
    ai_review_cons: [
      "価格がドラッグストア商品と比べると高め",
      "チューブが柔らかく、最後まで使い切りにくい",
      "泡立てネットが別途必要",
    ],
    amazon_rating: 4.2,
    amazon_review_count: 1580,
    rakuten_rating: 4.3,
    rakuten_review_count: 920,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    brand_id: 2,
    category_id: 1,
    name: "ミスター モイスチャー",
    slug: "orbis-mr-moisture",
    price: 2420,
    volume: "50g",
    image_url: "/images/products/product-2.svg",
    description:
      "オイルカット処方のジェル状保湿液。ベタつきを抑えながら肌内部のうるおいをキープし、清潔感ある肌に整えます。",
    ingredients: "水、グリセリン、DPG、ジメチコン...",
    features: [
      "オイルカット処方でベタつかない",
      "高保湿ジェルタイプ",
      "ポンプ式で衛生的",
    ],
    affiliate_links: {
      amazon: "#",
      rakuten: "#",
    },
    ai_review_pros: [
      "ベタつかずサラッとした使用感が快適",
      "保湿力が高く、乾燥肌にも効果を実感",
      "ポンプ式で朝の忙しい時間にも使いやすい",
    ],
    ai_review_cons: [
      "乾燥がひどい冬場はこれ1本だと物足りない場合も",
      "無香料だが、わずかに原料臭がある",
    ],
    amazon_rating: 4.1,
    amazon_review_count: 890,
    rakuten_rating: 4.4,
    rakuten_review_count: 650,
    created_at: "2024-02-10",
  },
  {
    id: 3,
    brand_id: 3,
    category_id: 3,
    name: "BBクリーム",
    slug: "null-bb-cream",
    price: 1915,
    volume: "20g",
    image_url: "/images/products/product-3.svg",
    description:
      "自然な仕上がりでニキビ跡やクマをカバー。日焼け止め効果も備えたメンズ向けBBクリーム。SPF30/PA++。",
    ingredients: "水、シクロペンタシロキサン、酸化チタン...",
    features: [
      "SPF30 PA++で紫外線カット",
      "自然な肌色で塗っている感が出にくい",
      "テカリ防止パウダー配合",
    ],
    affiliate_links: {
      amazon: "#",
      rakuten: "#",
    },
    ai_review_pros: [
      "メイク初心者でも使いやすい自然な仕上がり",
      "テカリが抑えられ、夕方まで崩れにくい",
      "コスパが良い",
      "日焼け止め効果もあり一石二鳥",
    ],
    ai_review_cons: [
      "色展開が少なく、肌色に合わない場合がある",
      "乾燥肌の人はカサつきが目立つことも",
      "容量が20gと少なめ",
    ],
    amazon_rating: 4.0,
    amazon_review_count: 2340,
    rakuten_rating: 3.9,
    rakuten_review_count: 1100,
    created_at: "2024-03-05",
  },
  {
    id: 4,
    brand_id: 4,
    category_id: 1,
    name: "モイスチャーライジング エマルジョン",
    slug: "shiseido-men-emulsion",
    price: 3850,
    volume: "100ml",
    image_url: "/images/products/product-4.svg",
    description:
      "ダメージディフェンスコンプレックス配合の保湿乳液。乾燥やカミソリ負けから肌を守り、なめらかに整えます。",
    ingredients: "水、グリセリン、エタノール、ジメチコン...",
    features: [
      "ダメージディフェンスコンプレックス配合",
      "カミソリ負けケアにも対応",
      "さっぱりとした使用感",
    ],
    affiliate_links: {
      amazon: "#",
      rakuten: "#",
    },
    ai_review_pros: [
      "さっぱりなのにしっかり保湿される",
      "髭剃り後のヒリつきが軽減される",
      "ブランドの安心感がある",
    ],
    ai_review_cons: [
      "価格がやや高め",
      "エタノール配合で敏感肌には合わない場合も",
    ],
    amazon_rating: 4.3,
    amazon_review_count: 670,
    rakuten_rating: 4.5,
    rakuten_review_count: 430,
    created_at: "2024-04-20",
  },
];

export const reviews = [
  {
    id: 1,
    productName: "BULK HOMME 洗顔料",
    rating: 5.0,
    comment: "ベタつかず使いやすい。肌の調子が良くなりました！",
    age: "30代",
    skinType: "乾燥肌",
  },
  {
    id: 2,
    productName: "ORBIS Mr. モイスチャー",
    rating: 5.0,
    comment: "香りが爽やかで気に入ってます。リピート確定です。",
    age: "20代",
    skinType: "普通肌",
  },
  {
    id: 3,
    productName: "NULL BBクリーム",
    rating: 4.5,
    comment: "テカリが抑えられて清潔感がアップした気がします。",
    age: "20代",
    skinType: "脂性肌",
  },
  {
    id: 4,
    productName: "SHISEIDO MEN 乳液",
    rating: 5.0,
    comment: "初心者でも使いやすいセット。プレゼントにもおすすめ！",
    age: "30代",
    skinType: "普通肌",
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: number): Product[] {
  return products.filter((p) => p.category_id === categoryId);
}

export function getBrandById(id: number): Brand | undefined {
  return brands.find((b) => b.id === id);
}
