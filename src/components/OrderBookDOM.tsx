import React, { useState, useEffect } from 'react';
import { Instrument, OrderBook, TimeAndSale } from '../types/market';
import { generateOrderBook, generateTimeAndSales } from '../data/mockMarketData';
import { Layers, Activity, Clock, Zap, ArrowDown, ArrowUp } from 'lucide-react';

interface OrderBookDOMProps {
  instrument: Instrument;
  onSelectPrice?: (price: number) => void;
}

export const OrderBookDOM: React.FC<OrderBookDOMProps> = ({ instrument, onSelectPrice }) => {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'tape' | 'depth'>('orderbook');
  const [orderBook, setOrderBook] = useState<OrderBook>(() => generateOrderBook(instrument));
  const [tape, setTape] = useState<TimeAndSale[]>(() => generateTimeAndSales(instrument));

  // Periodically refresh orderbook & tape to simulate real-time liquidity changes
  useEffect(() => {
    setOrderBook(generateOrderBook(instrument));
    setTape(generateTimeAndSales(instrument));

    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(instrument));
      // Prepend a new live tape print
      const isBuy = Math.random() > 0.48;
      const tick = instrument.price < 5 ? 0.0001 : 0.02;
      const delta = (Math.random() - 0.5) * tick;
      const price = Number((instrument.price + delta).toFixed(instrument.price < 5 ? 4 : 2));
      const size = instrument.assetClass === 'crypto'
        ? Number((0.08 + Math.random() * 1.5).toFixed(3))
        : Math.floor(15 + Math.random() * 500);

      const newPrint: TimeAndSale = {
        id: `print-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price,
        size,
        side: isBuy ? 'BUY' : 'SELL'
      };

      setTape(prev => [newPrint, ...prev.slice(0, 19)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [instrument]);

  const maxBidTotal = orderBook.bids[orderBook.bids.length - 1]?.total || 1;
  const maxAskTotal = orderBook.asks[orderBook.asks.length - 1]?.total || 1;
  const maxDepth = Math.max(maxBidTotal, maxAskTotal);

  return (
    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-hidden flex flex-col shadow-sm select-none">
      {/* 1. Header & Tab Switcher */}
      <div className="bg-[#181c27] p-2.5 border-b border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Layers className="w-3.5 h-3.5 text-[#2962ff]" />
          <span>Depth of Market (DOM)</span>
        </div>

        <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39] text-[11px]">
          <button
            onClick={() => setActiveTab('orderbook')}
            className={`px-2 py-0.5 font-medium rounded transition-colors ${
              activeTab === 'orderbook' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            L2 Book
          </button>
          <button
            onClick={() => setActiveTab('tape')}
            className={`px-2 py-0.5 font-medium rounded transition-colors ${
              activeTab === 'tape' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            Time & Sales
          </button>
          <button
            onClick={() => setActiveTab('depth')}
            className={`px-2 py-0.5 font-medium rounded transition-colors ${
              activeTab === 'depth' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            Depth Chart
          </button>
        </div>
      </div>

      {/* 2. Order Book View */}
      {activeTab === 'orderbook' && (
        <div className="flex flex-col text-xs font-mono tabular-nums">
          {/* Table Headers */}
          <div className="grid grid-cols-3 px-3 py-1.5 text-[#787b86] border-b border-[#2a2e39] text-[11px]">
            <span>Price ({instrument.currency})</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total Depth</span>
          </div>

          {/* Asks (Sells) - Inverted so lowest ask is closest to spread */}
          <div className="flex flex-col-reverse divide-y divide-[#2a2e39]/30">
            {orderBook.asks.slice(0, 7).map((ask, idx) => {
              const depthPct = (ask.total / maxDepth) * 100;
              return (
                <div
                  key={`ask-${idx}`}
                  onClick={() => onSelectPrice?.(ask.price)}
                  className="relative grid grid-cols-3 px-3 py-1 hover:bg-[#2a2e39]/40 cursor-pointer transition-colors"
                >
                  {/* Red Depth bar fill */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-[#f23645]/15 pointer-events-none"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-[#f23645] font-semibold z-10">{ask.price.toFixed(instrument.price < 5 ? 4 : 2)}</span>
                  <span className="text-right text-[#d1d4dc] z-10">{ask.size.toLocaleString()}</span>
                  <span className="text-right text-[#787b86] z-10">{ask.total.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Spread Bar */}
          <div className="px-3 py-1.5 bg-[#131722] border-y border-[#2a2e39] flex items-center justify-between text-[11px] font-sans">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-mono text-white">
                ${instrument.price < 5 ? instrument.price.toFixed(4) : instrument.price.toFixed(2)}
              </span>
              <span className={`text-[10px] font-mono ${instrument.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {instrument.change >= 0 ? '▲' : '▼'} {Math.abs(instrument.change).toFixed(2)}
              </span>
            </div>
            <div className="text-[#787b86] text-[10px] font-mono">
              Spread: <span className="text-white">{orderBook.spread.toFixed(instrument.price < 5 ? 4 : 2)}</span> ({orderBook.spreadPercent}%)
            </div>
          </div>

          {/* Bids (Buys) */}
          <div className="flex flex-col divide-y divide-[#2a2e39]/30">
            {orderBook.bids.slice(0, 7).map((bid, idx) => {
              const depthPct = (bid.total / maxDepth) * 100;
              return (
                <div
                  key={`bid-${idx}`}
                  onClick={() => onSelectPrice?.(bid.price)}
                  className="relative grid grid-cols-3 px-3 py-1 hover:bg-[#2a2e39]/40 cursor-pointer transition-colors"
                >
                  {/* Green Depth bar fill */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 pointer-events-none"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-[#089981] font-semibold z-10">{bid.price.toFixed(instrument.price < 5 ? 4 : 2)}</span>
                  <span className="text-right text-[#d1d4dc] z-10">{bid.size.toLocaleString()}</span>
                  <span className="text-right text-[#787b86] z-10">{bid.total.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Time & Sales Tape View */}
      {activeTab === 'tape' && (
        <div className="flex flex-col text-xs font-mono tabular-nums">
          <div className="grid grid-cols-3 px-3 py-1.5 text-[#787b86] border-b border-[#2a2e39] text-[11px]">
            <span>Time</span>
            <span className="text-right">Price</span>
            <span className="text-right">Size</span>
          </div>

          <div className="max-h-[300px] overflow-y-auto divide-y divide-[#2a2e39]/30">
            {tape.map(print => (
              <div key={print.id} className="grid grid-cols-3 px-3 py-1.5 hover:bg-[#131722]">
                <span className="text-[#787b86] text-[11px]">{print.time}</span>
                <span className={`text-right font-semibold ${print.side === 'BUY' ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {print.price.toFixed(instrument.price < 5 ? 4 : 2)}
                </span>
                <span className="text-right text-white">
                  {typeof print.size === 'number' ? print.size.toLocaleString() : print.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Visual Cumulative Depth Chart */}
      {activeTab === 'depth' && (
        <div className="p-3 flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-mono text-[#787b86]">
            <span className="text-[#089981]">Bids: {maxBidTotal.toLocaleString()}</span>
            <span className="text-[#f23645]">Asks: {maxAskTotal.toLocaleString()}</span>
          </div>

          <div className="w-full h-36 bg-[#131722] rounded border border-[#2a2e39] p-2 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#089981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f23645" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f23645" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Bids curve */}
              <polygon
                points="0,100 0,20 40,35 70,55 98,90 98,100"
                fill="url(#bidGrad)"
              />
              <polyline
                points="0,20 40,35 70,55 98,90"
                fill="none"
                stroke="#089981"
                strokeWidth="2"
              />

              {/* Asks curve */}
              <polygon
                points="102,100 102,90 130,55 160,35 200,15 200,100"
                fill="url(#askGrad)"
              />
              <polyline
                points="102,90 130,55 160,35 200,15"
                fill="none"
                stroke="#f23645"
                strokeWidth="2"
              />

              {/* Center divider */}
              <line x1="100" y1="0" x2="100" y2="100" stroke="#2a2e39" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-[#787b86] font-mono px-1">
            <span>-${(orderBook.spread * 5).toFixed(2)}</span>
            <span className="text-white">${instrument.price.toFixed(2)}</span>
            <span>+${(orderBook.spread * 5).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
