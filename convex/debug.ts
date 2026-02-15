// convex/debug.ts
import { query } from "./_generated/server";

export const testAuth = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    return {
      hasIdentity: !!identity,
      identity: identity,
      tokenIdentifier: identity?.tokenIdentifier,
      subject: identity?.subject,
      issuer: identity?.issuer,
    };
  },
});