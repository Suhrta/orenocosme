import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI肌診断｜あなたの肌質にぴったりのメンズコスメを無料で提案",
  description:
    "5つの質問に答えるだけで、AIがあなたの肌質（乾燥肌・脂性肌・混合肌・敏感肌）を分析。肌悩みに合ったメンズコスメを無料でおすすめします。登録不要。",
};

export default function DiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
