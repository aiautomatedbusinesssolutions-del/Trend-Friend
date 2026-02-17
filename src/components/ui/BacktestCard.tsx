"use client";

import { BacktestResult } from "@/types/stock";
import { SentimentGauge } from "@/components/ui/SentimentGauge";

interface BacktestCardProps {
  result: BacktestResult;
  isDemo?: boolean;
}

function sentimentColor(winRate: number, avgReturn: number) {
  if (winRate >= 60 || avgReturn > 0)
    return { bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  if (winRate <= 40 || avgReturn < 0)
    return { bg: "bg-rose-500/10", border: "border-rose-500/20" };
  return { bg: "bg-amber-500/10", border: "border-amber-500/20" };
}

function winRateColor(value: number) {
  if (value >= 60) return "text-emerald-400";
  if (value <= 40) return "text-rose-400";
  return "text-amber-400";
}

function avgReturnColor(value: number) {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-rose-400";
  return "text-amber-400";
}

function fmt(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function buildSummary(result: BacktestResult): string {
  const { winRate, avgReturn, bestReturn, worstReturn, stateLabel } = result;

  if (winRate >= 60) {
    return (
      `When this stock was ${stateLabel} in the past, it finished higher ${winRate.toFixed(0)}% of the time over the next 60 trading days. ` +
      `The average gain was ${fmt(avgReturn)}, which suggests the odds have historically favored a recovery from this setup. ` +
      `That said, the worst-case drop of ${fmt(worstReturn)} is a reminder that past performance doesn\u2019t guarantee future results \u2014 always manage your risk.`
    );
  }

  if (winRate <= 40) {
    return (
      `When this stock was ${stateLabel} in the past, it only finished higher ${winRate.toFixed(0)}% of the time over the next 60 trading days. ` +
      `The average return was ${fmt(avgReturn)}, and the worst case reached ${fmt(worstReturn)}. ` +
      `History suggests this setup has been challenging \u2014 caution and a clear plan are especially important here.`
    );
  }

  return (
    `When this stock was ${stateLabel} in the past, the next 60 trading days were roughly a coin flip \u2014 positive ${winRate.toFixed(0)}% of the time. ` +
    `The best outcome was a ${fmt(bestReturn)} gain, but the worst was a ${fmt(worstReturn)} drop. ` +
    `The market didn\u2019t have a strong opinion from this position, so patience and a solid plan matter more than ever.`
  );
}

export function BacktestCard({ result, isDemo = false }: BacktestCardProps) {
  const sentiment = sentimentColor(result.winRate, result.avgReturn);

  return (
    <div className={`rounded-xl border ${sentiment.border} ${sentiment.bg} p-5`}>
      <h3 className="text-sm font-semibold text-slate-100 mb-1">
        History&apos;s Verdict for This Setup
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Based on {result.usableMatches.toLocaleString()} similar days in the past
        {result.totalMatches > result.usableMatches && (
          <span>
            {" "}({result.totalMatches.toLocaleString()} total matches,{" "}
            {result.totalMatches - result.usableMatches} too recent for 60-day
            follow-up)
          </span>
        )}
      </p>

      {/* Sentiment gauge */}
      <SentimentGauge winRate={result.winRate} disabled={isDemo} />

      {/* 2x2 stat grid — number left, explanation right */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Win Rate */}
        <div className="flex items-center gap-4 rounded-lg bg-slate-800/50 p-4">
          <p className={`text-2xl font-bold shrink-0 ${winRateColor(result.winRate)}`}>
            {result.winRate.toFixed(1)}%
          </p>
          <div>
            <p className="text-xs font-medium text-slate-300">Win Rate</p>
            <p className="text-xs text-slate-500">
              How often the price was higher after 60 trading days
            </p>
          </div>
        </div>

        {/* Avg Return */}
        <div className="flex items-center gap-4 rounded-lg bg-slate-800/50 p-4">
          <p className={`text-2xl font-bold shrink-0 ${avgReturnColor(result.avgReturn)}`}>
            {fmt(result.avgReturn)}
          </p>
          <div>
            <p className="text-xs font-medium text-slate-300">Avg Return</p>
            <p className="text-xs text-slate-500">
              The average gain or loss across all matched days
            </p>
          </div>
        </div>

        {/* Best Case */}
        <div className="flex items-center gap-4 rounded-lg bg-slate-800/50 p-4">
          <p className="text-2xl font-bold shrink-0 text-emerald-400">
            {fmt(result.bestReturn)}
          </p>
          <div>
            <p className="text-xs font-medium text-slate-300">Best Case</p>
            <p className="text-xs text-slate-500">
              The highest gain recorded from a similar setup
            </p>
          </div>
        </div>

        {/* Worst Case */}
        <div className="flex items-center gap-4 rounded-lg bg-slate-800/50 p-4">
          <p className="text-2xl font-bold shrink-0 text-rose-400">
            {fmt(result.worstReturn)}
          </p>
          <div>
            <p className="text-xs font-medium text-slate-300">Worst Case</p>
            <p className="text-xs text-slate-500">
              The largest drop recorded from a similar setup
            </p>
          </div>
        </div>
      </div>

      {/* Beginner's summary */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
        <h4 className="text-xs font-semibold text-slate-300 mb-2">
          What this means for you
        </h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          {buildSummary(result)}
        </p>
      </div>
    </div>
  );
}
