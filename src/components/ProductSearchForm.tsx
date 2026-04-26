"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ProductSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const q = value.trim();
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleClear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="商品名・ブランド名で検索"
        className="w-full pl-10 pr-20 py-3 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-foreground transition-colors"
        aria-label="商品検索"
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-foreground-muted hover:text-foreground"
          aria-label="クリア"
        >
          クリア
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-white text-xs font-medium rounded hover:bg-foreground/90 transition-colors"
      >
        検索
      </button>
    </form>
  );
}
