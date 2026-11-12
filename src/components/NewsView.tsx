import React, { useState } from 'react';
import { NewsItem, Instrument } from '../types/market';
import { MOCK_NEWS } from '../data/mockMarketData';
import { Newspaper, ArrowUpRight, Clock, Tag, ExternalLink, Sparkles } from 'lucide-react';

interface NewsViewProps {
  onSelectSymbol: (symbol: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onSelectSymbol }) => {
  const [filter, setFilter] = useState<'all' | 'stocks' | 'crypto' | 'bonds' | 'commodities'>('all');

  const filteredNews = filter === 'all' 
    ? MOCK_NEWS 
    : MOCK_NEWS.filter(item => item.assetClass === filter);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header and Filter */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-white">Global Markets News & Macro Insights</h2>
        </div>

        {/* Categories */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39] text-xs">
          {(['all', 'stocks', 'crypto', 'bonds', 'commodities'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 font-semibold rounded-md transition-colors capitalize ${
                filter === cat ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Stream Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map(news => {
          const isBullish = news.sentiment === 'Bullish';
          const isBearish = news.sentiment === 'Bearish';

          return (
            <div
              key={news.id}
              className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] rounded-lg p-5 flex flex-col justify-between gap-4 transition-all shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-[#787b86]">
                  <span className="font-semibold text-white">{news.source}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{news.timeAgo}</span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs text-[#787b86] leading-relaxed">
                  {news.summary}
                </p>
              </div>

              {/* Bottom bar: related tickers + sentiment */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2a2e39] text-xs">
                {/* Related Symbols */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3 h-3 text-[#787b86]" />
                  {news.relatedSymbols.map(sym => (
                    <button
                      key={sym}
                      onClick={() => onSelectSymbol(sym)}
                      className="px-2 py-0.5 rounded bg-[#131722] hover:bg-[#2962ff] border border-[#2a2e39] hover:border-[#2962ff] text-[#d1d4dc] hover:text-white font-mono text-[11px] font-semibold transition-colors"
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                {/* Sentiment Pill */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isBullish
                    ? 'bg-[#089981]/20 text-[#089981]'
                    : isBearish
                    ? 'bg-[#f23645]/20 text-[#f23645]'
                    : 'bg-[#2a2e39] text-[#787b86]'
                }`}>
                  {news.sentiment}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
