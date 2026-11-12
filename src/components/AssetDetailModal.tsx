import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { 
  X, 
  Star, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  DollarSign, 
  Activity, 
  Building2, 
  BarChart2,
  CheckCircle2
} from 'lucide-react';

interface AssetDetailModalProps {
  instrument: Instrument | null;
  onClose: () => void;
  onOpenSuperchart: (instrument: Instrument) => void;
  onToggleWatchlist: (symbol: string) => void;
  isWatchlisted: boolean;
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
  portfolioBalance: number;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  instrument,
  onClose,
  onOpenSuperchart,
  onToggleWatchlist,
  isWatchlisted,
  onExecuteTrade,
  portfolioBalance
}) => {
  if (!instrument) return null;

  const [tradeShares, setTradeShares] = useState(10);
  const [tradeFeedback, setTradeFeedback] = useState<string | null>(null);

  const isUp = instrument.change >= 0;
  const range52 = instrument.high52Week - instrument.low52Week || 1;
  const progress52 = Math.min(100, Math.max(0, ((instrument.price - instrument.low52Week) / range52) * 100));

  const dayRange = instrument.high - instrument.low || 1;
  const progressDay = Math.min(100, Math.max(0, ((instrument.price - instrument.low) / dayRange) * 100));

  // Technical Speedometer Gauge Calculation
  // score from -100 to +100 mapped to angle -90 to +90 deg
  const score = instrument.ratingScores.score;
  const needleAngle = (score / 100) * 80; // range ~ -80 to +80

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (tradeShares <= 0) return;
    const totalCost = tradeShares * instrument.price;
    if (type === 'BUY' && totalCost > portfolioBalance) {
      setTradeFeedback(`Insufficient sim cash ($${totalCost.toFixed(2)} required)`);
      setTimeout(() => setTradeFeedback(null), 3000);
      return;
    }
    onExecuteTrade(instrument.symbol, type, tradeShares, instrument.price);
    setTradeFeedback(`Executed ${type} ${tradeShares} shares @ $${instrument.price.toFixed(2)}`);
    setTimeout(() => setTradeFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* 1. Header */}
        <div className="p-4 bg-[#181c27] border-b border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleWatchlist(instrument.symbol)}
              className={`p-1.5 rounded-lg border border-[#2a2e39] hover:bg-[#2a2e39] transition-colors ${
                isWatchlisted ? 'text-[#f59e0b] bg-[#f59e0b]/10' : 'text-[#787b86]'
              }`}
              title="Add to Watchlist"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{instrument.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">{instrument.exchange}</span>
                <span className="text-xs text-[#787b86] hidden sm:inline">{instrument.name}</span>
              </div>
              <p className="text-xs text-[#787b86] truncate max-w-sm sm:max-w-md">{instrument.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-white hover:bg-[#2a2e39] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Price Overview Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#131722] rounded-lg border border-[#2a2e39]">
            <div>
              <span className="text-xs text-[#787b86] uppercase tracking-wider block">Live Quote</span>
              <div className="flex items-baseline gap-2.5 font-mono tabular-nums mt-0.5">
                <span className="text-2xl font-bold text-white">
                  ${instrument.price < 5 && instrument.assetClass === 'forex' ? instrument.price.toFixed(4) : instrument.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {instrument.currency === '%' ? '%' : ''}
                </span>
                <span className={`text-sm font-bold flex items-center ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {isUp ? '+' : ''}{instrument.change.toFixed(2)} ({isUp ? '+' : ''}{instrument.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenSuperchart(instrument);
              }}
              className="px-4 py-2 bg-[#2962ff] hover:bg-[#2962ff]/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Open in Superchart</span>
            </button>
          </div>

          {/* Technical Analysis Speedometer Rating */}
          <div className="bg-[#131722] border border-[#2a2e39] rounded-lg p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 border-b border-[#2a2e39] text-xs">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Gauge className="w-4 h-4 text-[#2962ff]" />
                <span>Technical Analysis Rating</span>
              </div>
              <span className={`font-bold font-mono ${instrument.technicalRating.includes('Buy') ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {instrument.technicalRating}
              </span>
            </div>

            {/* Speedometer SVG */}
            <div className="relative w-56 h-28 mt-4 flex items-center justify-center">
              <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                {/* Gauge Semicircle Arc (Sell -> Neutral -> Buy) */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#2a2e39"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Red section */}
                <path
                  d="M 20 100 A 80 80 0 0 1 65 38"
                  fill="none"
                  stroke="#f23645"
                  strokeWidth="14"
                />
                {/* Neutral section */}
                <path
                  d="M 65 38 A 80 80 0 0 1 135 38"
                  fill="none"
                  stroke="#787b86"
                  strokeWidth="14"
                />
                {/* Green section */}
                <path
                  d="M 135 38 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#089981"
                  strokeWidth="14"
                />

                {/* Gauge Needle */}
                <g transform={`translate(100, 100) rotate(${needleAngle})`}>
                  <line x1="0" y1="0" x2="0" y2="-72" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="6" fill="#ffffff" />
                </g>

                {/* Labels */}
                <text x="24" y="108" fill="#f23645" fontSize="9" fontWeight="bold">SELL</text>
                <text x="100" y="24" fill="#787b86" fontSize="9" fontWeight="bold" textAnchor="middle">NEUTRAL</text>
                <text x="176" y="108" fill="#089981" fontSize="9" fontWeight="bold" textAnchor="end">BUY</text>
              </svg>
            </div>

            {/* Breakdown meters */}
            <div className="grid grid-cols-2 gap-4 w-full mt-2 pt-3 border-t border-[#2a2e39] text-xs">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[#787b86]">
                  <span>Oscillators:</span>
                  <span className="font-semibold text-white">{instrument.ratingScores.oscillators}</span>
                </div>
                <div className="w-full bg-[#1e222d] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${instrument.ratingScores.oscillators === 'Buy' ? 'bg-[#089981]' : instrument.ratingScores.oscillators === 'Sell' ? 'bg-[#f23645]' : 'bg-[#787b86]'}`}
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[#787b86]">
                  <span>Moving Averages:</span>
                  <span className="font-semibold text-white">{instrument.ratingScores.movingAverages}</span>
                </div>
                <div className="w-full bg-[#1e222d] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${instrument.ratingScores.movingAverages.includes('Buy') ? 'bg-[#089981]' : instrument.ratingScores.movingAverages.includes('Sell') ? 'bg-[#f23645]' : 'bg-[#787b86]'}`}
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="bg-[#131722] border border-[#2a2e39] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>Valuation & Key Metrics</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs font-mono tabular-nums">
              {instrument.marketCap && (
                <div>
                  <span className="text-[#787b86] block text-[10px] font-sans uppercase">Market Cap</span>
                  <span className="font-bold text-white">${(instrument.marketCap / 1000000000).toFixed(2)}B</span>
                </div>
              )}
              {instrument.peRatio && (
                <div>
                  <span className="text-[#787b86] block text-[10px] font-sans uppercase">P/E Ratio</span>
                  <span className="font-bold text-white">{instrument.peRatio.toFixed(1)}</span>
                </div>
              )}
              {instrument.dividendYield !== undefined && (
                <div>
                  <span className="text-[#787b86] block text-[10px] font-sans uppercase">Div Yield</span>
                  <span className="font-bold text-white">{instrument.dividendYield.toFixed(2)}%</span>
                </div>
              )}
              <div>
                <span className="text-[#787b86] block text-[10px] font-sans uppercase">Day Low</span>
                <span className="font-bold text-white">${instrument.low.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[10px] font-sans uppercase">Day High</span>
                <span className="font-bold text-white">${instrument.high.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[10px] font-sans uppercase">Volume</span>
                <span className="font-bold text-white">{(instrument.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>

            {/* 52-Week Range Bar */}
            <div className="mt-4 pt-3 border-t border-[#2a2e39] flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-mono text-[11px] text-[#787b86]">
                <span>52W L: ${instrument.low52Week.toFixed(2)}</span>
                <span className="font-sans font-semibold text-white">52-Week Range</span>
                <span>52W H: ${instrument.high52Week.toFixed(2)}</span>
              </div>
              <div className="w-full bg-[#1e222d] h-2 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#2962ff] h-full rounded-full"
                  style={{ width: `${progress52}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Footer Action: Instant Paper Trade Execution */}
        <div className="p-4 bg-[#181c27] border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-3">
          {tradeFeedback ? (
            <div className="flex items-center gap-1.5 text-xs text-[#089981] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>{tradeFeedback}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#787b86]">Sim Qty:</span>
              <input
                type="number"
                min="1"
                value={tradeShares}
                onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-[#131722] border border-[#2a2e39] rounded px-2 py-1 text-center font-mono text-white text-xs"
              />
              <span className="text-[#787b86] font-mono">
                = ${(tradeShares * instrument.price).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTrade('BUY')}
              className="px-4 py-2 bg-[#089981] hover:bg-[#089981]/90 text-white rounded-lg text-xs font-bold font-mono transition-all"
            >
              BUY {tradeShares}
            </button>
            <button
              onClick={() => handleTrade('SELL')}
              className="px-4 py-2 bg-[#f23645] hover:bg-[#f23645]/90 text-white rounded-lg text-xs font-bold font-mono transition-all"
            >
              SELL {tradeShares}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
