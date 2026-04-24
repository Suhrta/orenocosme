import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/types";
import { categoryEnNames } from "@/lib/data";

const categoryImages: Record<string, string> = {
  "face-wash": "/images/products/face-wash.png",
  toner: "/images/products/toner.png",
  emulsion: "/images/products/emulsion.png",
  "all-in-one": "/images/products/all-in-one.png",
  "bb-cream": "/images/products/bb-cream.png",
  sunscreen: "/images/categories/sunscreen.png",
};

export function CategoryCard({ category }: { category: Category }) {
  const imageUrl = categoryImages[category.slug];

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block text-center"
    >
      <div className="aspect-square bg-background-secondary rounded-lg overflow-hidden mb-3 relative transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 33vw, 16vw"
            className={`object-cover ${category.slug === "bb-cream" ? "object-right" : ""}`}
            {...(imageUrl.endsWith(".svg") && { unoptimized: true })}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground" />
        )}
      </div>
      <p className="text-sm font-medium text-foreground">{category.name}</p>
      <p className="text-xs text-foreground-muted">
        {categoryEnNames[category.slug]}
      </p>
    </Link>
  );
}
