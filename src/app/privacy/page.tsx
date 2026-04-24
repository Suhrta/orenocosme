import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "オレのコスメのプライバシーポリシーページです。個人情報の取り扱い、Cookie・アクセス解析、アフィリエイトプログラム、免責事項について記載しています。",
};

const sections = [
  {
    title: "個人情報の取り扱いについて",
    content:
      "当サイトでは、お問い合わせやコメントの際に、お名前・メールアドレス等の個人情報をご提供いただく場合があります。取得した個人情報は、お問い合わせへの回答や必要な情報のご連絡のみに利用し、これらの目的以外では利用いたしません。また、取得した個人情報は適切に管理し、第三者への開示・提供は行いません（法令に基づく場合を除く）。",
  },
  {
    title: "Cookie・アクセス解析について",
    content:
      "当サイトでは、Googleによるアクセス解析ツール「Google Analytics」を使用しています。Google Analyticsはデータの収集のためにCookieを使用しますが、このデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否できますので、お使いのブラウザの設定をご確認ください。Google Analyticsの利用規約およびプライバシーポリシーについては、Google Analyticsのサイトをご確認ください。",
  },
  {
    title: "アフィリエイトプログラムについて",
    content:
      "当サイトは、Amazon.co.jpアソシエイト、楽天アフィリエイト、A8.net等のアフィリエイトプログラムに参加しています。当サイト内のリンクを経由して商品を購入された場合、当サイトに紹介料が支払われることがあります。商品の価格や在庫状況はリンク先の各サイトの情報が正となります。",
  },
  {
    title: "AIによるレビュー分析について",
    content:
      "当サイトでは、各商品のレビュー・口コミ情報をAI（人工知能）を活用して分析・要約しています。AI分析の結果は、多数の口コミから傾向を抽出したものであり、個々のレビューの正確性を保証するものではありません。また、AI分析結果は参考情報としてご利用いただき、最終的な購入判断はご自身の責任にてお願いいたします。",
  },
  {
    title: "免責事項",
    content:
      "当サイトに掲載されている商品情報（価格、成分、効果・効能等）は、各ECサイトやメーカー公式情報に基づいていますが、情報の正確性・最新性を完全に保証するものではありません。商品の価格は変動する可能性があり、在庫状況も常に変化します。当サイトの情報を利用して生じた損害について、当サイトは一切の責任を負いません。商品の購入やご使用は、ご自身の判断と責任にてお願いいたします。",
  },
  {
    title: "プライバシーポリシーの変更について",
    content:
      "当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。",
  },
  {
    title: "お問い合わせ",
    content:
      "本ポリシーに関するお問い合わせは、下記メールアドレスまでご連絡ください。",
    email: "contact@example.com",
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          プライバシーポリシー
        </h1>
        <p className="text-sm text-foreground-muted mb-10">
          オレのコスメ（以下「当サイト」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
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
              {section.email && (
                <p className="text-sm text-foreground-muted mt-2">
                  メールアドレス：{section.email}
                </p>
              )}
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
