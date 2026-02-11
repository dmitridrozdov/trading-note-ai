"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trade } from "@/lib/types";
import { calculateTradeMetrics, formatCurrency, formatDateTime, calculatePnL } from "@/lib/calculations";
import { X, Edit2, Trash2, ArrowLeftRight, Target, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeFormModal } from "./TradeFormModal";

interface TradeDetailModalProps {
  trade: Trade;
  isOpen: boolean;
  onClose: () => void;
}

export function TradeDetailModal({ trade, isOpen, onClose }: TradeDetailModalProps) {
  const deleteTrade = useMutation(api.trades.deleteTrade);
  const toggleTradeType = useMutation(api.trades.toggleTradeType);
  const closeTrade = useMutation(api.trades.closeTrade);

  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exitPrice, setExitPrice] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const calculations = calculateTradeMetrics(trade);
  const pnl = calculatePnL(trade);

  const handleDelete = async () => {
    try {
      await deleteTrade({ id: trade._id });
      onClose();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const handleToggleType = async () => {
    try {
      await toggleTradeType({ id: trade._id });
    } catch (error) {
      console.error("Error toggling trade type:", error);
    }
  };

  const handleCloseTrade = async () => {
    if (!exitPrice) return;
    setIsClosing(true);
    try {
      await closeTrade({ id: trade._id, exitPrice: parseFloat(exitPrice) });
      onClose();
    } catch (error) {
      console.error("Error closing trade:", error);
    } finally {
      setIsClosing(false);
    }
  };

  if (isEditMode) {
    return (
      <TradeFormModal
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        trade={trade}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{trade.asset}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {formatDateTime(trade.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Entry Price
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(trade.entryPrice)}
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Quantity
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {trade.quantity}
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Position Value
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono">
                {formatCurrency(trade.entryPrice * trade.quantity)}
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Trade Type
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    trade.tradeType === "usual"
                      ? "bg-blue-950/50 text-blue-300 border border-blue-900/50"
                      : "bg-purple-950/50 text-purple-300 border border-purple-900/50"
                  }`}
                >
                  {trade.tradeType === "usual" ? "Usual" : "Investment"}
                </span>
              </div>
            </div>
          </div>

          {/* P&L (if closed) */}
          {pnl !== null && (
            <div
              className={`border rounded-xl p-5 ${
                pnl >= 0
                  ? "bg-emerald-950/30 border-emerald-900/50"
                  : "bg-rose-950/30 border-rose-900/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
                    Realized P&L
                  </div>
                  <div
                    className={`text-3xl font-bold font-mono ${
                      pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {pnl >= 0 ? "+" : ""}
                    {formatCurrency(pnl)}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl ${
                    pnl >= 0 ? "bg-emerald-900/30" : "bg-rose-900/30"
                  }`}
                >
                  <TrendingUp
                    className={`w-8 h-8 ${
                      pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fibonacci Calculator (for usual trades) */}
          {trade.tradeType === "usual" && calculations && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5" />
                <h3 className="text-lg font-bold">Take Profit Levels</h3>
              </div>

              <div className="grid gap-3">
                {calculations.fibLevels.map((level, index) => (
                  <div
                    key={index}
                    className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-sm">
                            {level.name}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-400">
                            {level.percentage}% Fibonacci
                          </div>
                          <div className="text-lg font-bold text-white font-mono">
                            {formatCurrency(level.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 mb-1">Potential Profit</div>
                        <div className="text-lg font-bold text-emerald-400 font-mono">
                          +{formatCurrency(level.profit)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stop Loss */}
              <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-bold">Stop Loss Recommendation</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Stop Loss Price
                    </div>
                    <div className="text-xl font-bold text-rose-400 font-mono">
                      {formatCurrency(calculations.stopLoss)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Potential Loss
                    </div>
                    <div className="text-xl font-bold text-rose-400 font-mono">
                      -{formatCurrency(calculations.potentialLoss)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-rose-900/30">
                  <div className="text-xs text-zinc-500">
                    Risk-Reward Ratio: <span className="text-rose-300 font-semibold">1:2</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Notes
              </div>
              <div className="text-sm text-zinc-300 whitespace-pre-wrap">{trade.notes}</div>
            </div>
          )}

          {/* Close Trade Section (if open) */}
          {trade.status === "open" && (
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3">Close Position</h4>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="Exit price"
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-600 focus:outline-none"
                />
                <Button
                  onClick={handleCloseTrade}
                  disabled={!exitPrice || isClosing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isClosing ? "Closing..." : "Close Trade"}
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <Button
              onClick={() => setIsEditMode(true)}
              variant="outline"
              className="flex-1 bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleToggleType}
              variant="outline"
              className="flex-1 bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-white"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Convert to {trade.tradeType === "usual" ? "Investment" : "Usual"}
            </Button>
            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="bg-rose-950/30 hover:bg-rose-900/30 border-rose-900/50 text-rose-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            ) : (
              <Button
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}