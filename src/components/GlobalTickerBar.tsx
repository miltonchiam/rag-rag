import React from 'react';
import { Instrument } from '../types/market';
import { ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface GlobalTickerBarProps {
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  selectedSymbol: string;
}

export const GlobalTickerBar: React.FC<GlobalTickerBarProps> = ({
  instruments,
  onSelectInstrument,
  selectedSymbol
}) => {
  // Take premier key benchmarks
  const keySymbols = ['SPX', 'NDX', 'DJI', 'BTC/USD', 'ETH/USD', 'XAU/USD', 'CL', 'US10Y', 'EUR/USD', 'NVDA', 'TSLA'];
  const featured = instruments.filter(inst => keySymbols.includes(inst.symbol));

  return (
    <div className="w-full bg-[#181c27] dark:bg-[#181c27] border-b border-[#2a2e39] py-1.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max">
        {featured.map((item) => {
          const isUp = item.change >= 0;
          const isSelected = selectedSymbol === item.symbol;

          // Tiny sparkline path generator
          const min = Math.min(...item.sparkline);
          const max = Math.max(...item.sparkline);
          const range = max - min || 1;
          const w = 42;
          const h = 16;
          const points = item.sparkline
            .map((val, idx) => {
              const x = (idx / (item.sparkline.length - 1)) * w;
              const y = h - ((val - min) / range) * (h - 2) - 1;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <button
              key={item.id}
              onClick={() => onSelectInstrument(item)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-md border text-left transition-all ${
                isSelected
                  ? 'bg-[#1e222d] border-[#2962ff] shadow-sm ring-1 ring-[#2962ff]/40'
                  : 'bg-[#131722]/80 hover:bg-[#1e222d] border-[#2a2e39] hover:border-[#363a45]'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">{item.symbol}</span>
                  <span className="text-[10px] text-[#787b86] truncate max-w-[70px]">{item.name}</span>
                </div>
                <div className="flex items-baseline gap-2 font-mono text-xs tabular-nums mt-0.5">
                  <span className="font-semibold text-[#d1d4dc]">
                    {item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {item.currency === '%' ? '%' : ''}
                  </span>
                  <span className={`flex items-center text-[11px] font-medium ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="w-[42px] h-[16px] flex items-center shrink-0">
                <svg width="42" height="16" className="overflow-visible">
                  <polyline
                    fill="none"
                    stroke={isUp ? '#089981' : '#f23645'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
