import { Trade, FibonacciLevel, TradeCalculations } from "./types";

const FIBONACCI_LEVELS = [
  { name: "TP1", percentage: 0.236, label: "23.6%" },
  { name: "TP2", percentage: 0.382, label: "38.2%" },
  { name: "TP3", percentage: 0.5, label: "50%" },
  { name: "TP4", percentage: 0.618, label: "61.8%" },
  { name: "TP5", percentage: 1.0, label: "100%" },
];

export function calculateTradeMetrics(trade: Trade): TradeCalculations | null {
  if (trade.tradeType === "investment" || !trade.targetPrice) {
    return null;
  }

  const entryPrice = trade.entryPrice;
  const targetPrice = trade.targetPrice;
  const quantity = trade.quantity;
  const priceMove = targetPrice - entryPrice;

  // Calculate Fibonacci levels
  const fibLevels: FibonacciLevel[] = FIBONACCI_LEVELS.map((level) => {
    const price = entryPrice + priceMove * level.percentage;
    const profit = (price - entryPrice) * quantity;
    return {
      name: level.name,
      percentage: level.percentage * 100,
      price: Math.round(price * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    };
  });

  // Calculate stop loss (1:2 risk-reward, so risk is half the target move)
  const stopLoss = entryPrice - priceMove * 0.5;
  const potentialLoss = (entryPrice - stopLoss) * quantity;

  // Position value
  const positionValue = entryPrice * quantity;

  return {
    positionValue: Math.round(positionValue * 100) / 100,
    fibLevels,
    stopLoss: Math.round(stopLoss * 100) / 100,
    potentialLoss: Math.round(potentialLoss * 100) / 100,
    riskRewardRatio: 2, // Fixed 1:2 risk-reward
  };
}

export function calculatePnL(trade: Trade): number | null {
  if (!trade.exitPrice) {
    return null;
  }
  const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
  return Math.round(pnl * 100) / 100;
}

export function calculateUnrealizedPnL(trade: Trade, currentPrice: number): number {
  const pnl = (currentPrice - trade.entryPrice) * trade.quantity;
  return Math.round(pnl * 100) / 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}