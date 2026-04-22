export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string;
  official_url: string;
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
  price: number;
  volume: string;
  image_url: string;
  description: string;
  ingredients: string;
  features: string[];
  affiliate_links: Record<string, string>;
  ai_review_pros: string[];
  ai_review_cons: string[];
  amazon_rating: number;
  amazon_review_count: number;
  rakuten_rating: number;
  rakuten_review_count: number;
  created_at: string;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  body: string;
  category: string;
  related_product_ids: number[];
  published_at: string;
  created_at: string;
};
