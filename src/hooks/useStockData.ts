"use client";

import { useState, useCallback, useRef } from "react";
import { StockData, CandleData, DataSource } from "@/types/stock";
import { calculateSMA } from "@/lib/utils/sma";
import { MOCK_CANDLES } from "@/lib/utils/mock-data";

const CACHE_PREFIX = "tf_stock_";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 5000; // 5 second timeout → auto-fallback to mock

interface CachedPayload {
  symbol: string;
  candles: CandleData[];
  timestamp: number;
}

function getCached(symbol: string): CachedPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + symbol.toUpperCase());
    if (!raw) return null;
    const parsed: CachedPayload = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + symbol.toUpperCase());
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setCache(symbol: string, candles: CandleData[]) {
  try {
    const payload: CachedPayload = {
      symbol: symbol.toUpperCase(),
      candles,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + symbol.toUpperCase(), JSON.stringify(payload));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

function buildStockData(
  symbol: string,
  candles: CandleData[],
  source: DataSource
): StockData {
  return {
    symbol,
    candles,
    sma50: calculateSMA(candles, 50),
    sma200: calculateSMA(candles, 200),
    source,
  };
}

function loadMock(): StockData {
  return buildStockData("AAPL", MOCK_CANDLES, "mock");
}

interface UseStockDataReturn {
  data: StockData | null;
  loading: boolean;
  error: string | null;
  fetchStock: (symbol: string) => Promise<void>;
  reset: () => void;
}

export function useStockData(): UseStockDataReturn {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  const fetchStock = useCallback(async (symbol: string) => {
    // Abort any previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Priority 1: localStorage cache
      const cached = getCached(symbol);
      if (cached) {
        console.log(`[Trend Friend] Cache hit for ${symbol.toUpperCase()} (${cached.candles.length} candles)`);
        setData(buildStockData(symbol.toUpperCase(), cached.candles, "cache"));
        setLoading(false);
        return;
      }

      // Priority 2: API with 5-second timeout
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await fetch(
        `/api/stock?symbol=${encodeURIComponent(symbol)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong.");
      }

      if (json.source === "mock" || !json.candles) {
        console.log(`[Trend Friend] API unavailable — loading demo data`);
        setData(loadMock());
      } else {
        setCache(symbol, json.candles);
        console.log(`[Trend Friend] Fetched & cached ${symbol.toUpperCase()} via Yahoo (${json.candles.length} candles)`);
        setData(buildStockData(symbol.toUpperCase(), json.candles, "yahoo"));
      }
    } catch (err) {
      // Timeout or network failure → fall back to mock data instead of showing error
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log(`[Trend Friend] Request timed out after ${FETCH_TIMEOUT_MS / 1000}s — loading demo data`);
        setData(loadMock());
      } else {
        console.log(`[Trend Friend] Fetch failed — loading demo data`);
        setData(loadMock());
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, []);

  return { data, loading, error, fetchStock, reset };
}
