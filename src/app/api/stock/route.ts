import { NextRequest, NextResponse } from "next/server";

const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";

interface AlphaVantageDaily {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

interface AlphaVantageResponse {
  "Meta Data"?: {
    "2. Symbol": string;
  };
  "Time Series (Daily)"?: Record<string, AlphaVantageDaily>;
  Note?: string;
  Information?: string;
  "Error Message"?: string;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured. Add ALPHA_VANTAGE_API_KEY to .env.local." },
      { status: 500 }
    );
  }

  try {
    // Free tier only supports outputsize=compact (~100 trading days).
    // Upgrade to a premium plan to use outputsize=full for the 200-day SMA.
    const url = `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol.toUpperCase())}&outputsize=compact&apikey=${apiKey}`;

    const res = await fetch(url);
    const json: AlphaVantageResponse = await res.json();

    // Alpha Vantage returns rate-limit or error messages in these fields
    if (json["Error Message"]) {
      return NextResponse.json(
        { error: `Could not fetch data for "${symbol}". Check the ticker and try again.` },
        { status: 404 }
      );
    }

    if (json.Note || json.Information) {
      return NextResponse.json(
        { error: "API rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const timeSeries = json["Time Series (Daily)"];
    if (!timeSeries) {
      return NextResponse.json(
        { error: `No data returned for "${symbol}".` },
        { status: 404 }
      );
    }

    // Convert to our candle format, sorted oldest-first for charting
    const candles = Object.entries(timeSeries)
      .map(([date, values]) => ({
        time: date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
      }))
      .sort((a, b) => a.time.localeCompare(b.time));

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      candles,
    });
  } catch (err) {
    console.error("Alpha Vantage error:", err);
    return NextResponse.json(
      { error: `Could not fetch data for "${symbol}". Check the ticker and try again.` },
      { status: 500 }
    );
  }
}
