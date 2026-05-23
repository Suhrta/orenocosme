import type { Metadata } from "next";
import Link from "next/link";
import {
  getBrands,
  getCategories,
  getFilteredProducts,
} from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearchForm } from "@/components/ProductSearchForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "メンズコスメ商品一覧｜カテゴリ・ブランド・価格帯で検索",
  description:
    "メンズコスメの商品データベース。洗顔料・化粧水・乳液・オールインワン・BBクリーム・日焼け止めなどカテゴリ別に検索。AIレビュー分析つきで比較しやすい。",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const categorySlug =
    typeof searchParams.category === "string" ? searchParams.category : null;
  const brandSlug =
    typeof searchParams.brand === "string" ? searchParams.brand : null;
  const query =
    typeof searchParams.q === "string" ? searchParams.q : null;

  const [allCategories, allBrands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getFilteredProducts({ categorySlug, brandSlug, query }),
  ]);

  function buildHref(overrides: {
    category?: string | null;
    brand?: string | null;
  }) {
    const params = new URLSearchParams();
    const cat =
      overrides.category !== undefined ? overrides.category : categorySlug;
    const br = overrides.brand !== undefined ? overrides.brand : brandSlug;
    if (cat) params.set("category", cat);
    if (br) params.set("brand", br);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <>
      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">商品一覧</h1>
          <p className="text-sm text-foreground-muted mb-6">
            メンズコスメをカテゴリーから探す
          </p>
          <div className="max-w-2xl">
            <ProductSearchForm />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-56 shrink-0">
              <h2 className="text-sm font-bold text-foreground mb-4">
                カテゴリー
              </h2>
              <ul className="space-y-1 mb-8">
                <li>
                  <Link
                    href={buildHref({ category: null })}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      !categorySlug
                        ? "bg-foreground text-white font-medium"
                        : "text-foreground-muted hover:bg-background-secondary"
                    }`}
                  >
                    すべて
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={buildHref({ category: cat.slug })}
                      className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        categorySlug === cat.slug
                          ? "bg-foreground text-white font-medium"
                          : "text-foreground-muted hover:bg-background-secondary"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="text-sm font-bold text-foreground mb-4">
                ブランド
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={buildHref({ brand: null })}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      !brandSlug
                        ? "bg-foreground text-white font-medium"
                        : "text-foreground-muted hover:bg-background-secondary"
                    }`}
                  >
                    すべて
                  </Link>
                </li>
                {allBrands.map((brand) => (
                  <li key={brand.id}>
                    <Link
                      href={buildHref({ brand: brand.slug })}
                      className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        brandSlug === brand.slug
                          ? "bg-foreground text-white font-medium"
                          : "text-foreground-muted hover:bg-background-secondary"
                      }`}
                    >
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="flex-1">
              {query && (
                <p className="text-sm text-foreground-muted mb-4">
                  「{query}」の検索結果: {products.length}件
                </p>
              )}
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-foreground-muted">
                    該当する商品がありません
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
