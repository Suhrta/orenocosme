-- =============================================
-- brands
-- =============================================
create table if not exists brands (
  id serial primary key,
  name text not null,
  slug text not null unique,
  logo_url text,
  description text,
  official_url text,
  created_at timestamptz default now()
);

-- =============================================
-- categories
-- =============================================
create table if not exists categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  sort_order int default 0
);

-- =============================================
-- products
-- =============================================
create table if not exists products (
  id serial primary key,
  brand_id int references brands(id),
  category_id int references categories(id),
  name text not null,
  slug text not null unique,
  price int,
  volume text,
  image_url text,
  description text,
  ingredients text,
  features text[],
  affiliate_links jsonb default '{}',
  ai_review_pros text[],
  ai_review_cons text[],
  amazon_rating numeric(2,1),
  amazon_review_count int,
  rakuten_rating numeric(2,1),
  rakuten_review_count int,
  created_at timestamptz default now()
);

-- =============================================
-- articles
-- =============================================
create table if not exists articles (
  id serial primary key,
  title text not null,
  slug text not null unique,
  body text,
  category text,
  related_product_ids int[],
  published_at timestamptz,
  created_at timestamptz default now()
);

-- =============================================
-- RLS: enable + anon read access
-- =============================================
alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table articles enable row level security;

create policy "Allow public read access on brands"
  on brands for select to anon using (true);

create policy "Allow public read access on categories"
  on categories for select to anon using (true);

create policy "Allow public read access on products"
  on products for select to anon using (true);

create policy "Allow public read access on articles"
  on articles for select to anon using (true);
