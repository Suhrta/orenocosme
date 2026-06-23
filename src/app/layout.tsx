import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Antique } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const zenAntique = Zen_Antique({
  variable: "--font-zen-antique",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oreno-cosme.com"),
  title: {
    default: "オレのコスメ｜メンズコスメの口コミ分析・おすすめ比較【2026年】",
    template: "%s | オレのコスメ",
  },
  description:
    "メンズコスメの口コミをAIが徹底分析。洗顔・化粧水・乳液・オールインワンの本当の評判がわかる。Amazon・楽天の口コミからメリット・デメリットを要約。ランキング・肌診断も無料。",
  openGraph: {
    siteName: "オレのコスメ",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/images/hero-bg.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "SkjBxjLv2pAcLHZFANQMzW2eczSbQOJIejDPeOtlx2o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${zenAntique.variable} antialiased`}>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
