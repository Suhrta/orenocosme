import Link from "next/link";

const footerLinks = [
  {
    title: "サービス",
    links: [
      { label: "ランキング", href: "/ranking" },
      { label: "商品検索", href: "/products" },
      { label: "AI肌診断", href: "/diagnosis" },
    ],
  },
  {
    title: "コンテンツ",
    links: [
      { label: "コラム", href: "/articles" },
      { label: "ブランド一覧", href: "/brands" },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "お問い合わせ", href: "/contact" },
      { label: "利用規約", href: "/terms" },
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "運営者情報", href: "/about" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block">
              <span className="text-lg font-bold">オレのコスメ</span>
              <span className="block text-xs text-white/60 mt-1">
                メンズコスメ総合サイト
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              メンズコスメの口コミ・レビュー・ランキングからあなたに合ったアイテムが見つかる。
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-xs text-white/40">
          &copy; 2026 オレのコスメ All rights reserved.
        </div>
      </div>
    </footer>
  );
}
