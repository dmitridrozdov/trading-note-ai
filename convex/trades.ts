import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTrade = mutation({
  args: {
    asset: v.string(),
    entryPrice: v.number(),
    quantity: v.number(),
    tradeType: v.union(v.literal("usual"), v.literal("investment")),
    targetPrice: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Use tokenIdentifier for Clerk or subject for other providers
    const userId = identity.tokenIdentifier || identity.subject;

    const tradeId = await ctx.db.insert("trades", {
      userId,
      asset: args.asset.toUpperCase(),
      entryPrice: args.entryPrice,
      quantity: args.quantity,
      tradeType: args.tradeType,
      targetPrice: args.targetPrice,
      notes: args.notes,
      status: "open",
      createdAt: Date.now(),
    });

    return tradeId;
  },
});

export const updateTrade = mutation({
  args: {
    id: v.id("trades"),
    asset: v.optional(v.string()),
    entryPrice: v.optional(v.number()),
    quantity: v.optional(v.number()),
    tradeType: v.optional(v.union(v.literal("usual"), v.literal("investment"))),
    targetPrice: v.optional(v.number()),
    exitPrice: v.optional(v.number()),
    status: v.optional(v.union(v.literal("open"), v.literal("closed"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.tokenIdentifier || identity.subject;
    const trade = await ctx.db.get(args.id);
    if (!trade || trade.userId !== userId) {
      throw new Error("Trade not found or unauthorized");
    }

    const { id, ...updateFields } = args;
    
    // If asset is being updated, uppercase it
    if (updateFields.asset) {
      updateFields.asset = updateFields.asset.toUpperCase();
    }

    await ctx.db.patch(args.id, updateFields);
    return args.id;
  },
});

export const deleteTrade = mutation({
  args: {
    id: v.id("trades"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.tokenIdentifier || identity.subject;
    const trade = await ctx.db.get(args.id);
    if (!trade || trade.userId !== userId) {
      throw new Error("Trade not found or unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const toggleTradeType = mutation({
  args: {
    id: v.id("trades"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.tokenIdentifier || identity.subject;
    const trade = await ctx.db.get(args.id);
    if (!trade || trade.userId !== userId) {
      throw new Error("Trade not found or unauthorized");
    }

    const newType = trade.tradeType === "usual" ? "investment" : "usual";
    await ctx.db.patch(args.id, { tradeType: newType });
    
    return args.id;
  },
});

export const closeTrade = mutation({
  args: {
    id: v.id("trades"),
    exitPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.tokenIdentifier || identity.subject;
    const trade = await ctx.db.get(args.id);
    if (!trade || trade.userId !== userId) {
      throw new Error("Trade not found or unauthorized");
    }

    await ctx.db.patch(args.id, {
      exitPrice: args.exitPrice,
      status: "closed",
    });

    return args.id;
  },
});