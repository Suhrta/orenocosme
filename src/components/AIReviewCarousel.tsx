"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/lib/types";

export function AIReviewCarousel({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback(
    (next: number) => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((next + products.length) % products.length);
        setVisible(true);
      }, 300);
    },
    [products.length]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo(current + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  if (products.length === 0) return null;
  const product = products[current];

  return (
    <div className="max-w-3xl mx-auto relative">
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-10 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-foreground transition-colors z-10"
        aria-label="前の商品"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-10 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-foreground transition-colors z-10"
        aria-label="次の商品"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        className="bg-white rounded-lg border border-border p-5 md:p-6 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <Link
            href={`/products/${product.slug}`}
            className="w-16 h-16 bg-background-secondary rounded-lg shrink-0 hover:bg-border transition-colors relative overflow-hidden"
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-12 bg-border rounded" />
              </div>
            )}
          </Link>
          <div>
            <p className="text-xs text-foreground-muted">
              {product.brands?.name}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-bold text-foreground hover:underline"
            >
              {product.name}
            </Link>
            {product.amazon_rating != null && (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(product.amazon_rating!) ? "#111" : "#ddd"}
                    stroke="none"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <span className="text-xs text-foreground-muted ml-1">
                  {product.amazon_rating}
                  {product.amazon_review_count != null &&
                    ` (${product.amazon_review_count.toLocaleString()}件の口コミを分析)`}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {product.ai_review_pros && product.ai_review_pros.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                  +
                </span>
                <h4 className="text-sm font-bold text-foreground">メリット</h4>
              </div>
              <ul className="space-y-2">
                {product.ai_review_pros.map((pro, i) => (
                  <li key={i} className="text-sm text-foreground-muted flex gap-2">
                    <span className="text-green-600 shrink-0">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.ai_review_cons && product.ai_review_cons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                  -
                </span>
                <h4 className="text-sm font-bold text-foreground">デメリット</h4>
              </div>
              <ul className="space-y-2">
                {product.ai_review_cons.map((con, i) => (
                  <li key={i} className="text-sm text-foreground-muted flex gap-2">
                    <span className="text-red-600 shrink-0">-</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-foreground hover:text-foreground-muted transition-colors inline-flex items-center gap-1"
          >
            この商品の詳細を見る
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-foreground" : "bg-border"
            }`}
            aria-label={`商品 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
