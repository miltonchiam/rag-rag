import React, { useState } from 'react';
import { Instrument, AssetClass } from '../types/market';
import { SECTOR_PERFORMANCE } from '../data/mockMarketData';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  Compass, 
  BarChart3, 
  ChevronRight, 
  Flame, 
  Zap,
  Globe2,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

interface OverviewViewProps {
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenSuperchart: (instrument: Instrument) => void;
  onToggleWatchlist: (symbol: string) => void;
  watchlist: string[];
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  instruments,
  onSelectInstrument,
  onOpenSuperchart,
  onToggleWatchlist,
  watchlist
}) => {
  const [activeCategory, setActiveCategory] = useState<AssetClass | 'all'>('all');
  const [moverTab, setMoverTab] = useState<'gainers' | 'losers' | 'mostActive'>('gainers');

  // Filter instruments by active category
  const filteredInstruments = activeCategory === 'all' 
    ? instruments 
    : instruments.filter(item => item.assetClass === activeCategory);

  // Market Movers
  const gainers = [...instruments].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...instruments].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...instruments].sort((a, b) => b.volume - a.volume).slice(0, 5);

  const activeMovers = moverTab === 'gainers' ? gainers : moverTab === 'losers' ? losers : mostActive;

  // Key cards for top hero showcase
  const topSpotlights = instruments.filter(i => ['SPX', 'NDX', 'NVDA', 'BTC/USD'].includes(i.symbol));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Global Market Pulse & Spotlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topSpotlights.map(item => {
          const isUp = item.change >= 0;
          const min = Math.min(...item.sparkline);
          const max = Math.max(...item.sparkline);
          const range = max - min || 1;
          const w = 180;
          const h = 48;
          const points = item.sparkline
            .map((val, idx) => {
              const x = (idx / (item.sparkline.length - 1)) * w;
              const y = h - ((val - min) / range) * (h - 6) - 3;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <div
              key={item.id}
              onClick={() => onSelectInstrument(item)}
              className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] rounded-lg p-4 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base tracking-tight">{item.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">{item.exchange}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSuperchart(item);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#2962ff] transition-opacity"
                    title="Open Superchart"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#787b86] truncate mb-2">{item.name}</p>

                <div className="flex items-baseline justify-between font-mono tabular-nums">
                  <span className="text-xl font-bold text-white">
                    ${item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isUp ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Canvas */}
              <div className="mt-4 pt-2 border-t border-[#2a2e39]/60">
                <svg width="100%" height="48" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
                  <polyline
                    fill="none"
                    stroke={isUp ? '#089981' : '#f23645'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Category Filter & Sector Bar Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Sector Performance & Market Breadth */}
        <div className="lg:w-1/3 bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-sm font-bold text-white">US Sector Heat</h3>
            </div>
            <span className="text-xs text-[#787b86]">Today's Performance</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {SECTOR_PERFORMANCE.slice(0, 6).map(sec => {
              const isUp = sec.change >= 0;
              return (
                <div key={sec.name} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#d1d4dc]">{sec.name}</span>
                    <span className={`font-mono font-bold tabular-nums ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isUp ? '+' : ''}{sec.change.toFixed(2)}%
                    </span>
                  </div>
                  {/* Performance bar */}
                  <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                      style={{ width: `${Math.min(100, Math.abs(sec.change) * 25 + 15)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fear & Greed Sentiment Bar */}
          <div className="mt-2 pt-3 border-t border-[#2a2e39] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#787b86]">Market Sentiment</span>
              <span className="font-bold text-[#089981] font-mono">Greed (74/100)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#f23645] via-[#f59e0b] to-[#089981] p-0.5">
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow-md ml-[74%] -mt-0.5"></div>
            </div>
          </div>
        </div>

        {/* Right: Market Movers (Gainers, Losers, Most Active) */}
        <div className="lg:w-2/3 bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#f59e0b]" />
              <h3 className="text-sm font-bold text-white">Market Movers</h3>
            </div>

            {/* Mover Tabs */}
            <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
              <button
                onClick={() => setMoverTab('gainers')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  moverTab === 'gainers' ? 'bg-[#089981] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setMoverTab('losers')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  moverTab === 'losers' ? 'bg-[#f23645] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setMoverTab('mostActive')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  moverTab === 'mostActive' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Most Active
              </button>
            </div>
          </div>

          {/* Movers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#787b86] border-b border-[#2a2e39] font-medium">
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Change</th>
                  <th className="pb-2 text-right">% Change</th>
                  <th className="pb-2 text-right">Volume</th>
                  <th className="pb-2 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/50">
                {activeMovers.map(inst => {
                  const isUp = inst.change >= 0;
                  return (
                    <tr
                      key={inst.id}
                      onClick={() => onSelectInstrument(inst)}
                      className="hover:bg-[#131722] cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWatchlist(inst.symbol);
                            }}
                            className={`p-1 rounded hover:bg-[#2a2e39] ${
                              watchlist.includes(inst.symbol) ? 'text-[#f59e0b]' : 'text-[#787b86]'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <div>
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">{inst.symbol}</span>
                            <span className="text-[#787b86] ml-2 hidden sm:inline">{inst.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-white font-medium">
                        ${inst.price < 5 && inst.assetClass === 'forex' ? inst.price.toFixed(4) : inst.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`py-2.5 text-right font-mono tabular-nums font-semibold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{inst.change.toFixed(2)}
                      </td>
                      <td className={`py-2.5 text-right font-mono tabular-nums font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{inst.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-[#787b86]">
                        {(inst.volume / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          inst.technicalRating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : inst.technicalRating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-[#2a2e39] text-[#787b86]'
                        }`}>
                          {inst.technicalRating}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Global Market Screener / Data Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-sm font-bold text-white">Global Markets Overview</h3>
          </div>

          {/* Asset Class Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {(['all', 'indices', 'stocks', 'crypto', 'forex', 'commodities', 'bonds'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize ${
                  activeCategory === cat
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#131722]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Instruments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] font-medium">
                <th className="pb-2.5">Asset</th>
                <th className="pb-2.5 text-right">Price</th>
                <th className="pb-2.5 text-right">1D Change</th>
                <th className="pb-2.5 text-right">1D %</th>
                <th className="pb-2.5 text-center hidden md:table-cell">52-Week Range</th>
                <th className="pb-2.5 text-right hidden sm:table-cell">Technical Rating</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredInstruments.map(item => {
                const isUp = item.change >= 0;
                const range52 = item.high52Week - item.low52Week || 1;
                const progress52 = Math.min(100, Math.max(0, ((item.price - item.low52Week) / range52) * 100));

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectInstrument(item)}
                    className="hover:bg-[#131722] cursor-pointer transition-colors group"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(item.symbol);
                          }}
                          className={`p-1 rounded hover:bg-[#2a2e39] ${
                            watchlist.includes(item.symbol) ? 'text-[#f59e0b]' : 'text-[#787b86]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">{item.symbol}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2e39] text-[#787b86] uppercase font-mono">{item.exchange}</span>
                          </div>
                          <p className="text-[11px] text-[#787b86] truncate max-w-[180px] sm:max-w-xs">{item.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-right font-mono tabular-nums text-white font-semibold">
                      ${item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {item.currency === '%' ? '%' : ''}
                    </td>

                    <td className={`py-3 text-right font-mono tabular-nums font-semibold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isUp ? '+' : ''}{item.change.toFixed(2)}
                    </td>

                    <td className={`py-3 text-right font-mono tabular-nums font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </td>

                    {/* 52-Week Range Bar */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1 w-36 mx-auto">
                        <div className="flex justify-between text-[10px] font-mono text-[#787b86]">
                          <span>{item.low52Week.toFixed(1)}</span>
                          <span>{item.high52Week.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden relative">
                          <div
                            className="bg-[#2962ff] h-full rounded-full"
                            style={{ width: `${progress52}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 text-right hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/30'
                          : item.technicalRating.includes('Sell')
                          ? 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/30'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {item.technicalRating}
                      </span>
                    </td>

                    {/* Superchart CTA */}
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSuperchart(item);
                        }}
                        className="px-2.5 py-1 bg-[#2a2e39] hover:bg-[#2962ff] text-[#d1d4dc] hover:text-white rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Chart</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
