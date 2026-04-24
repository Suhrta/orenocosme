import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/lib/types";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="aspect-square bg-background-secondary flex items-center justify-center p-6 relative overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="w-16 h-24 bg-border rounded" />
        )}
      </div>
      <div className="p-3">
        {product.brands && (
          <p className="text-xs text-foreground-muted mb-1">
            {product.brands.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.amazon_rating != null && (
          <div className="flex items-center gap-2 mb-2">
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
        )}
        {product.price != null && (
          <p className="text-sm font-bold text-foreground">
            &yen;{product.price.toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  );
}
