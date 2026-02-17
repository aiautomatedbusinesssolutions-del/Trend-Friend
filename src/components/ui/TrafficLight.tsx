"use client";

import { TrafficLightState } from "@/types/stock";

interface TrafficLightProps {
  state: TrafficLightState;
}

const signalStyles = {
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  yellow: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  red: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
    text: "text-rose-400",
  },
};

export function TrafficLight({ state }: TrafficLightProps) {
  const styles = signalStyles[state.signal];

  return (
    <div
      className={`rounded-xl border ${styles.border} ${styles.bg} p-5`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`inline-block h-3 w-3 rounded-full ${styles.dot}`} />
        <span className={`text-base font-semibold ${styles.text}`}>
          {state.label}
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">
        {state.description}
      </p>
    </div>
  );
}
