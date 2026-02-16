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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{trade.asset}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatDateTime(trade.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                Entry Price
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {formatCurrency(trade.entryPrice)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                Quantity
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {trade.quantity}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                Position Value
              </div>
              <div className="text-xl font-bold text-emerald-600 font-mono">
                {formatCurrency(trade.entryPrice * trade.quantity)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                Trade Type
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    trade.tradeType === "usual"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
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
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                    Realized P&L
                  </div>
                  <div
                    className={`text-3xl font-bold font-mono ${
                      pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {pnl >= 0 ? "+" : ""}
                    {formatCurrency(pnl)}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl ${
                    pnl >= 0 ? "bg-emerald-100" : "bg-rose-100"
                  }`}
                >
                  <TrendingUp
                    className={`w-8 h-8 ${
                      pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fibonacci Calculator (for usual trades) */}
          {trade.tradeType === "usual" && calculations && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Target className="w-5 h-5" />
                <h3 className="text-lg font-bold">Take Profit Levels</h3>
              </div>

              <div className="grid gap-3">
                {calculations.fibLevels.map((level, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-sm">
                            {level.name}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            {level.percentage}% Fibonacci
                          </div>
                          <div className="text-lg font-bold text-gray-900 font-mono">
                            {formatCurrency(level.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Potential Profit</div>
                        <div className="text-lg font-bold text-emerald-600 font-mono">
                          +{formatCurrency(level.profit)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stop Loss */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-bold">Stop Loss Recommendation</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                      Stop Loss Price
                    </div>
                    <div className="text-xl font-bold text-rose-600 font-mono">
                      {formatCurrency(calculations.stopLoss)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                      Potential Loss
                    </div>
                    <div className="text-xl font-bold text-rose-600 font-mono">
                      -{formatCurrency(calculations.potentialLoss)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-rose-200">
                  <div className="text-xs text-gray-600">
                    Risk-Reward Ratio: <span className="text-rose-600 font-semibold">1:2</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">
                Notes
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{trade.notes}</div>
            </div>
          )}

          {/* Close Trade Section (if open) */}
          {trade.status === "open" && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Close Position</h4>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="Exit price"
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
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
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => setIsEditMode(true)}
              variant="outline"
              className="flex-1 bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleToggleType}
              variant="outline"
              className="flex-1 bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Convert to {trade.tradeType === "usual" ? "Investment" : "Usual"}
            </Button>
            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600"
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