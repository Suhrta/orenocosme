import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { getBrandById } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const brand = getBrandById(product.brand_id);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-background-secondary flex items-center justify-center p-6">
        <Image
          src={product.image_url}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        {brand && (
          <p className="text-xs text-foreground-muted mb-1">{brand.name}</p>
        )}
        <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
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
            <span className="text-sm font-medium">{product.amazon_rating}</span>
          </div>
          <span className="text-xs text-foreground-muted">
            ({product.amazon_review_count.toLocaleString()}件)
          </span>
        </div>
        <p className="text-sm font-bold text-foreground">
          &yen;{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
