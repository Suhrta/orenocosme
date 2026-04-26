"use client";

import { RadarScoreChart } from "@/components/RadarScoreChart";

export function PhoneMockup() {
  return (
    <div aria-hidden="true" className="max-h-[392px] overflow-hidden">
      <div
        className="relative mx-auto w-[272px] h-[560px] rounded-[52px] p-[3px]"
        style={{
          background:
            "linear-gradient(145deg, #2A2A2E 0%, #1A1A1E 40%, #0D0D0F 60%, #1A1A1E 100%)",
        }}
      >
        {/* Inner bezel */}
        <div
          className="relative h-full w-full rounded-[50px] p-[2px]"
          style={{
            background:
              "linear-gradient(180deg, #1A1A1E 0%, #0D0D0F 100%)",
          }}
        >
          {/* Side buttons */}
          <div
            className="absolute -left-[4px] top-[100px] h-7 w-[3px] rounded-l"
            style={{
              background:
                "linear-gradient(90deg, #6B7280, #9CA3AF, #6B7280)",
              boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute -left-[4px] top-[142px] h-[52px] w-[3px] rounded-l"
            style={{
              background:
                "linear-gradient(90deg, #6B7280, #9CA3AF, #6B7280)",
              boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute -left-[4px] top-[204px] h-[52px] w-[3px] rounded-l"
            style={{
              background:
                "linear-gradient(90deg, #6B7280, #9CA3AF, #6B7280)",
              boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute -right-[4px] top-[166px] h-[72px] w-[3px] rounded-r"
            style={{
              background:
                "linear-gradient(90deg, #6B7280, #9CA3AF, #6B7280)",
              boxShadow: "1px 0 2px rgba(0,0,0,0.3)",
            }}
          />

          {/* Screen */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[48px] bg-white px-3 pt-7 pb-2">
            {/* Dynamic Island */}
            <div
              className="absolute top-0 left-1/2 z-[3] h-[28px] w-[90px] -translate-x-1/2 rounded-b-[16px] bg-[#0B0F19]"
            />

            {/* Glass reflection */}
            <div
              className="pointer-events-none absolute inset-0 z-[2] rounded-[48px]"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 30%, transparent 55%, rgba(255,255,255,0.06) 90%)",
              }}
            />

            {/* Skin Type */}
            <div className="text-center mb-2 mt-3">
              <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 bg-[#111] text-white rounded-full mb-0.5">
                あなたの肌タイプ
              </span>
              <p className="text-[24px] font-bold leading-tight text-[#111] mb-0.5">
                混合肌
              </p>
              <p className="text-[10px] text-[#888]">
                Tゾーンはテカり、頬は乾きやすい肌質
              </p>
            </div>

            {/* Overall Score */}
            <div className="flex items-baseline justify-center gap-0.5 mb-2">
              <span className="text-[11px] text-[#999] mr-1">総合スコア</span>
              <span className="text-[44px] font-bold leading-none text-[#111]">
                82
              </span>
              <span className="text-[11px] text-[#999]">/100</span>
            </div>

            {/* Radar Chart */}
            <RadarScoreChart
              scores={{ moisture: 85, oil_balance: 78, texture: 80, firmness: 75 }}
              size={200}
              fontSize={11}
            />

            {/* AI Advice */}
            <div className="mt-2 border border-[#eee] rounded-lg px-3 py-2.5">
              <p className="text-[9px] font-bold text-[#111] mb-1.5">AIアドバイス</p>
              <p className="text-[8px] text-[#888] leading-relaxed">
                Tゾーンのテカリと頬の乾燥には、部位ごとのケアが効果的。さっぱり系の化粧水と保湿乳液の組み合わせがおすすめです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
