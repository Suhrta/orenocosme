import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import {
  getArticles,
  getArticleBySlug,
  getProductsByIds,
} from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const description = article.body
    ? article.body
        .replace(/[#*\-\[\]()>]/g, "")
        .replace(/\n+/g, " ")
        .slice(0, 120)
    : "";

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `https://oreno-cosme.com/articles/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${article.title} | オレのコスメ`,
      description,
    },
  };
}

const categoryLabels: Record<string, string> = {
  beginner: "初心者向け",
  skincare: "スキンケア",
  makeup: "メイク",
  age: "年代別",
};

export default async function ArticleDetailPage(
  props: PageProps<"/articles/[slug]">
) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const relatedProducts = article.related_product_ids
    ? await getProductsByIds(article.related_product_ids)
    : [];

  const articleUrl = `https://oreno-cosme.com/articles/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.published_at,
    dateModified: article.published_at ?? article.created_at,
    mainEntityOfPage: articleUrl,
    image: "https://oreno-cosme.com/images/hero-bg.png",
    author: {
      "@type": "Organization",
      name: "オレのコスメ",
      url: "https://oreno-cosme.com",
    },
    publisher: {
      "@type": "Organization",
      name: "オレのコスメ",
      logo: {
        "@type": "ImageObject",
        url: "https://oreno-cosme.com/icon.png",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "トップ", item: "https://oreno-cosme.com" },
      { "@type": "ListItem", position: 2, name: "コラム", item: "https://oreno-cosme.com/articles" },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-foreground-muted flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            トップ
          </Link>
          <span>/</span>
          <Link
            href="/articles"
            className="hover:text-foreground transition-colors"
          >
            コラム
          </Link>
          <span>/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <header className="mb-8">
          {article.category && (
            <span className="inline-block text-[10px] font-medium tracking-wider px-2 py-1 bg-background-secondary text-foreground-muted rounded mb-3">
              {categoryLabels[article.category] ?? article.category}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-brush">
            {article.title}
          </h1>
          {article.published_at && (
            <time className="text-sm text-foreground-muted">
              {new Date(article.published_at).toLocaleDateString("ja-JP")}
            </time>
          )}
        </header>

        <div className="prose-custom">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-foreground mt-10 mb-4 font-brush">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold text-foreground mt-8 mb-3 font-brush">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 mb-4 ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2 mb-4 ml-4 list-decimal">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-sm text-foreground-muted leading-relaxed">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">{children}</strong>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border border-border">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-background-secondary">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-border px-3 py-2 text-left font-bold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-3 py-2 text-foreground-muted">
                  {children}
                </td>
              ),
              tr: ({ children }) => (
                <tr className="even:bg-background-secondary">{children}</tr>
              ),
              hr: () => <hr className="border-border my-8" />,
            }}
          >
            {article.body ?? ""}
          </Markdown>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">
              関連商品
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
