import { Doc, Id } from "../convex/_generated/dataModel";

export type Trade = Doc<"trades">;
export type TradeId = Id<"trades">;

export type TradeType = "usual" | "investment";
export type TradeStatus = "open" | "closed";

export interface FibonacciLevel {
  name: string;
  percentage: number;
  price: number;
  profit: number;
}

export interface TradeCalculations {
  positionValue: number;
  fibLevels: FibonacciLevel[];
  stopLoss: number;
  potentialLoss: number;
  riskRewardRatio: number;
}

export interface TradeStats {
  totalTrades: number;
  openPositions: number;
  closedTrades: number;
  winRate: number;
  totalPnL: number;
  totalValue: number;
}

export interface TradeFormData {
  asset: string;
  entryPrice: number;
  quantity: number;
  tradeType: TradeType;
  targetPrice?: number;
  notes?: string;
}