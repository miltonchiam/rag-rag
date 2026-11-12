import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Instrument, Candle, TechnicalRating } from '../types/market';
import { generateCandles } from '../data/mockMarketData';
import { 
  CandlestickChart, 
  LineChart as LineChartIcon, 
  Activity, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  Plus, 
  Minus,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface SuperchartProps {
  instrument: Instrument;
  onOpenTradeModal?: (type: 'BUY' | 'SELL') => void;
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
  portfolioBalance: number;
}

type ChartType = 'candles' | 'area' | 'line';
type Timeframe = '1D' | '5D' | '1M' | '3M' | '1Y' | '5Y';

export const Superchart: React.FC<SuperchartProps> = ({
  instrument,
  onExecuteTrade,
  portfolioBalance
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  
  // Indicators toggles
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(true);

  // Quick trade panel
  const [orderShares, setOrderShares] = useState<number>(10);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  // Mouse hover state for crosshair & OHLC HUD
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate candle data based on current instrument and timeframe
  const candles = useMemo(() => {
    return generateCandles(instrument, timeframe, 64);
  }, [instrument, timeframe]);

  // Calculate technical indicators
  const indicators = useMemo(() => {
    const closes = candles.map(c => c.close);
    
    // SMA 20
    const sma20: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 19) {
        sma20.push(null);
      } else {
        const sum = closes.slice(i - 19, i + 1).reduce((a, b) => a + b, 0);
        sma20.push(sum / 20);
      }
    }

    // SMA 50
    const sma50: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 49) {
        sma50.push(null);
      } else {
        const sum = closes.slice(i - 49, i + 1).reduce((a, b) => a + b, 0);
        sma50.push(sum / 50);
      }
    }

    // Bollinger Bands (20 periods, 2 std dev)
    const bollingerUpper: (number | null)[] = [];
    const bollingerLower: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 19) {
        bollingerUpper.push(null);
        bollingerLower.push(null);
      } else {
        const slice = closes.slice(i - 19, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / 20;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        bollingerUpper.push(mean + (stdDev * 2));
        bollingerLower.push(mean - (stdDev * 2));
      }
    }

    // RSI (14 period)
    const rsi: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 14) {
        rsi.push(null);
      } else {
        let gains = 0;
        let losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = closes[j] - closes[j - 1];
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14 || 0.0001;
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }

    return { sma20, sma50, bollingerUpper, bollingerLower, rsi };
  }, [candles]);

  // Displayed candle for HUD (either hovered or the latest candle)
  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];
  const isUp = activeCandle ? activeCandle.close >= activeCandle.open : true;

  // Chart coordinate calculations
  const chartHeight = 380;
  const rsiHeight = showRSI ? 100 : 0;
  const paddingRight = 65; // For Y-axis labels
  const paddingBottom = 26; // For X-axis labels
  const paddingTop = 20;

  // Find min and max price across candles + indicators
  const minPrice = useMemo(() => {
    let min = Math.min(...candles.map(c => c.low));
    if (showBollinger) {
      indicators.bollingerLower.forEach(v => {
        if (v !== null && v < min) min = v;
      });
    }
    return min * 0.996;
  }, [candles, indicators, showBollinger]);

  const maxPrice = useMemo(() => {
    let max = Math.max(...candles.map(c => c.high));
    if (showBollinger) {
      indicators.bollingerUpper.forEach(v => {
        if (v !== null && v > max) max = v;
      });
    }
    return max * 1.004;
  }, [candles, indicators, showBollinger]);

  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map(c => c.volume));

  // Quick trade action handler
  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (orderShares <= 0) return;
    const totalCost = orderShares * instrument.price;
    if (type === 'BUY' && totalCost > portfolioBalance) {
      setOrderMessage(`Insufficient sim balance: requires $${totalCost.toFixed(2)}`);
      setTimeout(() => setOrderMessage(null), 3500);
      return;
    }
    onExecuteTrade(instrument.symbol, type, orderShares, instrument.price);
    setOrderMessage(`Executed ${type} ${orderShares} ${instrument.symbol} @ $${instrument.price.toFixed(2)}`);
    setTimeout(() => setOrderMessage(null), 3500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const chartWidth = rect.width - paddingRight;
    if (x >= 0 && x <= chartWidth) {
      const idx = Math.min(
        candles.length - 1,
        Math.max(0, Math.floor((x / chartWidth) * candles.length))
      );
      setHoverIndex(idx);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="flex flex-col w-full bg-[#131722] text-[#d1d4dc] border border-[#2a2e39] rounded-lg overflow-hidden select-none shadow-xl">
      {/* 1. Superchart Header Controls */}
      <div className="bg-[#1e222d] border-b border-[#2a2e39] p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Symbol & Exchange Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">{instrument.symbol}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">{instrument.exchange}</span>
            <span className="text-xs text-[#787b86] hidden sm:inline">{instrument.name}</span>
          </div>

          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-base font-bold text-white">
              {instrument.price < 5 && instrument.assetClass === 'forex' ? instrument.price.toFixed(4) : instrument.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-semibold flex items-center ${instrument.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(2)} ({instrument.change >= 0 ? '+' : ''}{instrument.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Center: Timeframe Selectors */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
          {(['1D', '5D', '1M', '3M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Chart Type & Technical Indicator Toggles */}
        <div className="flex items-center gap-2">
          {/* Chart Types */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'candles' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'area' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
              title="Area Mountain Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'line' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
              title="Line Chart"
            >
              <LineChartIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicator Quick Toggles */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSMA20 ? 'bg-[#2962ff]/15 border-[#2962ff] text-[#2962ff]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSMA50 ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-[#f59e0b]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
              }`}
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-1 rounded border transition-colors ${
                showBollinger ? 'bg-[#8b5cf6]/15 border-[#8b5cf6] text-[#8b5cf6]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
              }`}
            >
              BB
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded border transition-colors ${
                showRSI ? 'bg-[#089981]/15 border-[#089981] text-[#089981]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
              }`}
            >
              RSI
            </button>
          </div>
        </div>
      </div>

      {/* 2. OHLC Dynamic HUD Bar */}
      <div className="px-4 py-2 bg-[#131722] border-b border-[#2a2e39] flex flex-wrap items-center justify-between text-xs font-mono tabular-nums text-[#787b86]">
        <div className="flex items-center gap-4">
          <span>
            O: <strong className={isUp ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle?.open.toFixed(2)}</strong>
          </span>
          <span>
            H: <strong className="text-white">{activeCandle?.high.toFixed(2)}</strong>
          </span>
          <span>
            L: <strong className="text-white">{activeCandle?.low.toFixed(2)}</strong>
          </span>
          <span>
            C: <strong className={isUp ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle?.close.toFixed(2)}</strong>
          </span>
          <span className="hidden md:inline">
            Vol: <strong className="text-[#d1d4dc]">{(activeCandle?.volume / 1000000).toFixed(2)}M</strong>
          </span>
          <span className="hidden lg:inline text-[#787b86]">
            {new Date(activeCandle?.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Technical Gauge Summary pill */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#787b86]">Rating:</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-sans ${
            instrument.technicalRating.includes('Buy')
              ? 'bg-[#089981]/15 text-[#089981] border border-[#089981]/30'
              : instrument.technicalRating.includes('Sell')
              ? 'bg-[#f23645]/15 text-[#f23645] border border-[#f23645]/30'
              : 'bg-[#787b86]/15 text-[#d1d4dc] border border-[#787b86]/30'
          }`}>
            {instrument.technicalRating}
          </span>
        </div>
      </div>

      {/* 3. Main Chart Canvas Viewport */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full bg-[#131722] cursor-crosshair overflow-hidden"
        style={{ height: `${chartHeight + rsiHeight}px` }}
      >
        <svg 
          className="w-full h-full"
          viewBox={`0 0 1000 ${chartHeight + rsiHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
            </linearGradient>

            {/* Bollinger Band gradient */}
            <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Grid lines: Horizontal price grid */}
          {[0.15, 0.35, 0.55, 0.75, 0.95].map((ratio, idx) => {
            const y = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
            return (
              <line
                key={`grid-y-${idx}`}
                x1="0"
                y1={y}
                x2={1000 - paddingRight}
                y2={y}
                stroke="#1e222d"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Grid lines: Vertical time grid */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
            const x = ratio * (1000 - paddingRight);
            return (
              <line
                key={`grid-x-${idx}`}
                x1={x}
                y1="0"
                x2={x}
                y2={chartHeight + rsiHeight}
                stroke="#1e222d"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Bollinger Bands Shaded Area */}
          {showBollinger && (
            (() => {
              const pointsUpper: string[] = [];
              const pointsLower: string[] = [];
              const stepX = (1000 - paddingRight) / (candles.length - 1);

              indicators.bollingerUpper.forEach((val, idx) => {
                if (val !== null) {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (chartHeight - paddingTop - paddingBottom);
                  pointsUpper.push(`${x},${y}`);
                }
              });

              for (let i = indicators.bollingerLower.length - 1; i >= 0; i--) {
                const val = indicators.bollingerLower[i];
                if (val !== null) {
                  const x = i * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (chartHeight - paddingTop - paddingBottom);
                  pointsLower.push(`${x},${y}`);
                }
              }

              if (pointsUpper.length > 0 && pointsLower.length > 0) {
                return (
                  <polygon
                    points={`${pointsUpper.join(' ')} ${pointsLower.join(' ')}`}
                    fill="url(#bbGradient)"
                    stroke="none"
                  />
                );
              }
              return null;
            })()
          )}

          {/* Volume bars on lower section of main chart */}
          {showVolume && candles.map((candle, idx) => {
            const stepX = (1000 - paddingRight) / candles.length;
            const x = idx * stepX + 1;
            const barW = Math.max(2, stepX - 2);
            const volHeight = (candle.volume / maxVolume) * 75; // max 75px
            const y = chartHeight - paddingBottom - volHeight;
            const candleUp = candle.close >= candle.open;

            return (
              <rect
                key={`vol-${idx}`}
                x={x}
                y={y}
                width={barW}
                height={volHeight}
                fill={candleUp ? '#089981' : '#f23645'}
                opacity={0.3}
              />
            );
          })}

          {/* Candlesticks or Area / Line rendering */}
          {chartType === 'candles' ? (
            candles.map((candle, idx) => {
              const stepX = (1000 - paddingRight) / candles.length;
              const xCenter = idx * stepX + stepX / 2;
              const candleW = Math.max(3, stepX * 0.7);
              const candleX = xCenter - candleW / 2;

              const yHigh = paddingTop + ((maxPrice - candle.high) / priceRange) * (chartHeight - paddingTop - paddingBottom);
              const yLow = paddingTop + ((maxPrice - candle.low) / priceRange) * (chartHeight - paddingTop - paddingBottom);
              const yOpen = paddingTop + ((maxPrice - candle.open) / priceRange) * (chartHeight - paddingTop - paddingBottom);
              const yClose = paddingTop + ((maxPrice - candle.close) / priceRange) * (chartHeight - paddingTop - paddingBottom);

              const candleUp = candle.close >= candle.open;
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
              const color = candleUp ? '#089981' : '#f23645';

              return (
                <g key={`candle-${idx}`}>
                  {/* High - Low Wick */}
                  <line
                    x1={xCenter}
                    y1={yHigh}
                    x2={xCenter}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={candleX}
                    y={bodyTop}
                    width={candleW}
                    height={bodyHeight}
                    fill={color}
                    rx="0.5"
                  />
                </g>
              );
            })
          ) : chartType === 'area' ? (
            (() => {
              const stepX = (1000 - paddingRight) / (candles.length - 1);
              const points = candles.map((c, idx) => {
                const x = idx * stepX;
                const y = paddingTop + ((maxPrice - c.close) / priceRange) * (chartHeight - paddingTop - paddingBottom);
                return `${x},${y}`;
              });
              const baseline = chartHeight - paddingBottom;
              const areaPoints = `0,${baseline} ${points.join(' ')} ${1000 - paddingRight},${baseline}`;

              return (
                <g>
                  <polygon points={areaPoints} fill="url(#areaGradient)" />
                  <polyline
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="2"
                    points={points.join(' ')}
                  />
                </g>
              );
            })()
          ) : (
            (() => {
              const stepX = (1000 - paddingRight) / (candles.length - 1);
              const points = candles.map((c, idx) => {
                const x = idx * stepX;
                const y = paddingTop + ((maxPrice - c.close) / priceRange) * (chartHeight - paddingTop - paddingBottom);
                return `${x},${y}`;
              });

              return (
                <polyline
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="2"
                  points={points.join(' ')}
                />
              );
            })()
          )}

          {/* SMA 20 Overlay Line */}
          {showSMA20 && (() => {
            const stepX = (1000 - paddingRight) / (candles.length - 1);
            const points: string[] = [];
            indicators.sma20.forEach((val, idx) => {
              if (val !== null) {
                const x = idx * stepX;
                const y = paddingTop + ((maxPrice - val) / priceRange) * (chartHeight - paddingTop - paddingBottom);
                points.push(`${x},${y}`);
              }
            });
            if (points.length > 1) {
              return (
                <polyline
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="1.6"
                  points={points.join(' ')}
                />
              );
            }
            return null;
          })()}

          {/* SMA 50 Overlay Line */}
          {showSMA50 && (() => {
            const stepX = (1000 - paddingRight) / (candles.length - 1);
            const points: string[] = [];
            indicators.sma50.forEach((val, idx) => {
              if (val !== null) {
                const x = idx * stepX;
                const y = paddingTop + ((maxPrice - val) / priceRange) * (chartHeight - paddingTop - paddingBottom);
                points.push(`${x},${y}`);
              }
            });
            if (points.length > 1) {
              return (
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.6"
                  points={points.join(' ')}
                />
              );
            }
            return null;
          })()}

          {/* Current Price Horizontal Ray */}
          {(() => {
            const currentY = paddingTop + ((maxPrice - instrument.price) / priceRange) * (chartHeight - paddingTop - paddingBottom);
            return (
              <g>
                <line
                  x1="0"
                  y1={currentY}
                  x2={1000 - paddingRight}
                  y2={currentY}
                  stroke={instrument.change >= 0 ? '#089981' : '#f23645'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                {/* Price tag on right Y axis */}
                <rect
                  x={1000 - paddingRight + 2}
                  y={currentY - 10}
                  width={paddingRight - 4}
                  height="20"
                  fill={instrument.change >= 0 ? '#089981' : '#f23645'}
                  rx="3"
                />
                <text
                  x={1000 - paddingRight / 2}
                  y={currentY + 4}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {instrument.price < 5 && instrument.assetClass === 'forex' ? instrument.price.toFixed(4) : instrument.price.toFixed(2)}
                </text>
              </g>
            );
          })()}

          {/* Interactive Hover Crosshair */}
          {hoverIndex !== null && candles[hoverIndex] && (() => {
            const stepX = (1000 - paddingRight) / candles.length;
            const x = hoverIndex * stepX + stepX / 2;
            const candle = candles[hoverIndex];
            const y = paddingTop + ((maxPrice - candle.close) / priceRange) * (chartHeight - paddingTop - paddingBottom);

            return (
              <g>
                {/* Vertical Crosshair Line */}
                <line
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={chartHeight + rsiHeight}
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Horizontal Crosshair Line */}
                <line
                  x1="0"
                  y1={y}
                  x2={1000 - paddingRight}
                  y2={y}
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Hovered Price Tag on Y Axis */}
                <rect
                  x={1000 - paddingRight + 2}
                  y={y - 9}
                  width={paddingRight - 4}
                  height="18"
                  fill="#2a2e39"
                  rx="2"
                />
                <text
                  x={1000 - paddingRight / 2}
                  y={y + 4}
                  fill="#d1d4dc"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {candle.close.toFixed(2)}
                </text>
                {/* Hovered Time Tag on X Axis */}
                <rect
                  x={x - 28}
                  y={chartHeight - paddingBottom + 4}
                  width="56"
                  height="16"
                  fill="#2a2e39"
                  rx="2"
                />
                <text
                  x={x}
                  y={chartHeight - paddingBottom + 16}
                  fill="#d1d4dc"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {new Date(candle.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </text>
              </g>
            );
          })()}

          {/* Y Axis Reference Labels */}
          {[0.1, 0.35, 0.6, 0.85].map((ratio) => {
            const p = maxPrice - (ratio * priceRange);
            const y = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
            return (
              <text
                key={`y-lbl-${ratio}`}
                x={1000 - paddingRight + 6}
                y={y + 4}
                fill="#787b86"
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                {p < 5 && instrument.assetClass === 'forex' ? p.toFixed(4) : p.toFixed(2)}
              </text>
            );
          })}

          {/* RSI Sub-Chart (if enabled) */}
          {showRSI && (
            <g transform={`translate(0, ${chartHeight})`}>
              {/* Divider between main and RSI */}
              <line x1="0" y1="0" x2="1000" y2="0" stroke="#2a2e39" strokeWidth="1" />
              
              {/* RSI Label & Overbought/Oversold boundaries */}
              <text x="12" y="18" fill="#787b86" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                RSI (14): <tspan fill="#089981">{indicators.rsi[indicators.rsi.length - 1]?.toFixed(1) || '54.2'}</tspan>
              </text>

              {/* 70 Level (Overbought) */}
              <line x1="0" y1="28" x2={1000 - paddingRight} y2="28" stroke="#f23645" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <text x={1000 - paddingRight + 6} y="32" fill="#787b86" fontSize="9" fontFamily="JetBrains Mono">70</text>

              {/* 50 Level (Midline) */}
              <line x1="0" y1="52" x2={1000 - paddingRight} y2="52" stroke="#2a2e39" strokeWidth="1" strokeDasharray="2 2" />
              <text x={1000 - paddingRight + 6} y="55" fill="#787b86" fontSize="9" fontFamily="JetBrains Mono">50</text>

              {/* 30 Level (Oversold) */}
              <line x1="0" y1="76" x2={1000 - paddingRight} y2="76" stroke="#089981" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <text x={1000 - paddingRight + 6} y="79" fill="#787b86" fontSize="9" fontFamily="JetBrains Mono">30</text>

              {/* RSI Curve */}
              {(() => {
                const stepX = (1000 - paddingRight) / (candles.length - 1);
                const points: string[] = [];
                indicators.rsi.forEach((val, idx) => {
                  if (val !== null) {
                    const x = idx * stepX;
                    // Map 0-100 to y 88-16
                    const y = 88 - (val / 100) * 72;
                    points.push(`${x},${y}`);
                  }
                });

                if (points.length > 1) {
                  return (
                    <polyline
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      points={points.join(' ')}
                    />
                  );
                }
                return null;
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* 4. Instant Paper Trading Execution Panel */}
      <div className="bg-[#1e222d] border-t border-[#2a2e39] p-3 flex flex-wrap items-center justify-between gap-4">
        {/* Order execution status banner */}
        {orderMessage ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#089981]/20 border border-[#089981] text-[#089981] text-xs font-medium animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{orderMessage}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#787b86]">
            <span className="font-semibold text-white">Paper Trading Simulator</span>
            <span>·</span>
            <span>Live Fill Execution</span>
          </div>
        )}

        {/* Trade Controls */}
        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#131722] border border-[#2a2e39] rounded-lg p-0.5">
            <button
              onClick={() => setOrderShares(Math.max(1, orderShares - 5))}
              className="p-1.5 text-[#787b86] hover:text-white"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min="1"
              value={orderShares}
              onChange={(e) => setOrderShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 bg-transparent text-center font-mono text-xs font-bold text-white focus:outline-none"
            />
            <button
              onClick={() => setOrderShares(orderShares + 5)}
              className="p-1.5 text-[#787b86] hover:text-white"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-xs font-mono text-[#787b86] hidden sm:inline">
            Total: ${(orderShares * instrument.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {/* Quick Buy Button */}
          <button
            onClick={() => handleTrade('BUY')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#089981] hover:bg-[#089981]/90 text-white rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Buy {orderShares}</span>
          </button>

          {/* Quick Sell Button */}
          <button
            onClick={() => handleTrade('SELL')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#f23645] hover:bg-[#f23645]/90 text-white rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Sell {orderShares}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
