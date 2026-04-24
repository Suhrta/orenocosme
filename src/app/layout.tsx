import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oreno-cosme.com"),
  title: {
    default: "オレのコスメ | メンズコスメの総合ガイド",
    template: "%s | オレのコスメ",
  },
  description:
    "メンズコスメ選びに迷ったら、ここ。AIレビュー分析×商品データベースで、あなたに合ったメンズコスメが見つかる。",
  openGraph: {
    siteName: "オレのコスメ",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/images/hero-bg.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
