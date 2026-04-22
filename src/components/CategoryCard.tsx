import Link from "next/link";
import { Droplets, Sun, Sparkles, Wind, Scissors, FlaskConical } from "lucide-react";
import { Category } from "@/lib/types";
import { categoryEnNames } from "@/lib/data";

const categoryIcons: Record<string, React.ReactNode> = {
  "face-wash": <Droplets size={40} strokeWidth={1.5} />,
  toner: <FlaskConical size={40} strokeWidth={1.5} />,
  emulsion: <Wind size={40} strokeWidth={1.5} />,
  "all-in-one": <Sparkles size={40} strokeWidth={1.5} />,
  "bb-cream": <Sun size={40} strokeWidth={1.5} />,
  sunscreen: <Scissors size={40} strokeWidth={1.5} />,
};

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block text-center"
    >
      <div className="aspect-square bg-background-secondary rounded-lg overflow-hidden mb-3 flex items-center justify-center group-hover:shadow-md transition-shadow text-foreground">
        {categoryIcons[category.slug]}
      </div>
      <p className="text-sm font-medium text-foreground">{category.name}</p>
      <p className="text-xs text-foreground-muted">
        {categoryEnNames[category.slug]}
      </p>
    </Link>
  );
}
