import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// ─── Alpha Vantage (Production) ─────────────────────────────────────────
// Uncomment this block and comment out Yahoo below to switch to Alpha Vantage.
//
// const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";
//
// interface AlphaVantageDaily {
//   "1. open": string;
//   "2. high": string;
//   "3. low": string;
//   "4. close": string;
//   "5. volume": string;
// }
//
// interface AlphaVantageResponse {
//   "Meta Data"?: { "2. Symbol": string };
//   "Time Series (Daily)"?: Record<string, AlphaVantageDaily>;
//   Note?: string;
//   Information?: string;
//   "Error Message"?: string;
// }
//
// async function fetchFromAlphaVantage(symbol: string) {
//   const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
//   if (!apiKey) throw new Error("ALPHA_VANTAGE_API_KEY not set");
//
//   const url = `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=full&apikey=${apiKey}`;
//   const res = await fetch(url);
//   const json: AlphaVantageResponse = await res.json();
//
//   if (json["Error Message"]) throw new Error("Invalid symbol");
//   if (json.Note || json.Information) throw new Error("Rate limited");
//
//   const timeSeries = json["Time Series (Daily)"];
//   if (!timeSeries) throw new Error("No data");
//
//   return Object.entries(timeSeries)
//     .map(([date, v]) => ({
//       time: date,
//       open: parseFloat(v["1. open"]),
//       high: parseFloat(v["2. high"]),
//       low: parseFloat(v["3. low"]),
//       close: parseFloat(v["4. close"]),
//     }))
//     .sort((a, b) => a.time.localeCompare(b.time));
// }
// ─────────────────────────────────────────────────────────────────────────

async function fetchFromYahoo(symbol: string) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);

  const result = await yahooFinance.chart(symbol, {
    period1: startDate.toISOString().split("T")[0],
    period2: endDate.toISOString().split("T")[0],
    interval: "1d",
  });

  return result.quotes
    .filter(
      (q) =>
        q.open !== null &&
        q.high !== null &&
        q.low !== null &&
        q.close !== null
    )
    .map((q) => ({
      time: q.date.toISOString().split("T")[0],
      open: q.open!,
      high: q.high!,
      low: q.low!,
      close: q.close!,
    }));
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  const ticker = symbol.toUpperCase();

  // Priority 2: Yahoo Finance (development/streaming mode)
  try {
    const candles = await fetchFromYahoo(ticker);

    if (candles.length === 0) {
      throw new Error("No candle data returned");
    }

    return NextResponse.json({
      symbol: ticker,
      candles,
      source: "yahoo",
    });
  } catch (err) {
    console.error("Yahoo Finance error:", err);
  }

  // Priority 3: Mock data fallback
  return NextResponse.json({
    symbol: ticker,
    candles: null,
    source: "mock",
  });
}
