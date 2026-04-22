import { supabase } from "./supabase";
import type { Brand, Category, ProductWithRelations } from "./types";

export const categoryEnNames: Record<string, string> = {
  "face-wash": "FACE WASH",
  toner: "TONER",
  emulsion: "EMULSION",
  "all-in-one": "ALL IN ONE",
  "bb-cream": "BB CREAM",
  sunscreen: "SUN SCREEN",
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

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  const { data } = await supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .eq("slug", slug)
    .single();
  return (data as ProductWithRelations) ?? null;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<ProductWithRelations[]> {
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

export async function getProductsByBrand(
  brandSlug: string
): Promise<ProductWithRelations[]> {
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
