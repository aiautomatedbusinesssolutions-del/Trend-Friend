import { CandleData, SMAPoint } from "@/types/stock";

/**
 * Calculates a Simple Moving Average (SMA).
 * Think of it as: "the average price people paid over the last N days."
 */
export function calculateSMA(candles: CandleData[], period: number): SMAPoint[] {
  const result: SMAPoint[] = [];

  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
    result.push({
      time: candles[i].time,
      value: parseFloat((sum / period).toFixed(2)),
    });
  }

  return result;
}
