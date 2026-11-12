import React from 'react';
import { Instrument } from '../types/market';
import { X, Star, Trash2, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onToggleWatchlist: (symbol: string) => void;
  onOpenSuperchart: (instrument: Instrument) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  instruments,
  onSelectInstrument,
  onToggleWatchlist,
  onOpenSuperchart
}) => {
  if (!isOpen) return null;

  const watchlistedItems = instruments.filter(i => watchlist.includes(i.symbol));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-[#1e222d] border-l border-[#2a2e39] h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-4 bg-[#181c27] border-b border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#f59e0b] fill-current" />
            <h3 className="font-bold text-white text-sm">Trading Watchlist</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2e39] text-[#787b86] font-mono">
              {watchlistedItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-white hover:bg-[#2a2e39] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {watchlistedItems.length === 0 ? (
            <div className="py-16 text-center text-[#787b86] px-4 flex flex-col items-center gap-2">
              <Star className="w-8 h-8 opacity-30 text-[#f59e0b]" />
              <p className="text-sm font-semibold text-[#d1d4dc]">Your watchlist is empty</p>
              <p className="text-xs">
                Click the star icon next to any ticker in the Overview, Screener, or Superchart to monitor it here in real time.
              </p>
            </div>
          ) : (
            watchlistedItems.map(item => {
              const isUp = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectInstrument(item);
                  }}
                  className="bg-[#131722] hover:bg-[#2a2e39]/60 border border-[#2a2e39] hover:border-[#2962ff] rounded-lg p-3 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors text-sm">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-[#2a2e39] text-[#787b86] font-mono uppercase">
                        {item.exchange}
                      </span>
                    </div>
                    <span className="text-xs text-[#787b86] truncate max-w-[140px]">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end font-mono tabular-nums">
                      <span className="font-bold text-white text-xs">
                        ${item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`text-[11px] font-semibold flex items-center ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(item.symbol);
                      }}
                      className="p-1 text-[#787b86] hover:text-[#f23645] transition-colors rounded hover:bg-[#1e222d]"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        {watchlistedItems.length > 0 && (
          <div className="p-3 bg-[#181c27] border-t border-[#2a2e39] text-center text-xs text-[#787b86]">
            Click any item to view details or trade.
          </div>
        )}
      </div>
    </div>
  );
};
