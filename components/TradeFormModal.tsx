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
    quantity: trade?.quantity || 0,
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
        quantity: 0,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            {trade ? "Edit Trade" : "New Trade"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asset */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Asset / Ticker Symbol
            </label>
            <input
              type="text"
              value={formData.asset}
              onChange={(e) =>
                setFormData({ ...formData, asset: e.target.value.toUpperCase() })
              }
              placeholder="e.g., AAPL, BTC, TSLA"
              required
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
            />
          </div>

          {/* Entry Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Entry Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })
                }
                placeholder="0.00"
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseFloat(e.target.value) })
                }
                placeholder="0"
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
              />
            </div>
          </div>

          {/* Trade Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Trade Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tradeType: "usual" })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.tradeType === "usual"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-750 hover:text-white"
                }`}
              >
                Usual Trade
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tradeType: "investment" })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.tradeType === "investment"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-750 hover:text-white"
                }`}
              >
                Investment
              </button>
            </div>
          </div>

          {/* Target Price (for usual trades) */}
          {formData.tradeType === "usual" && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Target Price <span className="text-zinc-500">(optional)</span>
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
                placeholder="For Fibonacci calculations"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Notes <span className="text-zinc-500">(optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this trade..."
              rows={3}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-white border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-900/30"
            >
              {isSubmitting ? "Saving..." : trade ? "Update Trade" : "Create Trade"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}