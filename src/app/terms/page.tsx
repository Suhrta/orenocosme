import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "オレのコスメの利用規約ページです。サービスの利用条件、免責事項、禁止事項等について記載しています。",
};

const sections = [
  {
    title: "サービスの利用について",
    content:
      "本利用規約（以下「本規約」）は、オレのコスメ（https://oreno-cosme.com、以下「当サイト」）の利用に関する条件を定めるものです。当サイトをご利用いただいた時点で、本規約に同意いただいたものとみなします。",
  },
  {
    title: "知的財産権について",
    content:
      "当サイトに掲載されているテキスト、画像、デザイン、ロゴ、その他のコンテンツに関する著作権は、当サイト運営者に帰属します。特に、AIレビュー分析の結果およびAI肌診断の分析結果は、当サイトが独自に生成・編集したコンテンツであり、無断での複製・転載・再配布を禁止します。",
  },
  {
    title: "免責事項",
    content:
      "当サイトに掲載されている商品情報（価格、成分、効果・効能、評価等）は、Amazon.co.jp、楽天市場、各メーカー公式サイト等の情報に基づいていますが、情報の正確性・最新性を完全に保証するものではありません。商品の価格は変動する可能性があり、在庫状況も常に変化します。当サイトにはアフィリエイトリンクが含まれており、リンク経由で商品を購入された場合、当サイトに紹介料が支払われることがあります。当サイトの情報を利用して生じた損害について、当サイトは一切の責任を負いません。",
  },
  {
    title: "AIによる分析・診断の免責",
    content:
      "当サイトで提供するAIレビュー分析およびAI肌診断は、AI（人工知能）による自動分析に基づく参考情報です。これらは医学的な診断や医療行為ではなく、医療上のアドバイスに代わるものではありません。肌トラブルや健康上の懸念がある場合は、必ず医師や専門家にご相談ください。AI分析の結果に基づく商品選択や使用は、ご自身の判断と責任にてお願いいたします。",
  },
  {
    title: "禁止事項",
    content:
      "当サイトの利用にあたり、以下の行為を禁止します。当サイトのコンテンツの無断複製・転載・再配布。当サイトの運営を妨害する行為。不正アクセスやスクレイピング等の自動収集行為。当サイトの名称やコンテンツを利用した誤解を招く表示。その他、法令または公序良俗に反する行為。",
  },
  {
    title: "規約の変更について",
    content:
      "当サイトは、必要に応じて本規約の内容を変更することがあります。変更後の利用規約は、当ページに掲載した時点で効力を生じるものとします。重要な変更がある場合は、当サイト上でお知らせいたします。",
  },
];

export default function TermsPage() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          利用規約
        </h1>
        <p className="text-sm text-foreground-muted mb-10">
          オレのコスメ（以下「当サイト」）をご利用いただくにあたり、以下の利用規約をお読みください。
        </p>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-foreground mb-3">
                {i + 1}. {section.title}
              </h2>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-sm text-foreground-muted">
          <p>制定日：2026年4月24日</p>
          <p className="mt-1">運営者：個人運営</p>
        </div>
      </div>
    </section>
  );
}
