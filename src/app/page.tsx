"use client";

import { SearchBar } from "@/components/ui/SearchBar";
import { TrendChart } from "@/components/charts/TrendChart";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { useStockData } from "@/hooks/useStockData";
import { getTrafficLight } from "@/lib/utils/traffic-light";

export default function Home() {
  const { data, loading, error, fetchStock } = useStockData();

  const trafficLight = data
    ? getTrafficLight(
        data.candles[data.candles.length - 1].close,
        data.sma50,
        data.sma200
      )
    : null;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Trend Friend
          </h1>
          <p className="text-sm text-slate-400">
            Moving Average Trend Indicator
          </p>
        </header>

        {/* Search */}
        <SearchBar onSearch={fetchStock} loading={loading} />

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <p className="text-sm text-slate-400 animate-pulse">
              Fetching data...
            </p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-6">
            {/* Traffic Light */}
            {trafficLight && <TrafficLight state={trafficLight} />}

            {/* Chart */}
            <TrendChart data={data} />

            {/* Explainer card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-100 mb-2">
                What am I looking at?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The colored bars show each day&apos;s price range. The{" "}
                <span className="text-blue-400 font-medium">blue line</span> is
                the average price people paid over the last 50 days, and the{" "}
                <span className="text-orange-400 font-medium">
                  orange line
                </span>{" "}
                is the average over the last 200 days. When the price is above
                both lines, the trend has historically been positive. When
                it&apos;s below both, it likely signals weakness.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && !error && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <p className="text-slate-400 text-sm">
              Search for a stock ticker above to see its trend.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
