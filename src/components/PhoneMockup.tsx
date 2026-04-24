export function PhoneMockup() {
  return (
    <div aria-hidden="true" className="max-h-[392px] overflow-hidden">
      <div
        className="relative mx-auto w-[272px] h-[560px] rounded-[52px] p-[3px]"
        style={{
          background:
            "linear-gradient(145deg, #8A919B 0%, #3B4049 20%, #1E2127 50%, #3B4049 80%, #8A919B 100%)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.4), 0 12px 28px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.4)",
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

            {/* App bar */}
            <div className="flex items-center gap-2 mb-4 mt-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="text-[13px] font-bold text-[#111]">
                AI肌診断結果
              </span>
            </div>

            {/* Score + Rank */}
            <div className="flex items-baseline justify-center gap-5 mb-2">
              <div className="text-center">
                <p className="text-[9px] text-[#999] mb-0.5">総合スコア</p>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-[38px] font-bold leading-none text-[#111]">
                    82
                  </span>
                  <span className="text-[11px] text-[#999]">/100</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-[#999] mb-0.5">ランク</p>
                <span className="text-[32px] font-bold leading-none text-[#111]">
                  A
                </span>
              </div>
            </div>

            <p className="text-[10px] text-[#888] text-center leading-relaxed mb-4">
              あなたは清潔感があり、
              <br />
              好印象を与えやすいタイプです。
            </p>

            {/* Score bars */}
            <div className="w-full space-y-2.5">
              {[
                { label: "水分量", score: 85 },
                { label: "皮脂バランス", score: 78 },
                { label: "キメ", score: 80 },
                { label: "ハリ・弾力", score: 75 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#888] w-16 shrink-0 text-right">
                    {item.label}
                  </span>
                  <div className="flex-1 h-[6px] bg-[#eee] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#111] rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#111] w-5 text-right">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1" />

            <div className="flex justify-center">
              <div className="w-28 h-1 bg-[#ddd] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
