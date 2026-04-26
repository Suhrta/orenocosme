"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

type Props = {
  scores: {
    moisture: number;
    oil_balance: number;
    texture: number;
    firmness: number;
  };
  size?: number;
  fontSize?: number;
};

export function RadarScoreChart({ scores, size = 240, fontSize = 13 }: Props) {
  const data = [
    { subject: "水分量", value: scores.moisture },
    { subject: "皮脂", value: scores.oil_balance },
    { subject: "キメ", value: scores.texture },
    { subject: "ハリ", value: scores.firmness },
  ];

  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="55%">
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#666", fontSize }}
          />
          <Radar
            dataKey="value"
            stroke="#111"
            fill="#111"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
