import React, { useState, useEffect, useRef } from 'react';
import { Instrument } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  instruments,
  onSelectInstrument
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // If already open, close; if closed, open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = instruments.filter(item => {
    if (activeTab !== 'all' && item.assetClass !== activeTab) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 bg-[#181c27] border-b border-[#2a2e39] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, currency, or company name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#787b86] focus:outline-none font-medium"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#131722] border border-[#363a45] rounded text-[#787b86] font-mono">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 text-[#787b86] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1 px-3 py-2 bg-[#131722] border-b border-[#2a2e39] overflow-x-auto no-scrollbar text-xs">
          {(['all', 'stocks', 'crypto', 'forex', 'indices', 'commodities', 'bonds'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded font-medium transition-colors capitalize ${
                activeTab === tab ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#2a2e39]/50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#787b86] text-xs">
              No matching instruments found for "{query}".
            </div>
          ) : (
            filtered.map(item => {
              const isUp = item.change >= 0;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectInstrument(item);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 hover:bg-[#131722] rounded-lg transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#2962ff]">
                      {item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors text-sm">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-[#2a2e39] text-[#787b86] font-mono uppercase">
                          {item.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-[#787b86] block truncate max-w-xs">{item.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end font-mono tabular-nums">
                      <span className="font-bold text-white text-xs">
                        ${item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`text-[11px] font-semibold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787b86] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
