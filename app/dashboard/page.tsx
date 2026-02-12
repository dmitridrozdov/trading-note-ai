"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trade, TradeType } from "@/lib/types";
import { TradeList } from "@/components/TradeList";
import { TradeStats as TradeStatsComponent } from "@/components/TradeStats";
import { TradeFormModal } from "@/components/TradeFormModal";
import { TradeDetailModal } from "@/components/TradeDetailModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type FilterType = "all" | "usual" | "investment" | "open" | "closed";
type SortType = "date" | "asset" | "pnl";

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const trades = useQuery(api.queries.getTrades, { filter, sortBy }) || [];
  const stats = useQuery(api.queries.getTradeStats) || {
    totalTrades: 0,
    openPositions: 0,
    closedTrades: 0,
    winRate: 0,
    totalPnL: 0,
    totalValue: 0,
  };

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Trading Journal
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Track and analyze your trades
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-900/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Trade
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <TradeStatsComponent stats={stats} />

        {/* Filters and Trade List */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {(["all", "usual", "investment", "open", "closed"] as FilterType[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === f
                        ? "bg-zinc-800 text-white shadow-lg"
                        : "bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 rounded-lg bg-zinc-900/50 text-zinc-300 text-sm font-medium border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-all"
            >
              <option value="date">Sort by Date</option>
              <option value="asset">Sort by Asset</option>
              <option value="pnl">Sort by P&L</option>
            </select>
          </div>

          {/* Trade List */}
          <TradeList trades={trades} onTradeClick={handleTradeClick} />
        </div>
      </main>

      {/* Modals */}
      <TradeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedTrade && (
        <TradeDetailModal
          trade={selectedTrade}
          isOpen={!!selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </div>
  );
}