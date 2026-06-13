import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import type { Article, Brand, Category, ProductWithRelations } from "./types";

// 商品・記事は日次更新程度なので 1 時間キャッシュ（ISR）。
// 下層の Supabase fetch は no-store だが、unstable_cache が「関数の返り値」を
// Next のデータキャッシュに保持するため、ミス時のみ DB に問い合わせる。
const REVALIDATE = 3600;
const CATALOG_TAG = "catalog";
const ARTICLES_TAG = "articles";

export const categoryEnNames: Record<string, string> = {
  "face-wash": "FACE WASH",
  toner: "TONER",
  emulsion: "EMULSION",
  "all-in-one": "ALL IN ONE",
  "bb-cream": "BB CREAM",
  sunscreen: "SUN SCREEN",
  serum: "SERUM",
};

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    return data ?? [];
  },
  ["categories"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getBrands = unstable_cache(
  async (): Promise<Brand[]> => {
    const { data } = await supabase.from("brands").select("*").order("id");
    return data ?? [];
  },
  ["brands"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getProducts = unstable_cache(
  async (limit?: number): Promise<ProductWithRelations[]> => {
    let query = supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .order("id");
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as ProductWithRelations[]) ?? [];
  },
  ["products"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<ProductWithRelations | null> => {
    const { data } = await supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .eq("slug", slug)
      .single();
    return (data as ProductWithRelations) ?? null;
  },
  ["product-by-slug"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getProductsByCategory = unstable_cache(
  async (categorySlug: string): Promise<ProductWithRelations[]> => {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (!cat) return [];
    const { data } = await supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .eq("category_id", cat.id)
      .order("id");
    return (data as ProductWithRelations[]) ?? [];
  },
  ["products-by-category"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

// PostgREST の or() / ilike で意味を持つ文字を除去してから検索する。
// 特に "." はフィルタ構文（field.op.value）を壊すため必須。
function sanitizeKeyword(raw: string): string {
  return raw.replace(/[,()."*:%]/g, "").trim();
}

export const getFilteredProducts = unstable_cache(
  async (filters: {
    categorySlug?: string | null;
    brandSlug?: string | null;
    query?: string | null;
  }): Promise<ProductWithRelations[]> => {
    let categoryId: number | null = null;
    let brandId: number | null = null;

    if (filters.categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.categorySlug)
        .single();
      if (!cat) return [];
      categoryId = cat.id;
    }

    if (filters.brandSlug) {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", filters.brandSlug)
        .single();
      if (!brand) return [];
      brandId = brand.id;
    }

    let query = supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .order("id");

    if (categoryId != null) query = query.eq("category_id", categoryId);
    if (brandId != null) query = query.eq("brand_id", brandId);

    if (filters.query) {
      const keywords = filters.query
        .split(/[\s　]+/)
        .map(sanitizeKeyword)
        .filter(Boolean);
      for (const kw of keywords) {
        const { data: matchingBrands } = await supabase
          .from("brands")
          .select("id")
          .ilike("name", `%${kw}%`);
        const brandIds = (matchingBrands ?? []).map((b) => b.id);

        const orParts = [`name.ilike.%${kw}%`];
        if (brandIds.length > 0) {
          orParts.push(`brand_id.in.(${brandIds.join(",")})`);
        }
        query = query.or(orParts.join(","));
      }
    }

    const { data } = await query;
    return (data as ProductWithRelations[]) ?? [];
  },
  ["filtered-products"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getProductsByBrand = unstable_cache(
  async (brandSlug: string): Promise<ProductWithRelations[]> => {
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brandSlug)
      .single();
    if (!brand) return [];
    const { data } = await supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .eq("brand_id", brand.id)
      .order("id");
    return (data as ProductWithRelations[]) ?? [];
  },
  ["products-by-brand"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getRankedProducts = unstable_cache(
  async (categorySlug?: string): Promise<ProductWithRelations[]> => {
    let query = supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .not("amazon_rating", "is", null)
      .gte("amazon_review_count", 10)
      .order("amazon_rating", { ascending: false })
      .order("amazon_review_count", { ascending: false });

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }

    const { data } = await query;
    return (data as ProductWithRelations[]) ?? [];
  },
  ["ranked-products"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getReviewedProducts = unstable_cache(
  async (limit = 5): Promise<ProductWithRelations[]> => {
    const { data } = await supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .not("ai_review_pros", "is", null)
      .not("amazon_rating", "is", null)
      .order("amazon_review_count", { ascending: false })
      .limit(limit);
    return (data as ProductWithRelations[]) ?? [];
  },
  ["reviewed-products"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);

export const getArticles = unstable_cache(
  async (): Promise<Article[]> => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });
    return (data as Article[]) ?? [];
  },
  ["articles"],
  { revalidate: REVALIDATE, tags: [ARTICLES_TAG] }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();
    return (data as Article) ?? null;
  },
  ["article-by-slug"],
  { revalidate: REVALIDATE, tags: [ARTICLES_TAG] }
);

export const getProductsByIds = unstable_cache(
  async (ids: number[]): Promise<ProductWithRelations[]> => {
    if (ids.length === 0) return [];
    const { data } = await supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .in("id", ids);
    return (data as ProductWithRelations[]) ?? [];
  },
  ["products-by-ids"],
  { revalidate: REVALIDATE, tags: [CATALOG_TAG] }
);
