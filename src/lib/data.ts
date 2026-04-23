import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import type { Brand, Category, ProductWithRelations } from "./types";

const REVALIDATE = 3600;

export const categoryEnNames: Record<string, string> = {
  "face-wash": "FACE WASH",
  toner: "TONER",
  emulsion: "EMULSION",
  "all-in-one": "ALL IN ONE",
  "bb-cream": "BB CREAM",
  sunscreen: "SUN SCREEN",
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
  { revalidate: REVALIDATE }
);

export const getBrands = unstable_cache(
  async (): Promise<Brand[]> => {
    const { data } = await supabase
      .from("brands")
      .select("*")
      .order("id");
    return data ?? [];
  },
  ["brands"],
  { revalidate: REVALIDATE }
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
  { revalidate: REVALIDATE }
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
  { revalidate: REVALIDATE }
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
  { revalidate: REVALIDATE }
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
  { revalidate: REVALIDATE }
);
