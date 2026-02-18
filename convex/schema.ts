import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trades: defineTable({
    userId: v.string(),
    asset: v.string(),
    entryPrice: v.number(),
    usdtAmount: v.number(), // Changed from quantity to USDT amount
    tradeType: v.union(v.literal("usual"), v.literal("investment")),
    createdAt: v.number(),
    // Optional fields for usual trades
    targetPrice: v.optional(v.number()),
    exitPrice: v.optional(v.number()),
    status: v.optional(v.union(v.literal("open"), v.literal("closed"))),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "tradeType"])
    .index("by_user_and_date", ["userId", "createdAt"]),
});