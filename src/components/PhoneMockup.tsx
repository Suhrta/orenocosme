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
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[48px] bg-white px-5 pt-8 pb-3">
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

            {/* Title */}
            <h2 className="text-[13px] font-bold text-[#111] text-center mt-2 mb-4">
              AI肌診断結果
            </h2>

            {/* Skin Type */}
            <div className="text-center mb-3">
              <span className="inline-block text-[8px] font-medium px-2 py-0.5 bg-[#111] text-white rounded-full mb-1.5">
                あなたの肌タイプ
              </span>
              <p className="text-[18px] font-bold leading-tight text-[#111] mb-0.5">
                混合肌
              </p>
              <p className="text-[9px] text-[#888]">
                Tゾーンはテカり、頬は乾きやすい肌質
              </p>
            </div>

            {/* Overall Score */}
            <div className="flex items-baseline justify-center gap-0.5 mb-3">
              <span className="text-[9px] text-[#999] mr-1">総合スコア</span>
              <span className="text-[32px] font-bold leading-none text-[#111]">
                82
              </span>
              <span className="text-[9px] text-[#999]">/100</span>
            </div>

            {/* Score bars */}
            <div className="w-full space-y-2">
              {[
                { label: "水分量", score: 85 },
                { label: "皮脂バランス", score: 78 },
                { label: "キメ", score: 80 },
                { label: "ハリ・弾力", score: 75 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#888] w-14 shrink-0 text-right">
                    {item.label}
                  </span>
                  <div className="flex-1 h-[5px] bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#111] rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[#111] w-5 text-right">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
