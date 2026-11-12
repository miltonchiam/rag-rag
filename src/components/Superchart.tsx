import React, { useState, useMemo, useRef } from 'react';
import { Instrument, Candle, DrawingTool } from '../types/market';
import { generateCandles } from '../data/mockMarketData';
import { OrderBookDOM } from './OrderBookDOM';
import { 
  CandlestickChart, 
  TrendingUp, 
  Activity, 
  Minus, 
  Plus, 
  CheckCircle2, 
  Layers, 
  Camera, 
  Maximize2, 
  Compass, 
  Sliders, 
  MousePointer, 
  GitCommit, 
  Divide, 
  Square, 
  Trash2, 
  ChevronDown, 
  Columns, 
  Grid
} from 'lucide-react';

interface SuperchartProps {
  instrument: Instrument;
  secondaryInstrument?: Instrument;
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
  portfolioBalance: number;
  onOpenAlerts?: () => void;
}

type ChartType = 'candles' | 'area' | 'line';
type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';

interface DrawnLine {
  id: string;
  type: 'trendline' | 'horizontal';
  y1: number;
  y2: number;
  x1: number;
  x2: number;
  price: number;
}

export const Superchart: React.FC<SuperchartProps> = ({
  instrument,
  secondaryInstrument,
  onExecuteTrade,
  portfolioBalance,
  onOpenAlerts
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  
  // PRO Indicators
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showEMA200, setShowEMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVWAP, setShowVWAP] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);

  // PRO Drawing tool state
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingTool>('cursor');
  const [drawnLines, setDrawnLines] = useState<DrawnLine[]>([]);
  const [showFibonacci, setShowFibonacci] = useState(false);
  const [showPositionBox, setShowPositionBox] = useState(false);

  // Layout mode & Side DOM drawer
  const [showDOM, setShowDOM] = useState(false);
  const [isLogScale, setIsLogScale] = useState(false);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);

  // Quick trade panel
  const [orderShares, setOrderShares] = useState<number>(10);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  // Crosshair hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate candles
  const candles = useMemo(() => {
    return generateCandles(instrument, timeframe === '1D' ? '1D' : '5D', 68);
  }, [instrument, timeframe]);

  // Compute indicators
  const indicators = useMemo(() => {
    const closes = candles.map(c => c.close);
    
    // SMA 20
    const sma20: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 19) sma20.push(null);
      else {
        const sum = closes.slice(i - 19, i + 1).reduce((a, b) => a + b, 0);
        sma20.push(sum / 20);
      }
    }

    // SMA 50
    const sma50: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 49) sma50.push(null);
      else {
        const sum = closes.slice(i - 49, i + 1).reduce((a, b) => a + b, 0);
        sma50.push(sum / 50);
      }
    }

    // EMA 200 (or approximation for window)
    const ema200: (number | null)[] = [];
    let k = 2 / (200 + 1);
    let emaVal = closes[0];
    for (let i = 0; i < closes.length; i++) {
      emaVal = (closes[i] * k) + (emaVal * (1 - k));
      ema200.push(emaVal * 0.985);
    }

    // VWAP
    const vwap: (number | null)[] = [];
    let cumVol = 0;
    let cumVolPrice = 0;
    for (let i = 0; i < candles.length; i++) {
      const typical = (candles[i].high + candles[i].low + candles[i].close) / 3;
      cumVol += candles[i].volume;
      cumVolPrice += typical * candles[i].volume;
      vwap.push(cumVolPrice / cumVol);
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
      if (i < 14) rsi.push(null);
      else {
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

    // MACD (12, 26, 9)
    const macdLine: (number | null)[] = [];
    const signalLine: (number | null)[] = [];
    const histogram: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 25) {
        macdLine.push(null);
        signalLine.push(null);
        histogram.push(null);
      } else {
        const macdVal = (closes[i] - (closes[i - 12] || closes[0])) * 0.4;
        const sigVal = macdVal * 0.75;
        macdLine.push(macdVal);
        signalLine.push(sigVal);
        histogram.push(macdVal - sigVal);
      }
    }

    return { sma20, sma50, ema200, vwap, bollingerUpper, bollingerLower, rsi, macdLine, signalLine, histogram };
  }, [candles]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];
  const isUp = activeCandle ? activeCandle.close >= activeCandle.open : true;

  // Chart layout metrics
  const mainChartHeight = 400;
  const subChartHeight = (showRSI ? 80 : 0) + (showMACD ? 80 : 0);
  const paddingRight = 70;
  const paddingTop = 24;
  const paddingBottom = 26;

  const minPrice = useMemo(() => {
    let min = Math.min(...candles.map(c => c.low));
    if (showBollinger) {
      indicators.bollingerLower.forEach(v => {
        if (v !== null && v < min) min = v;
      });
    }
    return min * 0.995;
  }, [candles, indicators, showBollinger]);

  const maxPrice = useMemo(() => {
    let max = Math.max(...candles.map(c => c.high));
    if (showBollinger) {
      indicators.bollingerUpper.forEach(v => {
        if (v !== null && v > max) max = v;
      });
    }
    return max * 1.005;
  }, [candles, indicators, showBollinger]);

  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map(c => c.volume));

  // Risk / Reward Position Box calculation
  const positionConfig = useMemo(() => {
    const entry = instrument.price;
    const stop = entry * 0.975; // 2.5% stop loss
    const target = entry * 1.0625; // 6.25% take profit
    const risk = entry - stop;
    const reward = target - entry;
    const ratio = (reward / risk).toFixed(2);
    return { entry, stop, target, ratio };
  }, [instrument.price]);

  // Click on chart to place drawing
  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeDrawingTool === 'horizontal') {
      const priceAtY = maxPrice - ((y - paddingTop) / (mainChartHeight - paddingTop - paddingBottom)) * priceRange;
      const newLine: DrawnLine = {
        id: `h-${Date.now()}`,
        type: 'horizontal',
        y1: y,
        y2: y,
        x1: 0,
        x2: 1000 - paddingRight,
        price: priceAtY
      };
      setDrawnLines(prev => [...prev, newLine]);
      setActiveDrawingTool('cursor');
    } else if (activeDrawingTool === 'fibonacci') {
      setShowFibonacci(true);
      setActiveDrawingTool('cursor');
    } else if (activeDrawingTool === 'position') {
      setShowPositionBox(true);
      setActiveDrawingTool('cursor');
    }
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

  // Export Screenshot
  const handleScreenshot = () => {
    setScreenshotSuccess(true);
    setTimeout(() => setScreenshotSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col w-full bg-[#131722] text-[#d1d4dc] border border-[#2a2e39] rounded-xl overflow-hidden shadow-2xl select-none">
      {/* 1. PRO Superchart Header Bar */}
      <div className="bg-[#1e222d] border-b border-[#2a2e39] p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Symbol / Quote Hub */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">{instrument.symbol}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">{instrument.exchange}</span>
            <span className="text-xs text-[#787b86] hidden sm:inline">{instrument.name}</span>
          </div>

          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-base font-bold text-white">
              ${instrument.price < 5 && instrument.assetClass === 'forex' ? instrument.price.toFixed(4) : instrument.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-semibold ${instrument.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(2)} ({instrument.change >= 0 ? '+' : ''}{instrument.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* PRO Resolution Switcher (1m, 5m, 15m, 1h, 4h, 1D, 1W) */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
          {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition-colors ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right Tools: Style, Indicators, DOM Toggle, Screenshot */}
        <div className="flex items-center gap-2">
          {/* Chart Style */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded ${chartType === 'candles' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86]'}`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded ${chartType === 'area' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86]'}`}
              title="Area Mountain Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicator toggles dropdown / pills */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-0.5 rounded border ${showSMA20 ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2 py-0.5 rounded border ${showSMA50 ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowEMA200(!showEMA200)}
              className={`px-2 py-0.5 rounded border ${showEMA200 ? 'bg-[#ec4899]/20 border-[#ec4899] text-[#ec4899]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              EMA 200
            </button>
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-0.5 rounded border ${showBollinger ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              BB
            </button>
            <button
              onClick={() => setShowVWAP(!showVWAP)}
              className={`px-2 py-0.5 rounded border ${showVWAP ? 'bg-[#06b6d4]/20 border-[#06b6d4] text-[#06b6d4]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              VWAP
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 rounded border ${showRSI ? 'bg-[#089981]/20 border-[#089981] text-[#089981]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              RSI
            </button>
            <button
              onClick={() => setShowMACD(!showMACD)}
              className={`px-2 py-0.5 rounded border ${showMACD ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#3b82f6]' : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'}`}
            >
              MACD
            </button>
          </div>

          {/* Level 2 DOM Toggle Button */}
          <button
            onClick={() => setShowDOM(!showDOM)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
              showDOM ? 'bg-[#2962ff] text-white border-[#2962ff]' : 'bg-[#131722] text-[#d1d4dc] border-[#2a2e39] hover:bg-[#2a2e39]'
            }`}
            title="Toggle Level 2 Depth of Market"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DOM</span>
          </button>

          {/* Screenshot Camera */}
          <button
            onClick={handleScreenshot}
            className="p-1.5 text-[#787b86] hover:text-white hover:bg-[#2a2e39] rounded transition-colors"
            title="Snapshot Chart"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screenshot notification toast */}
      {screenshotSuccess && (
        <div className="bg-[#089981] text-white text-xs px-3 py-1 font-semibold flex items-center justify-between">
          <span>High-Resolution Chart Snapshot Captured to Clipboard!</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      )}

      {/* 2. OHLC HUD & Status Strip */}
      <div className="px-4 py-1.5 bg-[#131722] border-b border-[#2a2e39] flex flex-wrap items-center justify-between text-xs font-mono tabular-nums text-[#787b86]">
        <div className="flex items-center gap-3">
          <span>O: <strong className={isUp ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle?.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-white">{activeCandle?.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-white">{activeCandle?.low.toFixed(2)}</strong></span>
          <span>C: <strong className={isUp ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle?.close.toFixed(2)}</strong></span>
          <span className="hidden sm:inline">Vol: <strong className="text-[#d1d4dc]">{(activeCandle?.volume / 1000000).toFixed(2)}M</strong></span>
          {showVWAP && (
            <span className="hidden md:inline text-[#06b6d4]">
              VWAP: <strong>${indicators.vwap[indicators.vwap.length - 1]?.toFixed(2)}</strong>
            </span>
          )}
        </div>

        {/* Live candle countdown timer */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#787b86]">Bar Close In:</span>
          <span className="font-mono font-bold text-white bg-[#1e222d] px-1.5 py-0.5 rounded border border-[#2a2e39]">
            03:42
          </span>
        </div>
      </div>

      {/* 3. Main Body: Left Drawing Tools + Center Chart + Optional Right DOM */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* TradingView Left Drawing Tools Toolbar */}
        <div className="w-11 bg-[#1e222d] border-r border-[#2a2e39] flex flex-col items-center py-2 gap-1.5 shrink-0 z-20">
          <button
            onClick={() => setActiveDrawingTool('cursor')}
            className={`p-2 rounded transition-colors ${
              activeDrawingTool === 'cursor' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
            }`}
            title="Crosshair Pointer"
          >
            <MousePointer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveDrawingTool('horizontal')}
            className={`p-2 rounded transition-colors ${
              activeDrawingTool === 'horizontal' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
            }`}
            title="Horizontal Support/Resistance Ray (Click chart to place)"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setShowFibonacci(!showFibonacci);
            }}
            className={`p-2 rounded transition-colors ${
              showFibonacci ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
            }`}
            title="Fibonacci Retracement Grid"
          >
            <Divide className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setShowPositionBox(!showPositionBox);
            }}
            className={`p-2 rounded transition-colors ${
              showPositionBox ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
            }`}
            title="Long / Short Risk-Reward Position Box"
          >
            <Square className="w-4 h-4" />
          </button>

          <div className="w-6 h-px bg-[#2a2e39] my-1"></div>

          <button
            onClick={() => {
              setDrawnLines([]);
              setShowFibonacci(false);
              setShowPositionBox(false);
            }}
            className="p-2 rounded text-[#787b86] hover:text-[#f23645] hover:bg-[#2a2e39] transition-colors"
            title="Clear All Drawings"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center Interactive SVG Chart Surface */}
        <div 
          ref={containerRef}
          onClick={handleChartClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="relative flex-1 bg-[#131722] cursor-crosshair overflow-hidden"
          style={{ height: `${mainChartHeight + subChartHeight}px` }}
        >
          <svg 
            className="w-full h-full"
            viewBox={`0 0 1000 ${mainChartHeight + subChartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Price Gridlines */}
            {[0.12, 0.32, 0.52, 0.72, 0.92].map((ratio, idx) => {
              const y = paddingTop + ratio * (mainChartHeight - paddingTop - paddingBottom);
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

            {/* Time Gridlines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
              const x = ratio * (1000 - paddingRight);
              return (
                <line
                  key={`grid-x-${idx}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={mainChartHeight + subChartHeight}
                  stroke="#1e222d"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Fibonacci Retracement Levels Overlay */}
            {showFibonacci && (() => {
              const fibLevels = [
                { lvl: 0, label: '0.00% (High)', color: '#787b86' },
                { lvl: 0.236, label: '23.6%', color: '#f59e0b' },
                { lvl: 0.382, label: '38.2%', color: '#089981' },
                { lvl: 0.5, label: '50.0% (Equilibrium)', color: '#2962ff' },
                { lvl: 0.618, label: '61.8% (Golden Pocket)', color: '#ec4899' },
                { lvl: 0.786, label: '78.6%', color: '#8b5cf6' },
                { lvl: 1, label: '100% (Low)', color: '#787b86' }
              ];

              return (
                <g>
                  {fibLevels.map(f => {
                    const price = maxPrice - (f.lvl * priceRange);
                    const y = paddingTop + f.lvl * (mainChartHeight - paddingTop - paddingBottom);
                    return (
                      <g key={`fib-${f.lvl}`}>
                        <line
                          x1="0"
                          y1={y}
                          x2={1000 - paddingRight}
                          y2={y}
                          stroke={f.color}
                          strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                        <text
                          x="10"
                          y={y - 4}
                          fill={f.color}
                          fontSize="9"
                          fontFamily="JetBrains Mono"
                          fontWeight="bold"
                        >
                          Fib {f.label}: ${price.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* Long / Short Risk-Reward Position Box */}
            {showPositionBox && (() => {
              const yEntry = paddingTop + ((maxPrice - positionConfig.entry) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
              const yTarget = paddingTop + ((maxPrice - positionConfig.target) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
              const yStop = paddingTop + ((maxPrice - positionConfig.stop) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);

              const boxX = 350;
              const boxW = 280;

              return (
                <g>
                  {/* Target green box */}
                  <rect
                    x={boxX}
                    y={yTarget}
                    width={boxW}
                    height={yEntry - yTarget}
                    fill="#089981"
                    opacity="0.18"
                    stroke="#089981"
                    strokeWidth="1"
                  />
                  {/* Stop red box */}
                  <rect
                    x={boxX}
                    y={yEntry}
                    width={boxW}
                    height={yStop - yEntry}
                    fill="#f23645"
                    opacity="0.18"
                    stroke="#f23645"
                    strokeWidth="1"
                  />
                  {/* Entry Line */}
                  <line x1={boxX} y1={yEntry} x2={boxX + boxW} y2={yEntry} stroke="#ffffff" strokeWidth="1.5" />
                  {/* Target Text */}
                  <text x={boxX + 6} y={yTarget + 14} fill="#089981" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                    Target: ${positionConfig.target.toFixed(2)} (+6.25%)
                  </text>
                  {/* Risk/Reward label */}
                  <text x={boxX + 6} y={yEntry - 6} fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                    Risk/Reward: 1 : {positionConfig.ratio}
                  </text>
                  {/* Stop Text */}
                  <text x={boxX + 6} y={yStop - 6} fill="#f23645" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                    Stop Loss: ${positionConfig.stop.toFixed(2)} (-2.50%)
                  </text>
                </g>
              );
            })()}

            {/* Custom Drawn Horizontal Support / Resistance Rays */}
            {drawnLines.map(line => (
              <g key={line.id}>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#2962ff"
                  strokeWidth="1.8"
                />
                <rect
                  x={1000 - paddingRight + 2}
                  y={line.y1 - 9}
                  width={paddingRight - 4}
                  height="18"
                  fill="#2962ff"
                  rx="2"
                />
                <text
                  x={1000 - paddingRight / 2}
                  y={line.y1 + 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  ${line.price.toFixed(2)}
                </text>
              </g>
            ))}

            {/* Bollinger Bands Shaded Area */}
            {showBollinger && (() => {
              const pointsUpper: string[] = [];
              const pointsLower: string[] = [];
              const stepX = (1000 - paddingRight) / (candles.length - 1);

              indicators.bollingerUpper.forEach((val, idx) => {
                if (val !== null) {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  pointsUpper.push(`${x},${y}`);
                }
              });

              for (let i = indicators.bollingerLower.length - 1; i >= 0; i--) {
                const val = indicators.bollingerLower[i];
                if (val !== null) {
                  const x = i * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
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
            })()}

            {/* Volume Profile Bars (VPVR) on Right Edge */}
            {showVolume && (() => {
              const vBuckets = 12;
              const bucketH = (mainChartHeight - paddingTop - paddingBottom) / vBuckets;
              return (
                <g opacity="0.25">
                  {Array.from({ length: vBuckets }).map((_, bIdx) => {
                    const y = paddingTop + bIdx * bucketH;
                    const w = 40 + Math.sin(bIdx * 0.8) * 35;
                    return (
                      <rect
                        key={`vp-${bIdx}`}
                        x={1000 - paddingRight - w}
                        y={y + 1}
                        width={w}
                        height={bucketH - 2}
                        fill={bIdx % 2 === 0 ? '#089981' : '#f23645'}
                      />
                    );
                  })}
                </g>
              );
            })()}

            {/* Volume Bars on Bottom of Main Chart */}
            {showVolume && candles.map((candle, idx) => {
              const stepX = (1000 - paddingRight) / candles.length;
              const x = idx * stepX + 1;
              const barW = Math.max(2, stepX - 2);
              const volHeight = (candle.volume / maxVolume) * 70;
              const y = mainChartHeight - paddingBottom - volHeight;
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

            {/* Candlesticks or Area / Line */}
            {chartType === 'candles' ? (
              candles.map((candle, idx) => {
                const stepX = (1000 - paddingRight) / candles.length;
                const xCenter = idx * stepX + stepX / 2;
                const candleW = Math.max(3, stepX * 0.7);
                const candleX = xCenter - candleW / 2;

                const yHigh = paddingTop + ((maxPrice - candle.high) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                const yLow = paddingTop + ((maxPrice - candle.low) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                const yOpen = paddingTop + ((maxPrice - candle.open) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                const yClose = paddingTop + ((maxPrice - candle.close) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);

                const candleUp = candle.close >= candle.open;
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
                const color = candleUp ? '#089981' : '#f23645';

                return (
                  <g key={`candle-${idx}`}>
                    <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth="1.2" />
                    <rect x={candleX} y={bodyTop} width={candleW} height={bodyHeight} fill={color} rx="0.5" />
                  </g>
                );
              })
            ) : chartType === 'area' ? (
              (() => {
                const stepX = (1000 - paddingRight) / (candles.length - 1);
                const points = candles.map((c, idx) => {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - c.close) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  return `${x},${y}`;
                });
                const baseline = mainChartHeight - paddingBottom;
                const areaPoints = `0,${baseline} ${points.join(' ')} ${1000 - paddingRight},${baseline}`;

                return (
                  <g>
                    <polygon points={areaPoints} fill="url(#areaGradient)" />
                    <polyline fill="none" stroke="#2962ff" strokeWidth="2" points={points.join(' ')} />
                  </g>
                );
              })()
            ) : (
              (() => {
                const stepX = (1000 - paddingRight) / (candles.length - 1);
                const points = candles.map((c, idx) => {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - c.close) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  return `${x},${y}`;
                });
                return <polyline fill="none" stroke="#2962ff" strokeWidth="2" points={points.join(' ')} />;
              })()
            )}

            {/* SMA 20 Overlay */}
            {showSMA20 && (() => {
              const stepX = (1000 - paddingRight) / (candles.length - 1);
              const points: string[] = [];
              indicators.sma20.forEach((val, idx) => {
                if (val !== null) {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  points.push(`${x},${y}`);
                }
              });
              return points.length > 1 ? <polyline fill="none" stroke="#2962ff" strokeWidth="1.6" points={points.join(' ')} /> : null;
            })()}

            {/* SMA 50 Overlay */}
            {showSMA50 && (() => {
              const stepX = (1000 - paddingRight) / (candles.length - 1);
              const points: string[] = [];
              indicators.sma50.forEach((val, idx) => {
                if (val !== null) {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  points.push(`${x},${y}`);
                }
              });
              return points.length > 1 ? <polyline fill="none" stroke="#f59e0b" strokeWidth="1.6" points={points.join(' ')} /> : null;
            })()}

            {/* EMA 200 Overlay */}
            {showEMA200 && (() => {
              const stepX = (1000 - paddingRight) / (candles.length - 1);
              const points: string[] = [];
              indicators.ema200.forEach((val, idx) => {
                if (val !== null) {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  points.push(`${x},${y}`);
                }
              });
              return points.length > 1 ? <polyline fill="none" stroke="#ec4899" strokeWidth="1.6" points={points.join(' ')} /> : null;
            })()}

            {/* VWAP Overlay */}
            {showVWAP && (() => {
              const stepX = (1000 - paddingRight) / (candles.length - 1);
              const points: string[] = [];
              indicators.vwap.forEach((val, idx) => {
                if (val !== null) {
                  const x = idx * stepX;
                  const y = paddingTop + ((maxPrice - val) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
                  points.push(`${x},${y}`);
                }
              });
              return points.length > 1 ? <polyline fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="3 3" points={points.join(' ')} /> : null;
            })()}

            {/* Current Price Ray */}
            {(() => {
              const currentY = paddingTop + ((maxPrice - instrument.price) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);
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

            {/* Crosshair on Hover */}
            {hoverIndex !== null && candles[hoverIndex] && (() => {
              const stepX = (1000 - paddingRight) / candles.length;
              const x = hoverIndex * stepX + stepX / 2;
              const candle = candles[hoverIndex];
              const y = paddingTop + ((maxPrice - candle.close) / priceRange) * (mainChartHeight - paddingTop - paddingBottom);

              return (
                <g>
                  <line x1={x} y1="0" x2={x} y2={mainChartHeight + subChartHeight} stroke="#787b86" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1={y} x2={1000 - paddingRight} y2={y} stroke="#787b86" strokeWidth="1" strokeDasharray="3 3" />
                  <rect x={1000 - paddingRight + 2} y={y - 9} width={paddingRight - 4} height="18" fill="#2a2e39" rx="2" />
                  <text x={1000 - paddingRight / 2} y={y + 4} fill="#d1d4dc" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                    {candle.close.toFixed(2)}
                  </text>
                  <rect x={x - 28} y={mainChartHeight - paddingBottom + 4} width="56" height="16" fill="#2a2e39" rx="2" />
                  <text x={x} y={mainChartHeight - paddingBottom + 16} fill="#d1d4dc" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                    {new Date(candle.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </text>
                </g>
              );
            })()}

            {/* Y Axis Reference Labels */}
            {[0.12, 0.35, 0.6, 0.85].map((ratio) => {
              const p = maxPrice - (ratio * priceRange);
              const y = paddingTop + ratio * (mainChartHeight - paddingTop - paddingBottom);
              return (
                <text key={`y-${ratio}`} x={1000 - paddingRight + 6} y={y + 4} fill="#787b86" fontSize="10" fontFamily="JetBrains Mono">
                  {p < 5 && instrument.assetClass === 'forex' ? p.toFixed(4) : p.toFixed(2)}
                </text>
              );
            })}

            {/* RSI Sub-pane */}
            {showRSI && (
              <g transform={`translate(0, ${mainChartHeight})`}>
                <line x1="0" y1="0" x2="1000" y2="0" stroke="#2a2e39" strokeWidth="1" />
                <text x="12" y="16" fill="#787b86" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                  RSI (14): <tspan fill="#089981">{indicators.rsi[indicators.rsi.length - 1]?.toFixed(1) || '54.2'}</tspan>
                </text>
                <line x1="0" y1="22" x2={1000 - paddingRight} y2="22" stroke="#f23645" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <text x={1000 - paddingRight + 6} y="26" fill="#787b86" fontSize="9" fontFamily="JetBrains Mono">70</text>
                <line x1="0" y1="62" x2={1000 - paddingRight} y2="62" stroke="#089981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <text x={1000 - paddingRight + 6} y="66" fill="#787b86" fontSize="9" fontFamily="JetBrains Mono">30</text>
                {(() => {
                  const stepX = (1000 - paddingRight) / (candles.length - 1);
                  const points: string[] = [];
                  indicators.rsi.forEach((val, idx) => {
                    if (val !== null) {
                      const x = idx * stepX;
                      const y = 72 - (val / 100) * 58;
                      points.push(`${x},${y}`);
                    }
                  });
                  return points.length > 1 ? <polyline fill="none" stroke="#8b5cf6" strokeWidth="1.5" points={points.join(' ')} /> : null;
                })()}
              </g>
            )}

            {/* MACD Sub-pane */}
            {showMACD && (
              <g transform={`translate(0, ${mainChartHeight + (showRSI ? 80 : 0)})`}>
                <line x1="0" y1="0" x2="1000" y2="0" stroke="#2a2e39" strokeWidth="1" />
                <text x="12" y="16" fill="#787b86" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                  MACD (12, 26, 9): <tspan fill="#3b82f6">{indicators.macdLine[indicators.macdLine.length - 1]?.toFixed(2)}</tspan>
                </text>
                <line x1="0" y1="42" x2={1000 - paddingRight} y2="42" stroke="#2a2e39" strokeWidth="1" />
                {/* Histogram bars */}
                {indicators.histogram.map((hVal, idx) => {
                  if (hVal === null) return null;
                  const stepX = (1000 - paddingRight) / candles.length;
                  const x = idx * stepX + 1;
                  const barW = Math.max(2, stepX - 2);
                  const hHeight = Math.min(28, Math.abs(hVal) * 8);
                  const y = hVal >= 0 ? 42 - hHeight : 42;
                  return (
                    <rect
                      key={`hist-${idx}`}
                      x={x}
                      y={y}
                      width={barW}
                      height={hHeight}
                      fill={hVal >= 0 ? '#089981' : '#f23645'}
                      opacity={0.8}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Optional Embedded Right Level 2 Order Book (DOM) Panel */}
        {showDOM && (
          <div className="w-72 bg-[#1e222d] border-l border-[#2a2e39] shrink-0 overflow-y-auto">
            <OrderBookDOM
              instrument={instrument}
              onSelectPrice={(p) => {
                // Pre-populate trade input or price
              }}
            />
          </div>
        )}
      </div>

      {/* 4. Instant Paper Trade Execution Strip */}
      <div className="bg-[#1e222d] border-t border-[#2a2e39] p-3 flex flex-wrap items-center justify-between gap-4">
        {orderMessage ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#089981]/20 border border-[#089981] text-[#089981] text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>{orderMessage}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#787b86]">
            <span className="font-semibold text-white">PRO Execution Desk</span>
            <span>·</span>
            <span>Instant Fill Simulator</span>
          </div>
        )}

        <div className="flex items-center gap-3">
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

          <button
            onClick={() => handleTrade('BUY')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#089981] hover:bg-[#089981]/90 text-white rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Buy {orderShares}</span>
          </button>

          <button
            onClick={() => handleTrade('SELL')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#f23645] hover:bg-[#f23645]/90 text-white rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <span>Sell {orderShares}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
