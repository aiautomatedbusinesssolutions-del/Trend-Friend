import { SMAPoint, TrafficLightState } from "@/types/stock";

/**
 * Determines the "Traffic Light" signal based on where the price sits
 * relative to the 50-day and 200-day moving averages.
 *
 * Green:  Price is above both averages — trend looks healthy.
 * Yellow: Price is between the two averages — market is undecided.
 * Red:    Price is below both averages — trend is struggling.
 */
export function getTrafficLight(
  currentPrice: number,
  sma50: SMAPoint[],
  sma200: SMAPoint[]
): TrafficLightState {
  if (sma50.length === 0 || sma200.length === 0) {
    return {
      signal: "yellow",
      label: "Not enough data",
      description: "We need more historical data to read the trend.",
    };
  }

  const latestSma50 = sma50[sma50.length - 1].value;
  const latestSma200 = sma200[sma200.length - 1].value;

  const higher = Math.max(latestSma50, latestSma200);
  const lower = Math.min(latestSma50, latestSma200);

  if (currentPrice > higher) {
    return {
      signal: "green",
      label: "Trend looks healthy",
      description:
        "The current price is above both moving averages. Historically, this suggests the trend is likely moving upward.",
    };
  }

  if (currentPrice < lower) {
    return {
      signal: "red",
      label: "Trend is struggling",
      description:
        "The current price is below both moving averages. Historically, this suggests potential weakness in the trend.",
    };
  }

  return {
    signal: "yellow",
    label: "Market is undecided",
    description:
      "The current price sits between the two averages. This likely means the market is deciding its next direction.",
  };
}
