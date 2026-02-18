# Trend Friend: Historical Alpha

A dynamic stock analysis tool that uses 35 years of market data to find historical probabilities for current market setups. Search any ticker, see where the price sits relative to key moving averages, and let the data tell you what happened next.

Built live on stream. Powered by data, not opinions.

---

## Key Features

- **50/200 Day SMA Traffic Light** — Instantly see if the price is above, below, or between the 50-day and 200-day simple moving averages. Green means go, red means caution, yellow means the market is deciding.

- **Dynamic Historical Matcher** — Scans up to 9,000+ trading days from the Tiingo API to find every day that matched the same price state as today. Then it looks 60 trading days forward on each match to calculate win rate, average return, best case, and worst case.

- **Bull/Bear Sentiment Meter** — A visual speedometer-style gauge that sweeps from Extreme Bearish to Strong Bullish Edge based on the 60-day win rate. Animated needle, color-coded arc, and a plain-English verdict.

- **Beginner-Friendly Explanations** — Every stat box includes a short description of what the number means. A "What this means for you" summary translates the data into actionable insight without jargon.

- **Graceful Fallbacks** — If the Tiingo API is unavailable, the app falls back to Yahoo Finance data. If both fail, demo data loads so the UI never breaks.

---

## How It Works

Trend Friend finds **Historical Twins** — past trading days where the stock was in the same position relative to its moving averages as it is today.

Here's the idea in plain English:

1. You search for a stock (e.g. `AAPL`).
2. The app calculates the 50-day and 200-day moving averages and determines the current **price state** (above both, below both, or in between).
3. It scans the full history — up to 35 years of daily data — for every day that had the **same state**.
4. For each historical match, it checks what the price did **60 trading days later** (~3 months).
5. It aggregates the results: how often the price went up (win rate), the average gain or loss, and the best/worst outcomes.

The result is an evidence-backed signal, not a guess. The traffic light tells you *where* the price is. The backtester tells you *what happened next* when it was here before.

---

## Tech Stack

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router and API routes |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) | TradingView's candlestick chart library |
| [Tiingo API](https://www.tiingo.com/) | Primary data source (35+ years of daily OHLC) |
| [Yahoo Finance](https://www.npmjs.com/package/yahoo-finance2) | Fallback data source |
| TypeScript | End-to-end type safety |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Tiingo API key](https://www.tiingo.com/account/api/token) (optional — the app falls back to Yahoo Finance without one)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/Trend-Friend.git
cd Trend-Friend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
TIINGO_API_TOKEN=your_tiingo_api_key_here
```

### Run It

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search for a ticker.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
  app/
    page.tsx              # Main dashboard
    api/stock/route.ts    # API route (Tiingo → Yahoo → mock fallback)
  components/
    charts/
      TrendChart.tsx      # Candlestick chart with SMA overlays
    ui/
      TrafficLight.tsx     # Green/Yellow/Red signal card
      BacktestCard.tsx     # Historical analysis card
      SentimentGauge.tsx   # Animated bull/bear SVG gauge
      SearchBar.tsx        # Ticker search input
  lib/utils/
    backtester.ts         # Core backtest algorithm
    traffic-light.ts      # SMA-based trend classification
    sma.ts                # Moving average calculation
    mock-data.ts          # Fallback demo data
  types/
    stock.ts              # TypeScript interfaces
```

---

## Future Roadmap

- **Mobile Optimization** — Responsive layouts and touch-friendly interactions for on-the-go analysis
- **RSI Integration** — Add the Relative Strength Index as an additional signal layer alongside the SMA traffic light
- **Multi-Ticker Comparison** — Compare historical outcomes across multiple stocks side by side
- **Configurable Lookback** — Let users adjust the forward window (30, 60, 90 days) and see how outcomes change
- **Export & Share** — Save analysis snapshots as images for social sharing

---

## License

MIT

---

Built with data, caffeine, and Claude Code.
