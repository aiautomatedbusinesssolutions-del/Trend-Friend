"use client";

import { useEffect, useState } from "react";

interface SentimentGaugeProps {
  winRate: number;
  disabled?: boolean;
}

const CX = 100;
const CY = 108;
const R = 80;
const SW = 14;
const ARC_LEN = Math.PI * R;

const ARC_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#10b981", // emerald-500
];
const SEG_LEN = ARC_LEN / ARC_COLORS.length;
const ARC_D = `M ${CX - R},${CY} A ${R},${R} 0 0,1 ${CX + R},${CY}`;

function getLabel(wr: number): string {
  if (wr <= 25) return "Extreme Bearish";
  if (wr <= 40) return "Bearish";
  if (wr <= 60) return "Neutral";
  if (wr <= 75) return "Bullish";
  return "Strong Bullish Edge";
}

function getLabelColor(wr: number): string {
  if (wr <= 30) return "#ef4444";
  if (wr <= 40) return "#f97316";
  if (wr <= 60) return "#eab308";
  if (wr <= 70) return "#84cc16";
  return "#10b981";
}

export function SentimentGauge({ winRate, disabled = false }: SentimentGaugeProps) {
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnim(disabled ? 50 : winRate), 100);
    return () => clearTimeout(t);
  }, [winRate, disabled]);

  // 0% → -90° (left), 50% → 0° (up), 100% → +90° (right)
  const rot = (anim - 50) * 1.8;
  const needleTip = CY - R + SW / 2 + 6;
  const label = disabled ? "No Data" : getLabel(winRate);
  const labelClr = disabled ? "#475569" : getLabelColor(winRate);

  return (
    <div className="flex flex-col items-center mb-1">
      <svg viewBox="0 0 200 128" className="w-full max-w-[280px]">
        {/* Background track */}
        <path d={ARC_D} fill="none" stroke="#1e293b" strokeWidth={SW + 2} />

        {/* Colored arc segments */}
        {ARC_COLORS.map((c, i) => (
          <path
            key={i}
            d={ARC_D}
            fill="none"
            stroke={disabled ? "#334155" : c}
            strokeWidth={SW}
            strokeDasharray={`${SEG_LEN} ${ARC_LEN}`}
            strokeDashoffset={-i * SEG_LEN}
            opacity={disabled ? 0.4 : 0.85}
          />
        ))}

        {/* Needle */}
        <g
          style={{
            transform: `rotate(${rot}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <line
            x1={CX}
            y1={CY - 6}
            x2={CX}
            y2={needleTip}
            stroke={disabled ? "#64748b" : "#f8fafc"}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>

        {/* Pivot dot */}
        <circle cx={CX} cy={CY} r={5} fill={disabled ? "#475569" : "#f8fafc"} />

        {/* Digital readout (on top of needle) */}
        <text
          x={CX}
          y={CY - 22}
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill={disabled ? "#475569" : "#f8fafc"}
          paintOrder="stroke"
          stroke="#0f172a"
          strokeWidth={5}
          strokeLinejoin="round"
        >
          {disabled ? "\u2014" : `${winRate.toFixed(0)}%`}
        </text>

        {/* Endpoint labels */}
        <text
          x={CX - R}
          y={CY + 16}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          Bear
        </text>
        <text
          x={CX + R}
          y={CY + 16}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          Bull
        </text>
      </svg>

      {/* Sentiment label */}
      <p className="text-sm font-semibold -mt-1" style={{ color: labelClr }}>
        {label}
      </p>
    </div>
  );
}
