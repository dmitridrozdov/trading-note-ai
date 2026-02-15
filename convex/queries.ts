import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTrades = query({
  args: {
    filter: v.optional(v.union(v.literal("all"), v.literal("usual"), v.literal("investment"), v.literal("open"), v.literal("closed"))),
    sortBy: v.optional(v.union(v.literal("date"), v.literal("asset"), v.literal("pnl"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier || identity.subject;

    let trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Apply filters
    if (args.filter && args.filter !== "all") {
      if (args.filter === "open" || args.filter === "closed") {
        trades = trades.filter((t) => t.status === args.filter);
      } else {
        trades = trades.filter((t) => t.tradeType === args.filter);
      }
    }

    // Apply sorting
    if (args.sortBy === "date") {
      trades.sort((a, b) => b.createdAt - a.createdAt);
    } else if (args.sortBy === "asset") {
      trades.sort((a, b) => a.asset.localeCompare(b.asset));
    } else if (args.sortBy === "pnl") {
      trades.sort((a, b) => {
        const pnlA = a.exitPrice ? (a.exitPrice - a.entryPrice) * a.quantity : 0;
        const pnlB = b.exitPrice ? (b.exitPrice - b.entryPrice) * b.quantity : 0;
        return pnlB - pnlA;
      });
    } else {
      // Default: sort by date descending
      trades.sort((a, b) => b.createdAt - a.createdAt);
    }

    return trades;
  },
});

export const getTradeById = query({
  args: {
    id: v.id("trades"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.tokenIdentifier || identity.subject;
    const trade = await ctx.db.get(args.id);
    if (!trade || trade.userId !== userId) {
      return null;
    }

    return trade;
  },
});

export const getTradeStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        totalTrades: 0,
        openPositions: 0,
        closedTrades: 0,
        winRate: 0,
        totalPnL: 0,
        totalValue: 0,
      };
    }

    const userId = identity.tokenIdentifier || identity.subject;

    const trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const openPositions = trades.filter((t) => t.status === "open").length;
    const closedTrades = trades.filter((t) => t.status === "closed");
    
    const winningTrades = closedTrades.filter((t) => 
      t.exitPrice && t.exitPrice > t.entryPrice
    ).length;
    
    const winRate = closedTrades.length > 0 
      ? (winningTrades / closedTrades.length) * 100 
      : 0;

    const totalPnL = closedTrades.reduce((sum, trade) => {
      if (trade.exitPrice) {
        return sum + (trade.exitPrice - trade.entryPrice) * trade.quantity;
      }
      return sum;
    }, 0);

    const totalValue = trades
      .filter((t) => t.status === "open")
      .reduce((sum, trade) => sum + trade.entryPrice * trade.quantity, 0);

    return {
      totalTrades: trades.length,
      openPositions,
      closedTrades: closedTrades.length,
      winRate: Math.round(winRate * 10) / 10,
      totalPnL: Math.round(totalPnL * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
    };
  },
});