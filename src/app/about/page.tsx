import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "オレのコスメの運営者情報ページです。サイト概要、運営者、お問い合わせ先について記載しています。",
};

const siteInfo = [
  { label: "サイト名", value: "オレのコスメ" },
  { label: "URL", value: "https://oreno-cosme.com", isLink: true },
  { label: "運営者", value: "個人運営（運営者名）" },
  { label: "お問い合わせ", value: "contact@example.com" },
];

export default function AboutPage() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
          運営者情報
        </h1>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <tbody>
              {siteInfo.map((item) => (
                <tr key={item.label} className="border-b border-border last:border-b-0">
                  <th className="text-left text-sm font-bold text-foreground bg-background-secondary px-6 py-4 w-1/3 align-top">
                    {item.label}
                  </th>
                  <td className="text-sm text-foreground-muted px-6 py-4">
                    {item.isLink ? (
                      <a
                        href={item.value}
                        className="underline hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-foreground mb-3">
            サイトについて
          </h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            「オレのコスメ」は、メンズコスメに特化した総合ガイドです。AIによるレビュー分析で、あなたに合ったメンズコスメが見つかります。各ECサイトやメーカーの情報をもとに、洗顔料・化粧水・乳液・日焼け止めなど幅広いカテゴリのメンズコスメを紹介しています。
          </p>
        </div>

        <div className="mt-8 text-sm text-foreground-muted">
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            プライバシーポリシーはこちら
          </Link>
        </div>
      </div>
    </section>
  );
}
