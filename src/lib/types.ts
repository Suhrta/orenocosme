export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  official_url: string | null;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type Product = {
  id: number;
  brand_id: number;
  category_id: number;
  name: string;
  slug: string;
  price: number | null;
  volume: string | null;
  image_url: string | null;
  description: string | null;
  ingredients: string | null;
  features: string[] | null;
  affiliate_links: Record<string, string> | null;
  ai_review_pros: string[] | null;
  ai_review_cons: string[] | null;
  amazon_rating: number | null;
  amazon_review_count: number | null;
  rakuten_rating: number | null;
  rakuten_review_count: number | null;
  created_at: string;
};

export type ProductWithRelations = Product & {
  brands: Brand | null;
  categories: Category | null;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  body: string | null;
  category: string | null;
  related_product_ids: number[] | null;
  published_at: string | null;
  created_at: string;
};
