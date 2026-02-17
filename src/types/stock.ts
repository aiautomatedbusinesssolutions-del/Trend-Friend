export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SMAPoint {
  time: string;
  value: number;
}

export type DataSource = "cache" | "tiingo" | "yahoo" | "mock";

export interface StockData {
  symbol: string;
  candles: CandleData[];
  sma50: SMAPoint[];
  sma200: SMAPoint[];
  source: DataSource;
}

export type PriceState =
  | "above_both"
  | "below_both"
  | "above_50_below_200"
  | "below_50_above_200";

export interface BacktestMatch {
  date: string;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
}

export interface BacktestResult {
  currentState: PriceState;
  stateLabel: string;
  totalMatches: number;
  usableMatches: number;
  winRate: number;
  avgReturn: number;
  bestReturn: number;
  worstReturn: number;
  matches: BacktestMatch[];
}

export type TrendSignal = "green" | "yellow" | "red";

export interface TrafficLightState {
  signal: TrendSignal;
  label: string;
  description: string;
}
