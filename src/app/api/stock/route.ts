import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// ─── Tiingo (Primary) ───────────────────────────────────────────────────

interface TiingoEOD {
  date: string;
  close: number;
  high: number;
  low: number;
  open: number;
  adjClose: number;
  adjHigh: number;
  adjLow: number;
  adjOpen: number;
}

async function fetchFromTiingo(symbol: string) {
  const token = process.env.TIINGO_API_TOKEN;
  if (!token) throw new Error("TIINGO_API_TOKEN not set");

  const url = `https://api.tiingo.com/tiingo/daily/${encodeURIComponent(symbol)}/prices?token=${token}&startDate=1990-01-01`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tiingo ${res.status}: ${text}`);
  }

  const data: TiingoEOD[] = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data from Tiingo");
  }

  // Use adjusted prices to account for splits/dividends
  return data.map((d) => ({
    time: d.date.split("T")[0],
    open: d.adjOpen,
    high: d.adjHigh,
    low: d.adjLow,
    close: d.adjClose,
  }));
}

// ─── Yahoo Finance (Fallback) ───────────────────────────────────────────

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

// ─── Alpha Vantage (Reserved for future production use) ─────────────────
// To switch: uncomment fetchFromAlphaVantage, add as a priority in GET.
//
// async function fetchFromAlphaVantage(symbol: string) {
//   const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
//   if (!apiKey) throw new Error("ALPHA_VANTAGE_API_KEY not set");
//   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=full&apikey=${apiKey}`;
//   const res = await fetch(url);
//   const json = await res.json();
//   if (json["Error Message"]) throw new Error("Invalid symbol");
//   if (json.Note || json.Information) throw new Error("Rate limited");
//   const ts = json["Time Series (Daily)"];
//   if (!ts) throw new Error("No data");
//   return Object.entries(ts)
//     .map(([date, v]: [string, any]) => ({
//       time: date,
//       open: parseFloat(v["1. open"]),
//       high: parseFloat(v["2. high"]),
//       low: parseFloat(v["3. low"]),
//       close: parseFloat(v["4. close"]),
//     }))
//     .sort((a, b) => a.time.localeCompare(b.time));
// }
// ─────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  const ticker = symbol.toUpperCase();

  // Priority 1: Tiingo (30+ years of adjusted EOD data)
  try {
    const candles = await fetchFromTiingo(ticker);
    console.log(`[API] Tiingo returned ${candles.length} candles for ${ticker}`);

    return NextResponse.json({
      symbol: ticker,
      candles,
      source: "tiingo",
    });
  } catch (err) {
    console.error("Tiingo error:", err);
  }

  // Priority 2: Yahoo Finance fallback
  try {
    const candles = await fetchFromYahoo(ticker);

    if (candles.length === 0) {
      throw new Error("No candle data returned");
    }

    console.log(`[API] Yahoo returned ${candles.length} candles for ${ticker}`);

    return NextResponse.json({
      symbol: ticker,
      candles,
      source: "yahoo",
    });
  } catch (err) {
    console.error("Yahoo Finance error:", err);
  }

  // Priority 3: Signal client to use mock data
  return NextResponse.json({
    symbol: ticker,
    candles: null,
    source: "mock",
  });
}
