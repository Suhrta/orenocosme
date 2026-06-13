import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getRankedProducts } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "メンズコスメおすすめランキング【2026年最新】洗顔・化粧水・乳液TOP10",
  description:
    "Amazon口コミをAIが分析して決定したメンズコスメランキング。洗顔料・化粧水・乳液・オールインワンなどカテゴリ別TOP10を毎月更新。本当に評価が高いアイテムだけ厳選。",
};

export default async function RankingPage(props: PageProps<"/ranking">) {
  const searchParams = await props.searchParams;
  const categorySlug =
    typeof searchParams.category === "string" ? searchParams.category : null;

  const [allCategories, products] = await Promise.all([
    getCategories(),
    categorySlug
      ? getRankedProducts(categorySlug)
      : getRankedProducts(),
  ]);

  const tabs = [
    { label: "全体", slug: null },
    ...allCategories.map((cat) => ({ label: cat.name, slug: cat.slug })),
  ];

  return (
    <>
      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-brush">
            ランキング
          </h1>
          <p className="text-sm text-foreground-muted">
            Amazon評価が高いメンズコスメをカテゴリ別に紹介
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <Link
                key={tab.slug ?? "all"}
                href={
                  tab.slug ? `/ranking?category=${tab.slug}` : "/ranking"
                }
                className={`shrink-0 px-4 py-2 text-sm rounded-full border transition-colors ${
                  categorySlug === tab.slug
                    ? "bg-foreground text-white border-foreground font-medium"
                    : "bg-white text-foreground-muted border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground-muted">
                データ集計中です
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-start gap-4 sm:gap-6 bg-white border border-border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md hover:bg-background-secondary/50 transition-all duration-200"
                  >
                    <div
                      className={`shrink-0 flex items-center justify-center rounded-full ${
                        isTop3
                          ? "w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl"
                          : "w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base"
                      } ${
                        rank === 1
                          ? "bg-foreground text-white"
                          : rank === 2
                            ? "bg-foreground/80 text-white"
                            : rank === 3
                              ? "bg-foreground/60 text-white"
                              : "bg-background-secondary text-foreground-muted"
                      } font-bold`}
                    >
                      {rank}
                    </div>

                    <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-background-secondary rounded-lg relative overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-12 bg-border rounded" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <div className="min-w-0">
                          {product.brands && (
                            <p className="text-xs text-foreground-muted">
                              {product.brands.name}
                            </p>
                          )}
                          <h3
                            className={`font-bold text-foreground leading-tight ${
                              isTop3 ? "text-base sm:text-lg" : "text-sm sm:text-base"
                            }`}
                          >
                            {product.name}
                          </h3>
                        </div>

                        {product.price != null && (
                          <p
                            className={`shrink-0 font-bold text-foreground ${
                              isTop3 ? "text-base sm:text-lg" : "text-sm"
                            }`}
                          >
                            &yen;{product.price.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="#111"
                            stroke="none"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {product.amazon_rating}
                          </span>
                        </div>
                        {product.amazon_review_count != null && (
                          <span className="text-xs text-foreground-muted">
                            ({product.amazon_review_count.toLocaleString()}件)
                          </span>
                        )}
                      </div>

                      {product.ai_review_pros &&
                        product.ai_review_pros.length > 0 && (
                          <ul className="mt-2 hidden sm:flex flex-wrap gap-x-4 gap-y-1">
                            {product.ai_review_pros.map((pro, i) => (
                              <li
                                key={i}
                                className="text-xs text-foreground-muted"
                              >
                                <span className="text-foreground mr-1">+</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
