"use client";

import { useState, useCallback } from "react";
import { StockData, CandleData } from "@/types/stock";
import { calculateSMA } from "@/lib/utils/sma";

interface UseStockDataReturn {
  data: StockData | null;
  loading: boolean;
  error: string | null;
  fetchStock: (symbol: string) => Promise<void>;
}

export function useStockData(): UseStockDataReturn {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async (symbol: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong.");
      }

      const candles: CandleData[] = json.candles;
      const sma50 = calculateSMA(candles, 50);
      const sma200 = calculateSMA(candles, 200);

      setData({
        symbol: json.symbol,
        candles,
        sma50,
        sma200,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchStock };
}
