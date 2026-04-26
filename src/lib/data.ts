import { supabase } from "./supabase";
import type { Article, Brand, Category, ProductWithRelations } from "./types";

export const categoryEnNames: Record<string, string> = {
  "face-wash": "FACE WASH",
  toner: "TONER",
  emulsion: "EMULSION",
  "all-in-one": "ALL IN ONE",
  "bb-cream": "BB CREAM",
  sunscreen: "SUN SCREEN",
  serum: "SERUM",
};

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getBrands(): Promise<Brand[]> {
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("id");
  return data ?? [];
}

export async function getProducts(limit?: number): Promise<ProductWithRelations[]> {
  let query = supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .order("id");
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as ProductWithRelations[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const { data } = await supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .eq("slug", slug)
    .single();
  return (data as ProductWithRelations) ?? null;
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductWithRelations[]> {
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
}

export async function getFilteredProducts(filters: {
  categorySlug?: string | null;
  brandSlug?: string | null;
  query?: string | null;
}): Promise<ProductWithRelations[]> {
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
    .select("*, brands!inner(*), categories(*)")
    .order("id");

  if (categoryId != null) query = query.eq("category_id", categoryId);
  if (brandId != null) query = query.eq("brand_id", brandId);

  if (filters.query) {
    const keywords = filters.query
      .split(/[\s　]+/)
      .map((k) => k.replace(/,/g, "").trim())
      .filter(Boolean);
    for (const kw of keywords) {
      query = query.or(`name.ilike.%${kw}%,brands.name.ilike.%${kw}%`);
    }
  }

  const { data } = await query;
  return (data as ProductWithRelations[]) ?? [];
}

export async function getProductsByBrand(brandSlug: string): Promise<ProductWithRelations[]> {
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
}

export async function getRankedProducts(categorySlug?: string): Promise<ProductWithRelations[]> {
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
}

export async function getReviewedProducts(limit = 5): Promise<ProductWithRelations[]> {
  const { data } = await supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .not("ai_review_pros", "is", null)
    .not("amazon_rating", "is", null)
    .order("amazon_review_count", { ascending: false })
    .limit(limit);
  return (data as ProductWithRelations[]) ?? [];
}

export async function getArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  return (data as Article[]) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Article) ?? null;
}

export async function getProductsByIds(ids: number[]): Promise<ProductWithRelations[]> {
  if (ids.length === 0) return [];
  const { data } = await supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .in("id", ids);
  return (data as ProductWithRelations[]) ?? [];
}
