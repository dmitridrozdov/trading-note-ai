import { Trade } from "@/lib/types";
import { formatCurrency, formatDate, calculatePnL } from "@/lib/calculations";
import { TrendingUp, TrendingDown, CircleDot, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface TradeListProps {
  trades: Trade[];
  onTradeClick: (trade: Trade) => void;
}

interface PriceData {
  [key: string]: number;
}

export function TradeList({ trades, onTradeClick }: TradeListProps) {
  const [currentPrices, setCurrentPrices] = useState<PriceData>({});

  // Fetch current prices from Binance API
  useEffect(() => {
    if (trades.length === 0) return;

    const fetchPrices = async () => {
      const uniqueAssets = [...new Set(trades.map(t => t.asset))];
      const newPrices: PriceData = {};

      for (const asset of uniqueAssets) {
        try {
          const symbol = `${asset}USDT`;
          const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          const data = await response.json();
          
          if (data.price) {
            newPrices[asset] = parseFloat(data.price);
          }
        } catch (error) {
          console.error(`Error fetching price for ${asset}:`, error);
        }
      }

      setCurrentPrices(newPrices);
    };

    // Fetch immediately
    fetchPrices();

    // Then fetch every 30 seconds
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, [trades]);

  if (trades.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No trades yet</h3>
        <p className="text-sm text-gray-500">
          Start your trading journal by adding your first trade
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden backdrop-blur-sm shadow-sm">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <div className="col-span-2">Asset</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Entry Price</div>
        <div className="col-span-2">Current Price</div>
        <div className="col-span-2">USDT Amount</div>
        <div className="col-span-2">P&L / % Change</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {trades.map((trade) => {
          const pnl = calculatePnL(trade);
          const currentPrice = currentPrices[trade.asset];
          const quantity = trade.usdtAmount / trade.entryPrice;
          
          // Calculate unrealized P&L and percentage from entry
          const unrealizedPnL = currentPrice 
            ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * trade.usdtAmount
            : null;
          
          const percentChange = currentPrice
            ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100
            : null;

          const isProfit = pnl !== null && pnl > 0;
          const isLoss = pnl !== null && pnl < 0;
          const isUnrealizedProfit = unrealizedPnL !== null && unrealizedPnL > 0;
          const isUnrealizedLoss = unrealizedPnL !== null && unrealizedPnL < 0;

          return (
            <div
              key={trade._id}
              onClick={() => onTradeClick(trade)}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              {/* Asset */}
              <div className="col-span-2 flex items-center">
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {trade.asset}
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(trade.createdAt)}</div>
                </div>
              </div>

              {/* Type */}
              <div className="col-span-1 flex items-center">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    trade.tradeType === "usual"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
                  }`}
                >
                  {trade.tradeType === "usual" ? "Usual" : "Investment"}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-1 flex items-center">
                {trade.status === "open" ? (
                  <div className="flex items-center gap-1.5 text-cyan-600">
                    <CircleDot className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Open</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Closed</span>
                  </div>
                )}
              </div>

              {/* Entry Price */}
              <div className="col-span-2 flex items-center">
                <div>
                  <span className="text-sm text-gray-900 font-mono font-semibold">
                    {formatCurrency(trade.entryPrice)}
                  </span>
                  <div className="text-xs text-gray-700 font-mono">
                    {quantity.toFixed(5)}
                  </div>
                </div>
              </div>

              {/* Current Price */}
              <div className="col-span-2 flex items-center">
                {currentPrice ? (
                  <div>
                    <span className="text-sm text-gray-900 font-mono font-semibold">
                      {formatCurrency(currentPrice)}
                    </span>
                    {percentChange !== null && (
                      <div className={`text-xs font-mono ${
                        percentChange >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Loading...</span>
                )}
              </div>

              {/* USDT Amount */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-900 font-mono font-semibold">
                  {formatCurrency(trade.usdtAmount)}
                </span>
              </div>

              {/* P&L or Unrealized P&L */}
              <div className="col-span-2 flex items-center">
                {pnl !== null ? (
                  // Closed trade - show realized P&L
                  <div className="flex items-center gap-1.5">
                    {isProfit ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : isLoss ? (
                      <TrendingDown className="w-4 h-4 text-rose-600" />
                    ) : null}
                    <span
                      className={`text-sm font-semibold font-mono ${
                        isProfit
                          ? "text-emerald-600"
                          : isLoss
                          ? "text-rose-600"
                          : "text-gray-600"
                      }`}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {formatCurrency(pnl)}
                    </span>
                  </div>
                ) : unrealizedPnL !== null ? (
                  // Open trade - show unrealized P&L
                  <div className="flex items-center gap-1.5">
                    {isUnrealizedProfit ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : isUnrealizedLoss ? (
                      <TrendingDown className="w-4 h-4 text-rose-600" />
                    ) : null}
                    <span
                      className={`text-sm font-semibold font-mono ${
                        isUnrealizedProfit
                          ? "text-emerald-600"
                          : isUnrealizedLoss
                          ? "text-rose-600"
                          : "text-gray-600"
                      }`}
                    >
                      {unrealizedPnL >= 0 ? "+" : ""}
                      {formatCurrency(unrealizedPnL)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}