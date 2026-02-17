import {
  StockData,
  PriceState,
  BacktestMatch,
  BacktestResult,
} from "@/types/stock";

export function classifyState(
  price: number,
  sma50: number,
  sma200: number
): PriceState {
  if (price > sma50 && price > sma200) return "above_both";
  if (price < sma50 && price < sma200) return "below_both";
  if (price > sma50 && price < sma200) return "above_50_below_200";
  return "below_50_above_200";
}

const stateLabels: Record<PriceState, string> = {
  above_both: "above both averages",
  below_both: "below both averages",
  above_50_below_200: "above the 50-day but below the 200-day average",
  below_50_above_200: "below the 50-day but above the 200-day average",
};

export function getStateLabel(state: PriceState): string {
  return stateLabels[state];
}

export function runBacktest(
  data: StockData,
  forwardDays = 60
): BacktestResult | null {
  const { candles, sma50, sma200 } = data;

  if (sma50.length === 0 || sma200.length === 0) return null;

  // Build lookup maps
  const dateToCandle = new Map<string, number>();
  for (let i = 0; i < candles.length; i++) {
    dateToCandle.set(candles[i].time, i);
  }

  const sma50Map = new Map<string, number>();
  for (const pt of sma50) {
    sma50Map.set(pt.time, pt.value);
  }

  const sma200Map = new Map<string, number>();
  for (const pt of sma200) {
    sma200Map.set(pt.time, pt.value);
  }

  // Classify today's state
  const lastCandle = candles[candles.length - 1];
  const lastSma50 = sma50[sma50.length - 1].value;
  const lastSma200 = sma200[sma200.length - 1].value;
  const currentState = classifyState(lastCandle.close, lastSma50, lastSma200);

  // Scan history for matching states
  const matches: BacktestMatch[] = [];
  let totalMatches = 0;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const s50 = sma50Map.get(candle.time);
    const s200 = sma200Map.get(candle.time);

    if (s50 === undefined || s200 === undefined) continue;

    const state = classifyState(candle.close, s50, s200);
    if (state !== currentState) continue;

    totalMatches++;

    const exitIndex = i + forwardDays;
    if (exitIndex >= candles.length) continue;

    const exitCandle = candles[exitIndex];
    const returnPct =
      ((exitCandle.close - candle.close) / candle.close) * 100;

    matches.push({
      date: candle.time,
      entryPrice: candle.close,
      exitPrice: exitCandle.close,
      returnPct,
    });
  }

  if (matches.length === 0) return null;

  const returns = matches.map((m) => m.returnPct);
  const wins = returns.filter((r) => r > 0).length;

  return {
    currentState,
    stateLabel: getStateLabel(currentState),
    totalMatches,
    usableMatches: matches.length,
    winRate: (wins / matches.length) * 100,
    avgReturn: returns.reduce((a, b) => a + b, 0) / returns.length,
    bestReturn: Math.max(...returns),
    worstReturn: Math.min(...returns),
    matches,
  };
}
