import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://oreno-cosme.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: products }, { data: categories }, { data: brands }] =
    await Promise.all([
      supabase.from("products").select("slug, created_at"),
      supabase.from("categories").select("slug"),
      supabase.from("brands").select("slug"),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ranking`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map(
    (c) => ({
      url: `${BASE_URL}/products?category=${c.slug}`,
      changeFrequency: "daily",
      priority: 0.7,
    })
  );

  const brandPages: MetadataRoute.Sitemap = (brands ?? []).map((b) => ({
    url: `${BASE_URL}/products?brand=${b.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages];
}
