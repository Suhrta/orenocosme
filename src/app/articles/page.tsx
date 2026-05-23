import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/data";

export const metadata: Metadata = {
  title: "メンズスキンケアコラム｜初心者ガイド・年代別ケア・トレンド情報",
  description:
    "メンズスキンケアの基礎知識からトレンドまで。洗顔のやり方・化粧水の選び方・20代30代40代の年代別ケアなど、初心者にもわかりやすく解説。",
};

const categoryLabels: Record<string, string> = {
  beginner: "初心者向け",
  skincare: "スキンケア",
  makeup: "メイク",
  age: "年代別",
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-brush">コラム</h1>
          <p className="text-sm text-foreground-muted">
            メンズスキンケアに関するお役立ち情報
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <p className="text-center text-foreground-muted py-20">
              記事は準備中です。メンズスキンケアに関する情報を随時更新していきます。
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {articles.map((article) => {
                const excerpt = article.body
                  ? article.body
                      .replace(/[#*\-\[\]()>]/g, "")
                      .replace(/\n+/g, " ")
                      .slice(0, 100)
                  : "";

                return (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="block border border-border rounded-lg p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {article.category && (
                      <span className="inline-block text-[10px] font-medium tracking-wider px-2 py-1 bg-background-secondary text-foreground-muted rounded mb-3">
                        {categoryLabels[article.category] ?? article.category}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    {excerpt && (
                      <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                        {excerpt}…
                      </p>
                    )}
                    {article.published_at && (
                      <time className="text-xs text-foreground-muted">
                        {new Date(article.published_at).toLocaleDateString(
                          "ja-JP"
                        )}
                      </time>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
