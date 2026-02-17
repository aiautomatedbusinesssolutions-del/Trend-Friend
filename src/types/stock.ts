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

export type TrendSignal = "green" | "yellow" | "red";

export interface TrafficLightState {
  signal: TrendSignal;
  label: string;
  description: string;
}
