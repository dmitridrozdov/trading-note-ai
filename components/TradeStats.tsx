import { TradeStats as TradeStatsType } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

interface TradeStatsProps {
  stats: TradeStatsType;
}

export function TradeStats({ stats }: TradeStatsProps) {
  const statCards = [
    {
      label: "Total Trades",
      value: stats.totalTrades.toString(),
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-950/30",
      borderColor: "border-blue-900/50",
    },
    {
      label: "Open Positions",
      value: stats.openPositions.toString(),
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/30",
      borderColor: "border-cyan-900/50",
    },
    {
      label: "Win Rate",
      value: stats.closedTrades > 0 ? `${stats.winRate}%` : "N/A",
      icon: BarChart3,
      color: stats.winRate >= 50 ? "text-emerald-400" : "text-amber-400",
      bgColor: stats.winRate >= 50 ? "bg-emerald-950/30" : "bg-amber-950/30",
      borderColor: stats.winRate >= 50 ? "border-emerald-900/50" : "border-amber-900/50",
    },
    {
      label: "Total P&L",
      value: formatCurrency(stats.totalPnL),
      icon: stats.totalPnL >= 0 ? TrendingUp : TrendingDown,
      color: stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400",
      bgColor: stats.totalPnL >= 0 ? "bg-emerald-950/30" : "bg-rose-950/30",
      borderColor: stats.totalPnL >= 0 ? "border-emerald-900/50" : "border-rose-900/50",
    },
    {
      label: "Portfolio Value",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: "text-violet-400",
      bgColor: "bg-violet-950/30",
      borderColor: "border-violet-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-5 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-${stat.color}/10`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`${stat.color} p-2 rounded-lg bg-black/30`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold ${stat.color} tracking-tight`}>
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}