import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "オレのコスメへのお問い合わせページです。ご質問・ご要望はメールにてお気軽にご連絡ください。",
};

export default function ContactPage() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          お問い合わせ
        </h1>
        <p className="text-sm text-foreground-muted mb-10">
          当サイトに関するご質問・ご要望がございましたら、下記までご連絡ください。
        </p>

        <div className="border border-border rounded-lg p-8 bg-white">
          <p className="text-sm text-foreground-muted leading-relaxed mb-6">
            お問い合わせはメールにてお願いいたします。
          </p>

          <div className="flex items-center gap-3 mb-6">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground shrink-0"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <a
              href="mailto:contact@oreno-cosme.com"
              className="text-sm font-medium text-foreground hover:text-foreground-muted transition-colors"
            >
              contact@oreno-cosme.com
            </a>
          </div>

          <p className="text-xs text-foreground-muted leading-relaxed">
            返信までに数日お時間をいただく場合がございます。あらかじめご了承ください。
          </p>
        </div>
      </div>
    </section>
  );
}
