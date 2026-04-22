export function PhoneMockup() {
  return (
    <div aria-hidden="true" className="max-h-[392px] overflow-hidden">
      <div
        className="relative mx-auto w-[272px] h-[560px] rounded-[48px] p-[5px]"
        style={{
          background:
            "linear-gradient(135deg, #4A5568 0%, #1A202C 45%, #2D3748 100%)",
          boxShadow:
            "0 30px 80px rgba(15,23,42,0.35), 0 12px 28px rgba(15,23,42,0.22), 0 4px 10px rgba(15,23,42,0.12), inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 2px 3px rgba(255,255,255,0.14), inset 0 -2px 3px rgba(0,0,0,0.3)",
        }}
      >
        {/* Side buttons */}
        <div
          className="absolute -left-0.5 top-[108px] h-8 w-[3px] rounded-l-sm"
          style={{
            background: "linear-gradient(90deg, #2D3748, #4A5568)",
          }}
        />
        <div
          className="absolute -left-0.5 top-[152px] h-[54px] w-[3px] rounded-l-sm"
          style={{
            background: "linear-gradient(90deg, #2D3748, #4A5568)",
          }}
        />
        <div
          className="absolute -left-0.5 top-[216px] h-[54px] w-[3px] rounded-l-sm"
          style={{
            background: "linear-gradient(90deg, #2D3748, #4A5568)",
          }}
        />
        <div
          className="absolute -right-0.5 top-[172px] h-20 w-[3px] rounded-r-sm"
          style={{
            background: "linear-gradient(90deg, #4A5568, #2D3748)",
          }}
        />

        {/* Screen */}
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[44px] bg-white px-5 pt-12 pb-3.5">
          {/* Notch */}
          <div
            className="absolute top-[7px] left-1/2 z-[3] h-4 w-[60px] -translate-x-1/2 rounded-[10px] bg-[#0B0F19]"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          />
          {/* Glass overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-[2] rounded-[44px]"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0) 52%, rgba(255,255,255,0.08) 88%, rgba(255,255,255,0.16) 100%)",
              mixBlendMode: "overlay",
            }}
          />

          {/* App bar */}
          <div className="flex items-center gap-2 mb-4">
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

          {/* Score + Rank inline */}
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
  );
}
