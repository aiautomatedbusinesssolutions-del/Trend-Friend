import { CandleData } from "@/types/stock";

/**
 * Hardcoded AAPL demo data (~30 days).
 * Used as a last resort when all APIs are unavailable.
 */
export const MOCK_CANDLES: CandleData[] = [
  { time: "2025-12-02", open: 237.45, high: 239.80, low: 236.50, close: 239.10 },
  { time: "2025-12-03", open: 239.20, high: 241.25, low: 238.00, close: 240.75 },
  { time: "2025-12-04", open: 240.80, high: 243.10, low: 240.00, close: 242.60 },
  { time: "2025-12-05", open: 242.70, high: 244.50, low: 241.30, close: 243.80 },
  { time: "2025-12-08", open: 243.90, high: 245.00, low: 242.10, close: 244.20 },
  { time: "2025-12-09", open: 244.30, high: 246.75, low: 243.80, close: 246.10 },
  { time: "2025-12-10", open: 246.20, high: 248.00, low: 245.00, close: 247.30 },
  { time: "2025-12-11", open: 247.40, high: 249.50, low: 246.80, close: 248.90 },
  { time: "2025-12-12", open: 249.00, high: 250.20, low: 247.50, close: 249.60 },
  { time: "2025-12-15", open: 249.70, high: 251.80, low: 248.90, close: 251.10 },
  { time: "2025-12-16", open: 251.20, high: 252.40, low: 249.50, close: 250.30 },
  { time: "2025-12-17", open: 250.40, high: 253.00, low: 250.00, close: 252.70 },
  { time: "2025-12-18", open: 252.80, high: 254.10, low: 251.30, close: 253.40 },
  { time: "2025-12-19", open: 253.50, high: 255.20, low: 252.80, close: 254.80 },
  { time: "2025-12-22", open: 254.90, high: 256.00, low: 253.40, close: 255.30 },
  { time: "2025-12-23", open: 255.40, high: 257.10, low: 254.60, close: 256.50 },
  { time: "2025-12-24", open: 256.60, high: 257.80, low: 255.10, close: 256.90 },
  { time: "2025-12-26", open: 257.00, high: 258.50, low: 255.80, close: 257.80 },
  { time: "2025-12-29", open: 257.90, high: 259.20, low: 256.40, close: 258.50 },
  { time: "2025-12-30", open: 258.60, high: 260.00, low: 257.30, close: 259.10 },
  { time: "2025-12-31", open: 259.20, high: 260.80, low: 258.00, close: 260.20 },
  { time: "2026-01-02", open: 260.30, high: 262.10, low: 259.50, close: 261.40 },
  { time: "2026-01-05", open: 261.50, high: 263.00, low: 260.20, close: 262.30 },
  { time: "2026-01-06", open: 262.40, high: 264.10, low: 261.00, close: 263.50 },
  { time: "2026-01-07", open: 263.60, high: 265.20, low: 262.80, close: 264.70 },
  { time: "2026-01-08", open: 264.80, high: 266.00, low: 263.50, close: 265.20 },
  { time: "2026-01-09", open: 265.30, high: 266.80, low: 264.00, close: 266.10 },
  { time: "2026-01-12", open: 266.20, high: 267.50, low: 264.80, close: 265.40 },
  { time: "2026-01-13", open: 265.50, high: 267.00, low: 264.20, close: 266.80 },
  { time: "2026-01-14", open: 266.90, high: 268.30, low: 265.50, close: 267.50 },
];
