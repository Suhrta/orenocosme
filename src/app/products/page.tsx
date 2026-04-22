import Link from "next/link";
import {
  getProducts,
  getProductsByCategory,
  getCategories,
} from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : null;

  const [allCategories, products] = await Promise.all([
    getCategories(),
    categorySlug ? getProductsByCategory(categorySlug) : getProducts(),
  ]);

  return (
    <>
      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">商品一覧</h1>
          <p className="text-sm text-foreground-muted">
            メンズコスメをカテゴリーから探す
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-56 shrink-0">
              <h2 className="text-sm font-bold text-foreground mb-4">
                カテゴリー
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
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
                      href={`/products?category=${cat.slug}`}
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
            </aside>

            <div className="flex-1">
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
