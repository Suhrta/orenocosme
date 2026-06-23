import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getRankedProducts } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

async function findCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function generateMetadata(
  props: PageProps<"/ranking/[category]">
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = await findCategory(slug);
  if (!category) return {};
  const title = `${category.name}のおすすめランキング【2026年最新】メンズコスメ人気${category.name}TOP10`;
  const description = `メンズ${category.name}の人気ランキング。Amazonの口コミ評価が高い順に厳選。AIが分析したメリット・デメリット・価格・評価を比較して、本当に評価の高い${category.name}が見つかります。`;
  return {
    title,
    description,
    alternates: { canonical: `https://oreno-cosme.com/ranking/${category.slug}` },
  };
}

export default async function CategoryRankingPage(
  props: PageProps<"/ranking/[category]">
) {
  const { category: slug } = await props.params;
  const [category, products] = await Promise.all([
    findCategory(slug),
    getRankedProducts(slug),
  ]);

  if (!category) notFound();

  const allCategories = await getCategories();
  const otherCategories = allCategories.filter((c) => c.slug !== slug);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name}のおすすめランキング`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://oreno-cosme.com/products/${p.slug}`,
      name: p.name,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "トップ", item: "https://oreno-cosme.com" },
      { "@type": "ListItem", position: 2, name: "ランキング", item: "https://oreno-cosme.com/ranking" },
      { "@type": "ListItem", position: 3, name: category.name, item: `https://oreno-cosme.com/ranking/${category.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-foreground-muted flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">トップ</Link>
          <span>/</span>
          <Link href="/ranking" className="hover:text-foreground transition-colors">ランキング</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
      </div>

      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-3 font-brush">
            {category.name}のおすすめランキング【2026年】
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed max-w-3xl">
            メンズ{category.name}を、Amazonのレビュー評価が高い順にランキングしました。
            口コミ評価が高く、レビュー件数の多い本当に支持されているアイテムだけを厳選。
            各商品のメリット・デメリットはAIが口コミを分析して要約しています。
            価格や評価を比較して、自分に合う{category.name}を見つけてください。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* カテゴリ切り替え */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              href="/ranking"
              className="shrink-0 px-4 py-2 text-sm rounded-full border bg-white text-foreground-muted border-border hover:border-foreground hover:text-foreground transition-colors"
            >
              全体
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/ranking/${cat.slug}`}
                className={`shrink-0 px-4 py-2 text-sm rounded-full border transition-colors ${
                  cat.slug === slug
                    ? "bg-foreground text-white border-foreground font-medium"
                    : "bg-white text-foreground-muted border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground-muted">データ集計中です</p>
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
                          <h2
                            className={`font-bold text-foreground leading-tight ${
                              isTop3 ? "text-base sm:text-lg" : "text-sm sm:text-base"
                            }`}
                          >
                            {product.name}
                          </h2>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#111" stroke="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm font-medium">{product.amazon_rating}</span>
                        </div>
                        {product.amazon_review_count != null && (
                          <span className="text-xs text-foreground-muted">
                            ({product.amazon_review_count.toLocaleString()}件)
                          </span>
                        )}
                      </div>

                      {product.ai_review_pros && product.ai_review_pros.length > 0 && (
                        <ul className="mt-2 hidden sm:flex flex-wrap gap-x-4 gap-y-1">
                          {product.ai_review_pros.map((pro, i) => (
                            <li key={i} className="text-xs text-foreground-muted">
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

          {/* 他カテゴリ導線 */}
          <nav className="mt-12 pt-8 border-t border-border">
            <h2 className="text-sm font-bold text-foreground mb-3">他のカテゴリのランキング</h2>
            <div className="flex flex-wrap gap-3">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ranking/${cat.slug}`}
                  className="text-sm px-4 py-2 border border-border rounded-full text-foreground hover:border-foreground transition-colors"
                >
                  {cat.name}ランキング →
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>
    </>
  );
}
