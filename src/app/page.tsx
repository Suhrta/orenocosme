import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getCategories, getReviewedProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PhoneMockup } from "@/components/PhoneMockup";
import { AIReviewCarousel } from "@/components/AIReviewCarousel";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "メンズコスメ選びに迷ったら、ここ。AIレビュー分析×商品データベースで、あなたに合ったメンズコスメが見つかる。",
  openGraph: {
    title: "オレのコスメ | メンズコスメの総合ガイド",
  },
};

const features = [
  {
    icon: <Star size={32} strokeWidth={1.5} />,
    title: "ランキング",
    desc: "人気アイテムを部門別にリアルタイムで更新",
    href: "/ranking",
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
    desc: "AIが口コミのメリデメを分析",
    href: "/products",
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
    href: "/products",
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
    href: "/articles",
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
  const [products, categories, reviewedProducts] =
    await Promise.all([
      getProducts(4),
      getCategories(),
      getReviewedProducts(5),
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
            <Image
              src="/images/hero-bg.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/50 md:bg-transparent" />
            <div className="relative min-h-[400px] md:min-h-[480px] lg:min-h-[540px] flex items-center">
              <div className="px-8 md:px-12 py-12 md:py-16 w-full">
                <div className="max-w-md md:max-w-lg">
              <h1 className="animate-fade-in-up text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 font-brush">
                俺の肌に、
                <br />
                俺のコスメ。
              </h1>
              <p className="animate-fade-in-up-delay-1 text-base md:text-lg text-foreground-muted mb-6 leading-relaxed">
                メンズコスメの口コミ・レビュー・ランキングから
                <br className="hidden sm:block" />
                あなたに合ったアイテムが見つかる。
              </p>
              <Link
                href="/products"
                className="animate-fade-in-up-delay-2 inline-flex items-center px-8 py-4 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors"
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
          <div className="grid grid-cols-2 md:grid-cols-4">
            {features.map((f, i) => {
              const borders = [
                "border-r border-b md:border-b-0",
                "border-b md:border-b-0 md:border-r",
                "border-r",
                "",
              ][i];
              const inner = (
                <div
                  className={`text-center px-4 py-6 h-full transition-colors border-border ${borders} ${
                    f.href !== "#" ? "hover:bg-foreground/5 cursor-pointer" : ""
                  }`}
                >
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
              );
              return f.href !== "#" ? (
                <Link key={f.title} href={f.href}>
                  {inner}
                </Link>
              ) : (
                <div key={f.title}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Skin Diagnosis CTA */}
      <section className="bg-background-secondary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-center md:text-left md:justify-self-end">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground font-brush">
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
            <div>
              <h2 className="text-2xl font-bold text-foreground font-brush">
                注目のカテゴリー
              </h2>
              <div className="w-10 h-[3px] bg-foreground mt-2" />
            </div>
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
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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
            <div>
              <h2 className="text-2xl font-bold text-foreground font-brush">
                人気のメンズコスメ
              </h2>
              <div className="w-10 h-[3px] bg-foreground mt-2" />
            </div>
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
            <h2 className="text-2xl font-bold text-foreground mb-2 font-brush">
              AIレビュー分析
            </h2>
            <div className="w-10 h-[3px] bg-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground-muted">
              AIが口コミのメリデメを分析
            </p>
          </div>
          <AIReviewCarousel products={reviewedProducts} />
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 md:py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-12 md:gap-20">
            <div className="flex items-center gap-3 text-foreground">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h8M8 14h4" />
              </svg>
              <div>
                <p className="text-sm font-bold">AI分析</p>
                <p className="text-xs text-foreground-muted">数千件の口コミをAIが分析</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <div>
                <p className="text-sm font-bold">毎月更新</p>
                <p className="text-xs text-foreground-muted">商品情報を定期的にアップデート</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
