import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const brandName = product.brands?.name;
  const title = brandName
    ? `${product.name} | ${brandName}`
    : product.name;
  const description = `${product.name}の口コミ・評判をAI分析。メリット・デメリットをわかりやすく紹介。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | オレのコスメ`,
      description,
      ...(product.image_url && {
        images: [{ url: product.image_url }],
      }),
    },
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const brand = product.brands;
  const category = product.categories;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    ...(product.image_url && { image: product.image_url }),
    ...(brand && {
      brand: { "@type": "Brand", name: brand.name },
    }),
    ...(product.price != null && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "JPY",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(product.amazon_rating != null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.amazon_rating,
        bestRating: 5,
        ...(product.amazon_review_count != null && {
          reviewCount: product.amazon_review_count,
        }),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-foreground-muted flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            トップ
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            商品一覧
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-background-secondary rounded-lg flex items-center justify-center p-8 relative overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="w-24 h-36 bg-border rounded" />
            )}
          </div>

          <div>
            {brand && (
              <Link
                href="/brands"
                className="text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                {brand.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1 mb-4">
              {product.name}
            </h1>

            {category && (
              <span className="inline-block text-xs px-3 py-1 bg-background-secondary text-foreground-muted rounded-full mb-4">
                {category.name}
              </span>
            )}

            {product.price != null && (
              <p className="text-3xl font-bold text-foreground mb-6">
                &yen;{product.price.toLocaleString()}
                {product.volume && (
                  <span className="text-sm font-normal text-foreground-muted ml-2">
                    ({product.volume})
                  </span>
                )}
              </p>
            )}

            {product.description && (
              <p className="text-sm text-foreground-muted leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-foreground mb-3">特徴</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground-muted flex gap-2"
                    >
                      <span className="text-foreground">-</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(product.amazon_rating != null ||
              product.rakuten_rating != null) && (
              <div className="flex items-center gap-4 mb-6">
                {product.amazon_rating != null && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-[#FF9900] text-white rounded">
                      Amazon
                    </span>
                    <div className="flex items-center gap-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#FF9900"
                        stroke="none"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {product.amazon_rating}
                      </span>
                      {product.amazon_review_count != null && (
                        <span className="text-xs text-foreground-muted">
                          ({product.amazon_review_count.toLocaleString()}件)
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {product.rakuten_rating != null && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-[#BF0000] text-white rounded">
                      楽天
                    </span>
                    <div className="flex items-center gap-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#BF0000"
                        stroke="none"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {product.rakuten_rating}
                      </span>
                      {product.rakuten_review_count != null && (
                        <span className="text-xs text-foreground-muted">
                          ({product.rakuten_review_count.toLocaleString()}件)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {product.affiliate_links?.a8 && (
                <a
                  href={product.affiliate_links.a8}
                  target="_blank"
                  rel="nofollow noopener"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm"
                >
                  公式サイトで購入
                </a>
              )}
              <a
                href={product.affiliate_links?.amazon ?? "#"}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm"
              >
                Amazonで購入
              </a>
              <a
                href={product.affiliate_links?.rakuten ?? "#"}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-foreground text-foreground font-medium rounded hover:bg-foreground hover:text-white transition-colors text-sm"
              >
                楽天市場で購入
              </a>
            </div>

            {/* AI Review - Pros & Cons */}
            {((product.ai_review_pros && product.ai_review_pros.length > 0) ||
              (product.ai_review_cons && product.ai_review_cons.length > 0)) && (
              <div className="mt-8 space-y-4">
                {product.ai_review_pros && product.ai_review_pros.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-xs font-bold">
                        +
                      </span>
                      <h3 className="text-sm font-bold text-foreground">
                        メリット
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {product.ai_review_pros.map((pro, i) => (
                        <li
                          key={i}
                          className="text-sm text-foreground flex gap-2"
                        >
                          <span className="text-green-600 shrink-0 font-bold">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.ai_review_cons && product.ai_review_cons.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold">
                        -
                      </span>
                      <h3 className="text-sm font-bold text-foreground">
                        デメリット
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {product.ai_review_cons.map((con, i) => (
                        <li
                          key={i}
                          className="text-sm text-foreground flex gap-2"
                        >
                          <span className="text-red-600 shrink-0 font-bold">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
