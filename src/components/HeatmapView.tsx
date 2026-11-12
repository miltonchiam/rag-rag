import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { LayoutGrid, Layers, Info, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

interface HeatmapViewProps {
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenSuperchart: (instrument: Instrument) => void;
}

type HeatmapMode = 'sp500' | 'crypto' | 'tech';

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  instruments,
  onSelectInstrument,
  onOpenSuperchart
}) => {
  const [mode, setMode] = useState<HeatmapMode>('sp500');
  const [period, setPeriod] = useState<'1D' | '1W' | '1M'>('1D');
  const [hoveredItem, setHoveredItem] = useState<Instrument | null>(null);

  // Filter instruments according to heatmap mode
  const filtered = instruments.filter(item => {
    if (mode === 'crypto') return item.assetClass === 'crypto';
    if (mode === 'tech') return item.sector === 'Technology' || item.sector === 'Communication';
    return item.assetClass === 'stocks' || item.symbol === 'SPX' || item.symbol === 'NDX';
  });

  // Helper to color block according to % change
  const getHeatmapColor = (changePercent: number) => {
    // Multiply by period simulated multiplier if 1W / 1M
    const factor = period === '1W' ? 2.2 : period === '1M' ? 4.5 : 1;
    const adjusted = changePercent * factor;

    if (adjusted >= 4.0) return 'bg-[#089981] text-white';
    if (adjusted >= 1.5) return 'bg-[#089981]/80 text-white';
    if (adjusted > 0.3) return 'bg-[#089981]/50 text-emerald-100';
    if (adjusted >= -0.3) return 'bg-[#2a2e39] text-[#d1d4dc]';
    if (adjusted >= -1.5) return 'bg-[#f23645]/50 text-rose-100';
    if (adjusted >= -4.0) return 'bg-[#f23645]/80 text-white';
    return 'bg-[#f23645] text-white';
  };

  // Group by sector
  const sectors = React.useMemo(() => {
    const groups: { [key: string]: Instrument[] } = {};
    filtered.forEach(inst => {
      const sec = inst.sector || (inst.assetClass === 'crypto' ? 'Digital Assets' : 'Indices');
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(inst);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Heatmap Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e222d] p-3 rounded-lg border border-[#2a2e39]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold text-sm">
            <LayoutGrid className="w-4 h-4 text-[#2962ff]" />
            <span>Market Heatmap</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setMode('sp500')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                mode === 'sp500' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              S&P 500 Equities
            </button>
            <button
              onClick={() => setMode('crypto')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                mode === 'crypto' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              Crypto Ecosystem
            </button>
            <button
              onClick={() => setMode('tech')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                mode === 'tech' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              Global Tech Titans
            </button>
          </div>
        </div>

        {/* Period Selector & Legend */}
        <div className="flex items-center gap-4">
          {/* Timeframe */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39] text-xs">
            {(['1D', '1W', '1M'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  period === p ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Color Gradient Scale Legend */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#787b86]">
            <span>-3%</span>
            <div className="flex h-3 w-28 rounded-xs overflow-hidden">
              <div className="flex-1 bg-[#f23645]"></div>
              <div className="flex-1 bg-[#f23645]/60"></div>
              <div className="flex-1 bg-[#2a2e39]"></div>
              <div className="flex-1 bg-[#089981]/60"></div>
              <div className="flex-1 bg-[#089981]"></div>
            </div>
            <span>+3%</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Heatmap Grid Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Object.entries(sectors).map(([sectorName, items]) => {
          // Sort items in sector by market cap / volume descending
          const sorted = [...items].sort((a, b) => (b.marketCap || b.volume) - (a.marketCap || a.volume));

          return (
            <div 
              key={sectorName}
              className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-3 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[#d1d4dc] pb-1 border-b border-[#2a2e39]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2962ff]"></span>
                  {sectorName}
                </span>
                <span className="text-[11px] font-mono text-[#787b86]">{sorted.length} assets</span>
              </div>

              {/* Tiles inside sector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 min-h-[140px]">
                {sorted.map((item, idx) => {
                  const isLarge = idx === 0 && sorted.length > 2;
                  const colorClass = getHeatmapColor(item.changePercent);

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => onSelectInstrument(item)}
                      className={`relative group rounded p-2.5 flex flex-col justify-between cursor-pointer transition-transform hover:scale-[1.02] hover:z-10 shadow-xs ${colorClass} ${
                        isLarge ? 'col-span-2 row-span-2 min-h-[110px]' : 'min-h-[68px]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-xs sm:text-sm tracking-tight">{item.symbol}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSuperchart(item);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-black/30 hover:bg-black/50 text-white transition-opacity"
                          title="Open in Superchart"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex flex-col font-mono tabular-nums mt-1">
                        <span className="text-[11px] opacity-90 truncate font-sans">
                          {item.name}
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-xs font-bold">
                            ${item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs font-extrabold">
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Hover Details Tooltip / Card footer */}
      {hoveredItem && (
        <div className="sticky bottom-4 z-30 bg-[#1e222d] border border-[#2962ff] rounded-lg p-3 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center font-bold text-sm">
              {hoveredItem.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{hoveredItem.symbol}</span>
                <span className="text-xs text-[#787b86]">({hoveredItem.name})</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">{hoveredItem.exchange}</span>
              </div>
              <p className="text-xs text-[#787b86] line-clamp-1 max-w-xl">{hoveredItem.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono tabular-nums text-xs">
            <div>
              <span className="text-[#787b86] block text-[10px] uppercase">Price</span>
              <span className="font-bold text-white text-sm">
                ${hoveredItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[10px] uppercase">1D Change</span>
              <span className={`font-bold text-sm ${hoveredItem.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {hoveredItem.change >= 0 ? '+' : ''}{hoveredItem.changePercent.toFixed(2)}%
              </span>
            </div>
            {hoveredItem.marketCap && (
              <div>
                <span className="text-[#787b86] block text-[10px] uppercase">Market Cap</span>
                <span className="font-bold text-[#d1d4dc]">
                  ${(hoveredItem.marketCap / 1000000000).toFixed(1)}B
                </span>
              </div>
            )}
            <div>
              <span className="text-[#787b86] block text-[10px] uppercase">Rating</span>
              <span className={`font-bold font-sans text-xs ${hoveredItem.technicalRating.includes('Buy') ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {hoveredItem.technicalRating}
              </span>
            </div>

            <button
              onClick={() => onOpenSuperchart(hoveredItem)}
              className="px-3 py-1.5 bg-[#2962ff] hover:bg-[#2962ff]/90 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>View Superchart</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
