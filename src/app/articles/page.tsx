import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コラム",
  description:
    "メンズスキンケアに関するコラム・お役立ち情報。初心者向けガイドから年代別ケアまで幅広くお届けします。",
};

const upcomingArticles = [
  {
    title: "メンズスキンケアの始め方",
    subtitle: "初心者が最初に揃えるべき3アイテム",
  },
  {
    title: "肌タイプ別おすすめスキンケアルーティン",
    subtitle: "自分の肌質に合ったケアを見つけよう",
  },
  {
    title: "メンズBBクリームの選び方と塗り方ガイド",
    subtitle: "ナチュラルに仕上げるコツを解説",
  },
  {
    title: "年代別メンズスキンケア",
    subtitle: "20代・30代・40代で変わるケア",
  },
];

export default function ArticlesPage() {
  return (
    <>
      <section className="bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">コラム</h1>
          <p className="text-sm text-foreground-muted">
            メンズスキンケアに関するお役立ち情報
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-foreground-muted mb-12">
            記事は準備中です。メンズスキンケアに関する情報を随時更新していきます。
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {upcomingArticles.map((article) => (
              <div
                key={article.title}
                className="border border-border rounded-lg p-6 bg-white"
              >
                <span className="inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-1 bg-background-secondary text-foreground-muted rounded mb-4">
                  Coming Soon
                </span>
                <h3 className="text-base font-bold text-foreground mb-1">
                  {article.title}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {article.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
