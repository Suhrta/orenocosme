import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI肌診断",
  description:
    "簡単な質問に答えるだけで、AIがあなたの肌質を分析。最適なメンズコスメをご提案します。無料で診断できます。",
};

export default function DiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
