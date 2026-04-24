import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PhoneMockup } from "@/components/PhoneMockup";

export const metadata: Metadata = {
  description:
    "メンズコスメ選びに迷ったら、ここ。AIレビュー分析×商品データベースで、あなたに合ったメンズコスメが見つかる。",
  openGraph: {
    title: "オレのコスメ | メンズコスメの総合ガイド",
  },
};

const features = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 21h8M12 17v4M3.2 14.2l2.5-2.5M20.8 14.2l-2.5-2.5M18 8A6 6 0 0 0 6 8c0 4 3 6 3 8h6c0-2 3-4 3-8z" />
      </svg>
    ),
    title: "ランキング",
    desc: "人気アイテムを部門別にリアルタイムで更新",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8M8 14h4" />
      </svg>
    ),
    title: "AIレビュー分析",
    desc: "口コミをAIが分析してメリット・デメリットを整理",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "商品検索",
    desc: "肌質・悩み・目的から自分に合う商品を検索",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6M8 11h4" />
      </svg>
    ),
    title: "特集・コラム",
    desc: "スキンケアの基礎知識やトレンド情報をお届け",
  },
];

const stats = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    value: "—",
    suffix: "",
    label: "掲載ブランド数",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8M8 14h4" />
      </svg>
    ),
    value: "—",
    suffix: "",
    label: "AI分析済み商品",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    value: "—",
    suffix: "",
    label: "掲載商品数",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    value: "毎月更新",
    suffix: "",
    label: "データ更新",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "オレのコスメ",
  url: "https://oreno-cosme.com",
  description:
    "メンズコスメ選びに迷ったら、ここ。AIレビュー分析×商品データベースで、あなたに合ったメンズコスメが見つかる。",
};

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(4),
    getCategories(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg bg-background-secondary">
            <img
              src="/images/hero-bg.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/50 md:bg-transparent" />
            <div className="relative min-h-[400px] md:min-h-[480px] lg:min-h-[540px] flex items-center">
              <div className="px-8 md:px-12 py-12 md:py-16 w-full">
                <div className="max-w-md md:max-w-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                俺の肌に、
                <br />
                俺のコスメ。
              </h1>
              <p className="text-base md:text-lg text-foreground-muted mb-6 leading-relaxed">
                メンズコスメの口コミ・レビュー・ランキングから
                <br className="hidden sm:block" />
                あなたに合ったアイテムが見つかる。
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors"
              >
                今すぐチェックする
              </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-foreground">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Skin Diagnosis CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm text-foreground-muted mb-2">
                AIがあなたの肌を分析
              </p>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  AI肌診断
                </h2>
                <span className="text-xs font-medium px-3 py-1 bg-foreground text-white rounded-full">
                  無料
                </span>
              </div>
              <p className="text-sm md:text-base text-foreground-muted leading-relaxed mb-6">
                簡単な質問に答えるだけで、
                <br />
                あなたの肌質や肌の状態をAIが分析。
                <br />
                おすすめのケアやアイテムもご提案します。
              </p>
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors"
              >
                診断をはじめる
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="flex justify-center">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              注目のカテゴリー
            </h2>
            <Link
              href="/products"
              className="text-sm text-foreground-muted hover:text-foreground flex items-center gap-1 transition-colors"
            >
              すべて見る
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-background-secondary py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              人気のメンズコスメ
            </h2>
            <Link
              href="/products"
              className="text-sm text-foreground-muted hover:text-foreground flex items-center gap-1 transition-colors"
            >
              すべて見る
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Review Sample */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              AIレビュー分析
            </h2>
            <p className="text-sm text-foreground-muted">
              口コミをAIが分析し、メリット・デメリットを分かりやすく整理
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-lg border border-border p-5 md:p-6">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
              <div className="w-16 h-16 bg-background-secondary rounded-lg flex items-center justify-center shrink-0">
                <div className="w-8 h-12 bg-border rounded" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted">BULK HOMME</p>
                <p className="text-sm font-bold text-foreground">
                  THE FACE WASH 洗顔料
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={i < 4 ? "#111" : "#ddd"}
                      stroke="none"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-xs text-foreground-muted ml-1">
                    4.2 (1,580件の口コミを分析)
                  </span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                    +
                  </span>
                  <h4 className="text-sm font-bold text-foreground">
                    メリット
                  </h4>
                </div>
                <ul className="space-y-2">
                  {[
                    "泡立ちが非常に良く、少量で濃密な泡が作れる",
                    "洗い上がりがさっぱりしつつ、つっぱらない絶妙なバランス",
                    "香りが控えめで使いやすい",
                    "パッケージがおしゃれでバスルームに置いても映える",
                  ].map((pro, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground-muted flex gap-2"
                    >
                      <span className="text-green-600 shrink-0">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                    -
                  </span>
                  <h4 className="text-sm font-bold text-foreground">
                    デメリット
                  </h4>
                </div>
                <ul className="space-y-2">
                  {[
                    "価格がドラッグストア商品と比べると高め",
                    "チューブが柔らかく、最後まで使い切りにくい",
                    "泡立てネットが別途必要",
                  ].map((con, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground-muted flex gap-2"
                    >
                      <span className="text-red-600 shrink-0">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 md:py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-2 text-foreground">
                  {stat.icon}
                </div>
                <p className="text-sm text-foreground-muted mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                  <span className="text-base font-medium">{stat.suffix}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
