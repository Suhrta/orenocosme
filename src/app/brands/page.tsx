import Link from "next/link";
import { getBrands } from "@/lib/data";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ブランド一覧
          </h1>
          <p className="text-sm text-foreground-muted">
            取り扱いメンズコスメブランド
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-background-secondary rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-foreground-muted">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {brand.name}
                    </h2>
                  </div>
                </div>
                {brand.description && (
                  <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                    {brand.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/products?category=`}
                    className="text-sm font-medium text-foreground hover:text-foreground-muted transition-colors flex items-center gap-1"
                  >
                    商品を見る
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
                  {brand.official_url && (
                    <a
                      href={brand.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                    >
                      公式サイト
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
