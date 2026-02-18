"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trade, TradeFormData } from "@/lib/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade?: Trade;
}

export function TradeFormModal({ isOpen, onClose, trade }: TradeFormModalProps) {
  const createTrade = useMutation(api.trades.createTrade);
  const updateTrade = useMutation(api.trades.updateTrade);

  const [formData, setFormData] = useState<TradeFormData>({
    asset: trade?.asset || "",
    entryPrice: trade?.entryPrice || 0,
    usdtAmount: trade?.usdtAmount || 0,
    tradeType: trade?.tradeType || "usual",
    targetPrice: trade?.targetPrice,
    notes: trade?.notes || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (trade) {
        await updateTrade({
          id: trade._id,
          ...formData,
        });
      } else {
        await createTrade(formData);
      }
      onClose();
      // Reset form
      setFormData({
        asset: "",
        entryPrice: 0,
        usdtAmount: 0,
        tradeType: "usual",
        targetPrice: undefined,
        notes: "",
      });
    } catch (error) {
      console.error("Error saving trade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedQuantity = formData.entryPrice > 0 
    ? (formData.usdtAmount / formData.entryPrice).toFixed(5)
    : "0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {trade ? "Edit Trade" : "New Trade"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asset */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset / Ticker Symbol
            </label>
            <input
              type="text"
              value={formData.asset}
              onChange={(e) =>
                setFormData({ ...formData, asset: e.target.value.toUpperCase() })
              }
              placeholder="e.g., BTC, ETH, SOL"
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Entry Price and USDT Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USDT Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.usdtAmount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, usdtAmount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Calculated Quantity Display */}
          {formData.entryPrice > 0 && formData.usdtAmount > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Calculated Quantity</div>
              <div className="text-lg font-mono font-semibold text-gray-900">
                {calculatedQuantity} {formData.asset || "units"}
              </div>
            </div>
          )}

          {/* Trade Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trade Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tradeType: "usual" })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.tradeType === "usual"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
                }`}
              >
                Usual Trade
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tradeType: "investment" })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.tradeType === "investment"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
                }`}
              >
                Investment
              </button>
            </div>
          </div>

          {/* Target Price (for usual trades) */}
          {formData.tradeType === "usual" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Price <span className="text-gray-500">(optional - defaults to 10% gain)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.targetPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Leave empty for automatic 10% target"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this trade..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-600/30"
            >
              {isSubmitting ? "Saving..." : trade ? "Update Trade" : "Create Trade"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}