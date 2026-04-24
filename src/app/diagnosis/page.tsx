"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type DiagnosisResult = {
  skin_type: string;
  skin_type_description: string;
  scores: {
    moisture: number;
    oil_balance: number;
    texture: number;
    firmness: number;
  };
  overall_score: number;
  advice: string;
  recommended_products: {
    product: ProductWithRelations;
    reason: string;
  }[];
};

const TOTAL_STEPS = 7;

const skinTypeOptions = [
  "全体的にテカる",
  "全体的につっぱる",
  "Tゾーンだけテカり、頬は乾く",
  "赤みやヒリつきが出やすい",
];

const concernOptions = [
  "ニキビ・吹き出物",
  "毛穴の開き・黒ずみ",
  "シミ・くすみ",
  "乾燥・かさつき",
  "テカリ・ベタつき",
  "特になし",
];

const ageOptions = ["10代", "20代前半", "20代後半", "30代", "40代以上"];

const currentCareOptions = [
  "何もしていない",
  "洗顔のみ",
  "洗顔＋化粧水",
  "洗顔＋化粧水＋乳液以上",
];

const budgetOptions = [
  "〜1,000円",
  "1,000〜3,000円",
  "3,000〜5,000円",
  "5,000円以上",
];

const priorityOptions = [
  "コスパ",
  "ブランドの信頼感",
  "成分・低刺激",
  "手軽さ・時短",
];

export default function DiagnosisPage() {
  const [step, setStep] = useState<Step>(1);
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [currentCare, setCurrentCare] = useState("");
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("");
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");

  const progress = result ? 100 : ((step - 1) / TOTAL_STEPS) * 100;

  function selectSingle(value: string, setter: (v: string) => void) {
    setter(value);
    setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step), 200);
  }

  function toggleConcern(value: string) {
    if (value === "特になし") {
      setConcerns(["特になし"]);
      return;
    }
    setConcerns((prev) => {
      const filtered = prev.filter((c) => c !== "特になし");
      return filtered.includes(value)
        ? filtered.filter((c) => c !== value)
        : [...filtered, value];
    });
  }

  async function submitDiagnosis() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType,
          concerns,
          age,
          currentCare,
          budget,
          priority,
          freeText,
        }),
      });
      if (!res.ok) throw new Error("診断に失敗しました");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("診断中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(1);
    setSkinType("");
    setConcerns([]);
    setAge("");
    setCurrentCare("");
    setBudget("");
    setPriority("");
    setFreeText("");
    setResult(null);
    setError("");
  }

  function handleShare() {
    const text = `AI肌診断の結果：${result?.skin_type}（総合スコア ${result?.overall_score}/100）\nあなたも診断してみよう！`;
    const url = "https://oreno-cosme.com/diagnosis";
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText("https://oreno-cosme.com/diagnosis");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-3 border-border border-t-foreground rounded-full animate-spin mb-6" />
        <p className="text-lg font-bold text-foreground mb-2">AIが分析中...</p>
        <p className="text-sm text-foreground-muted">
          あなたに最適なスキンケアを診断しています
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-8 text-center">
          AI肌診断結果
        </h1>

        {/* Skin Type */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-medium px-3 py-1 bg-foreground text-white rounded-full mb-3">
            あなたの肌タイプ
          </span>
          <p className="text-3xl font-bold text-foreground mb-2">
            {result.skin_type}
          </p>
          <p className="text-sm text-foreground-muted">
            {result.skin_type_description}
          </p>
        </div>

        {/* Overall Score */}
        <div className="flex items-baseline justify-center gap-1 mb-8">
          <span className="text-sm text-foreground-muted mr-2">総合スコア</span>
          <span className="text-5xl font-bold text-foreground">
            {result.overall_score}
          </span>
          <span className="text-sm text-foreground-muted">/100</span>
        </div>

        {/* Score Bars */}
        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <div className="space-y-4">
            {[
              { label: "水分量", score: result.scores.moisture },
              { label: "皮脂バランス", score: result.scores.oil_balance },
              { label: "キメ", score: result.scores.texture },
              { label: "ハリ・弾力", score: result.scores.firmness },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-foreground-muted w-24 shrink-0 text-right">
                  {item.label}
                </span>
                <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground w-8 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Advice */}
        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 21h8M12 17v4M3.2 14.2l2.5-2.5M20.8 14.2l-2.5-2.5M18 8A6 6 0 0 0 6 8c0 4 3 6 3 8h6c0-2 3-4 3-8z" />
            </svg>
            AIアドバイス
          </h2>
          <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
            {result.advice}
          </p>
        </div>

        {/* Recommended Products */}
        {result.recommended_products.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-foreground mb-4">
              おすすめ商品
            </h2>
            <div className="space-y-4">
              {result.recommended_products.map(({ product, reason }) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="flex gap-4 bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-background-secondary rounded-lg shrink-0 relative overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-12 bg-border rounded" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {product.brands && (
                      <p className="text-xs text-foreground-muted">
                        {product.brands.name}
                      </p>
                    )}
                    <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-foreground-muted line-clamp-2">
                      {reason}
                    </p>
                    {product.price != null && (
                      <p className="text-sm font-bold text-foreground mt-1">
                        &yen;{product.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={reset}
            className="flex-1 px-6 py-3 border border-foreground text-foreground font-medium rounded hover:bg-foreground hover:text-white transition-colors text-sm"
          >
            もう一度診断する
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </button>
        </div>
        <button
          onClick={handleCopyUrl}
          className="w-full px-6 py-3 bg-background-secondary text-foreground-muted font-medium rounded hover:bg-border transition-colors text-sm"
        >
          結果URLをコピー
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-foreground-muted">
            質問 {step} / {TOTAL_STEPS}
          </span>
          <span className="text-xs text-foreground-muted">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-background-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">肌質</h1>
          <p className="text-sm text-foreground-muted mb-6">
            洗顔後、何もつけずに30分経つと肌はどうなりますか？
          </p>
          <div className="space-y-3">
            {skinTypeOptions.map((option) => (
              <button
                key={option}
                onClick={() => selectSingle(option, setSkinType)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                  skinType === option
                    ? "border-foreground bg-foreground text-white font-medium"
                    : "border-border bg-white text-foreground hover:border-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            肌の悩み
          </h1>
          <p className="text-sm text-foreground-muted mb-6">
            気になる肌悩みを選んでください（複数選択可）
          </p>
          <div className="space-y-3 mb-6">
            {concernOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleConcern(option)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                  concerns.includes(option)
                    ? "border-foreground bg-foreground text-white font-medium"
                    : "border-border bg-white text-foreground hover:border-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (concerns.length > 0) setStep(3);
            }}
            disabled={concerns.length === 0}
            className="w-full px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">年代</h1>
          <p className="text-sm text-foreground-muted mb-6">
            年代を教えてください
          </p>
          <div className="space-y-3">
            {ageOptions.map((option) => (
              <button
                key={option}
                onClick={() => selectSingle(option, setAge)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                  age === option
                    ? "border-foreground bg-foreground text-white font-medium"
                    : "border-border bg-white text-foreground hover:border-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            現在のスキンケア
          </h1>
          <p className="text-sm text-foreground-muted mb-6">
            今のスキンケアは？
          </p>
          <div className="space-y-3">
            {currentCareOptions.map((option) => (
              <button
                key={option}
                onClick={() => selectSingle(option, setCurrentCare)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                  currentCare === option
                    ? "border-foreground bg-foreground text-white font-medium"
                    : "border-border bg-white text-foreground hover:border-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">月の予算</h1>
          <p className="text-sm text-foreground-muted mb-6">
            スキンケアにかけられる月予算は？
          </p>
          <div className="space-y-3">
            {budgetOptions.map((option) => (
              <button
                key={option}
                onClick={() => selectSingle(option, setBudget)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                  budget === option
                    ? "border-foreground bg-foreground text-white font-medium"
                    : "border-border bg-white text-foreground hover:border-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6 */}
      {step === 6 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            重視すること
          </h1>
          <p className="text-sm text-foreground-muted mb-6">
            商品選びで一番重視するのは？
          </p>
          <div className="space-y-3">
            {priorityOptions.map((option) => (
              <button
                key={option}
                onClick={() => selectSingle(option, setPriority)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                  priority === option
                    ? "border-foreground bg-foreground text-white font-medium"
                    : "border-border bg-white text-foreground hover:border-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 7 */}
      {step === 7 && (
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            自由記述（任意）
          </h1>
          <p className="text-sm text-foreground-muted mb-6">
            肌の悩みや気になることがあれば自由に書いてください
          </p>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value.slice(0, 200))}
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 border border-border rounded-lg text-sm text-foreground bg-white resize-none focus:outline-none focus:border-foreground transition-colors"
            placeholder="例：最近ヒゲ剃り後に肌が荒れやすい..."
          />
          <p className="text-xs text-foreground-muted text-right mt-1 mb-6">
            {freeText.length}/200
          </p>
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={submitDiagnosis}
              className="w-full px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm"
            >
              診断する
            </button>
            <button
              onClick={() => {
                setFreeText("");
                submitDiagnosis();
              }}
              className="w-full px-6 py-3 border border-border text-foreground-muted font-medium rounded hover:border-foreground hover:text-foreground transition-colors text-sm"
            >
              スキップして診断する
            </button>
          </div>
        </div>
      )}

      {/* Back button */}
      {step > 1 && (
        <button
          onClick={() => setStep((s) => (s - 1) as Step)}
          className="mt-6 text-sm text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          前の質問に戻る
        </button>
      )}
    </div>
  );
}
