import React from 'react';
import { PaperTradePosition, Instrument } from '../types/market';
import { Briefcase, ArrowUpRight, ArrowDownRight, RotateCcw, XCircle, TrendingUp, ShieldCheck } from 'lucide-react';

interface PortfolioViewProps {
  cashBalance: number;
  positions: PaperTradePosition[];
  instruments: Instrument[];
  onClosePosition: (symbol: string) => void;
  onResetPortfolio: () => void;
  onOpenSuperchart: (symbol: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  cashBalance,
  positions,
  instruments,
  onClosePosition,
  onResetPortfolio,
  onOpenSuperchart
}) => {
  // Map current instrument prices
  const priceMap = React.useMemo(() => {
    const map = new Map<string, number>();
    instruments.forEach(i => map.set(i.symbol, i.price));
    return map;
  }, [instruments]);

  // Calculate position values & total portfolio equity
  let totalPositionValue = 0;
  let totalUnrealizedPnL = 0;

  const enrichedPositions = positions.map(pos => {
    const currentPrice = priceMap.get(pos.symbol) || pos.averageEntry;
    const value = pos.shares * currentPrice;
    const pnl = pos.type === 'BUY'
      ? (currentPrice - pos.averageEntry) * pos.shares
      : (pos.averageEntry - currentPrice) * pos.shares;
    const pnlPercent = (pnl / (pos.averageEntry * pos.shares)) * 100;

    totalPositionValue += value;
    totalUnrealizedPnL += pnl;

    return {
      ...pos,
      currentPrice,
      value,
      pnl,
      pnlPercent
    };
  });

  const totalEquity = cashBalance + totalPositionValue;
  const initialEquity = 100000;
  const totalReturn = totalEquity - initialEquity;
  const totalReturnPercent = (totalReturn / initialEquity) * 100;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Account Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Equity */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#787b86] text-xs">
            <span>Net Portfolio Equity</span>
            <ShieldCheck className="w-4 h-4 text-[#2962ff]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-1 text-xs font-mono font-semibold mt-1 ${totalReturn >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)} ({totalReturn >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Available Cash Balance */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#787b86] text-xs">
            <span>Unallocated Buying Power</span>
            <Briefcase className="w-4 h-4 text-[#089981]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#787b86] block mt-1">Available for new limit / market orders</span>
          </div>
        </div>

        {/* Open Positions Value */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#787b86] text-xs">
            <span>Invested Positions Value</span>
            <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              ${totalPositionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#787b86] block mt-1">{positions.length} active open trades</span>
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#787b86] text-xs">
            <span>Unrealized P&L</span>
            {totalUnrealizedPnL >= 0 ? <ArrowUpRight className="w-4 h-4 text-[#089981]" /> : <ArrowDownRight className="w-4 h-4 text-[#f23645]" />}
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${totalUnrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex justify-end mt-1">
              <button
                onClick={onResetPortfolio}
                className="flex items-center gap-1 text-[11px] text-[#787b86] hover:text-[#d1d4dc] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset $100k Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Open Positions Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-[#2a2e39]">
          <h3 className="text-sm font-bold text-white">Active Open Positions ({positions.length})</h3>
          <span className="text-xs text-[#787b86]">Simulated paper trading orders</span>
        </div>

        {positions.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-[#787b86]">
            <Briefcase className="w-8 h-8 opacity-40 text-[#2962ff]" />
            <p className="text-sm font-medium text-[#d1d4dc]">No open trading positions yet</p>
            <p className="text-xs max-w-sm">
              Head over to Superchart, inspect any stock or crypto, and click "BUY" to place your first simulated order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#787b86] border-b border-[#2a2e39] font-medium">
                  <th className="pb-2.5">Asset</th>
                  <th className="pb-2.5">Side</th>
                  <th className="pb-2.5 text-right">Shares / Qty</th>
                  <th className="pb-2.5 text-right">Avg Entry</th>
                  <th className="pb-2.5 text-right">Current Price</th>
                  <th className="pb-2.5 text-right">Position Value</th>
                  <th className="pb-2.5 text-right">Unrealized P&L</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/50">
                {enrichedPositions.map(pos => {
                  const isUp = pos.pnl >= 0;
                  return (
                    <tr key={pos.symbol} className="hover:bg-[#131722] transition-colors">
                      <td className="py-3">
                        <button
                          onClick={() => onOpenSuperchart(pos.symbol)}
                          className="text-left group"
                        >
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors block">
                            {pos.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86]">{pos.name}</span>
                        </button>
                      </td>

                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          pos.type === 'BUY' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
                        }`}>
                          {pos.type}
                        </span>
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums text-white">
                        {pos.shares}
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums text-[#d1d4dc]">
                        ${pos.averageEntry.toFixed(2)}
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums text-white font-semibold">
                        ${pos.currentPrice.toFixed(2)}
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums text-white font-semibold">
                        ${pos.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className={`py-3 text-right font-mono tabular-nums font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}${pos.pnl.toFixed(2)} ({isUp ? '+' : ''}{pos.pnlPercent.toFixed(2)}%)
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() => onClosePosition(pos.symbol)}
                          className="px-2.5 py-1 bg-[#f23645]/20 hover:bg-[#f23645] text-[#f23645] hover:text-white rounded text-[11px] font-semibold transition-colors"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
