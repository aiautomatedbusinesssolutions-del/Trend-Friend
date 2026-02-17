"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";
import { StockData } from "@/types/stock";

interface TrendChartProps {
  data: StockData;
}

export function TrendChart({ data }: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8", // slate-400
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "#1e293b" }, // slate-800
        horzLines: { color: "#1e293b" },
      },
      width: containerRef.current.clientWidth,
      height: 450,
      crosshair: {
        vertLine: { color: "#475569", labelBackgroundColor: "#334155" },
        horzLine: { color: "#475569", labelBackgroundColor: "#334155" },
      },
      rightPriceScale: {
        borderColor: "#334155",
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: false,
      },
    });

    chartRef.current = chart;

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    });
    candleSeries.setData(data.candles);

    // 50-day SMA (Blue)
    if (data.sma50.length > 0) {
      const sma50Series = chart.addSeries(LineSeries, {
        color: "#3b82f6",
        lineWidth: 2,
        title: "50-day Avg",
        priceLineVisible: false,
      });
      sma50Series.setData(data.sma50);
    }

    // 200-day SMA (Orange)
    if (data.sma200.length > 0) {
      const sma200Series = chart.addSeries(LineSeries, {
        color: "#f97316",
        lineWidth: 2,
        title: "200-day Avg",
        priceLineVisible: false,
      });
      sma200Series.setData(data.sma200);
    }

    chart.timeScale().fitContent();

    // Responsive resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {data.symbol}
          </h2>
          <p className="text-xs text-slate-400">
            Daily candlestick chart with moving averages
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded bg-blue-500" />
            50-day Avg
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded bg-orange-500" />
            200-day Avg
          </span>
        </div>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
