import { Trade } from "@/lib/types";
import { formatCurrency, formatDate, calculatePnL } from "@/lib/calculations";
import { TrendingUp, TrendingDown, CircleDot, CheckCircle2 } from "lucide-react";

interface TradeListProps {
  trades: Trade[];
  onTradeClick: (trade: Trade) => void;
}

export function TradeList({ trades, onTradeClick }: TradeListProps) {
  if (trades.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-300 mb-2">No trades yet</h3>
        <p className="text-sm text-zinc-500">
          Start your trading journal by adding your first trade
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-black/50 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <div className="col-span-2">Asset</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Entry Price</div>
        <div className="col-span-1">Quantity</div>
        <div className="col-span-2">Position Value</div>
        <div className="col-span-2">P&L</div>
        <div className="col-span-1">Date</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-zinc-800/50">
        {trades.map((trade) => {
          const pnl = calculatePnL(trade);
          const positionValue = trade.entryPrice * trade.quantity;
          const isProfit = pnl !== null && pnl > 0;
          const isLoss = pnl !== null && pnl < 0;

          return (
            <div
              key={trade._id}
              onClick={() => onTradeClick(trade)}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-800/30 transition-all cursor-pointer group"
            >
              {/* Asset */}
              <div className="col-span-2 flex items-center">
                <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {trade.asset}
                </div>
              </div>

              {/* Type */}
              <div className="col-span-1 flex items-center">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    trade.tradeType === "usual"
                      ? "bg-blue-950/50 text-blue-300 border border-blue-900/50"
                      : "bg-purple-950/50 text-purple-300 border border-purple-900/50"
                  }`}
                >
                  {trade.tradeType === "usual" ? "Usual" : "Investment"}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-1 flex items-center">
                {trade.status === "open" ? (
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <CircleDot className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Open</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Closed</span>
                  </div>
                )}
              </div>

              {/* Entry Price */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-zinc-300 font-mono">
                  {formatCurrency(trade.entryPrice)}
                </span>
              </div>

              {/* Quantity */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-zinc-400 font-mono">{trade.quantity}</span>
              </div>

              {/* Position Value */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-zinc-300 font-mono font-semibold">
                  {formatCurrency(positionValue)}
                </span>
              </div>

              {/* P&L */}
              <div className="col-span-2 flex items-center">
                {pnl !== null ? (
                  <div className="flex items-center gap-1.5">
                    {isProfit ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : isLoss ? (
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    ) : null}
                    <span
                      className={`text-sm font-semibold font-mono ${
                        isProfit
                          ? "text-emerald-400"
                          : isLoss
                          ? "text-rose-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {formatCurrency(pnl)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-600">-</span>
                )}
              </div>

              {/* Date */}
              <div className="col-span-1 flex items-center">
                <span className="text-xs text-zinc-500">{formatDate(trade.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}