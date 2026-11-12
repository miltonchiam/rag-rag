import React, { useState, useEffect } from 'react';
import { INITIAL_INSTRUMENTS } from './data/mockMarketData';
import { Instrument, PaperTradePosition, MarketAlert } from './types/market';
import { Header, ActiveTab } from './components/Header';
import { GlobalTickerBar } from './components/GlobalTickerBar';
import { OverviewView } from './components/OverviewView';
import { Superchart } from './components/Superchart';
import { HeatmapView } from './components/HeatmapView';
import { ScreenerView } from './components/ScreenerView';
import { NewsView } from './components/NewsView';
import { EconomicCalendarView } from './components/EconomicCalendarView';
import { PortfolioView } from './components/PortfolioView';
import { AssetDetailModal } from './components/AssetDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AlertsModal } from './components/AlertsModal';

export default function App() {
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(INITIAL_INSTRUMENTS[0]);
  const [modalInstrument, setModalInstrument] = useState<Instrument | null>(null);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>(['SPX', 'NVDA', 'BTC/USD', 'TSLA', 'AAPL', 'ETH/USD']);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // PRO Price Alerts
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState<MarketAlert[]>([
    {
      id: 'alert-1',
      symbol: 'NVDA',
      targetPrice: 150.00,
      condition: 'ABOVE',
      createdAt: Date.now() - 3600000,
      triggered: false
    },
    {
      id: 'alert-2',
      symbol: 'BTC/USD',
      targetPrice: 90000.00,
      condition: 'ABOVE',
      createdAt: Date.now() - 7200000,
      triggered: false
    }
  ]);

  // Paper Trading Portfolio State
  const [cashBalance, setCashBalance] = useState<number>(100000);
  const [positions, setPositions] = useState<PaperTradePosition[]>([
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 50,
      averageEntry: 142.35,
      currentPrice: 147.20,
      type: 'BUY',
      openedAt: Date.now() - 86400000
    },
    {
      symbol: 'BTC/USD',
      name: 'Bitcoin',
      shares: 0.5,
      averageEntry: 85970,
      currentPrice: 88420,
      type: 'BUY',
      openedAt: Date.now() - 43200000
    }
  ]);

  // Dark Mode
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global Keyboard shortcuts: Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live real-time market quote simulator (subtle ticks every 3.2s)
  useEffect(() => {
    const interval = setInterval(() => {
      setInstruments(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const item = prev[randomIndex];
        const pctDelta = (Math.random() - 0.49) * 0.003;
        const newPrice = item.price * (1 + pctDelta);
        const newChange = newPrice - item.previousClose;
        const newChangePct = (newChange / item.previousClose) * 100;

        const updated = [...prev];
        const updatedItem = {
          ...item,
          price: Number(newPrice.toFixed(item.price < 5 ? 4 : 2)),
          change: Number(newChange.toFixed(item.price < 5 ? 4 : 2)),
          changePercent: Number(newChangePct.toFixed(2)),
          high: Math.max(item.high, newPrice),
          low: Math.min(item.low, newPrice)
        };
        updated[randomIndex] = updatedItem;

        // Check if any alerts triggered
        setAlerts(curAlerts => curAlerts.map(a => {
          if (a.symbol === item.symbol && !a.triggered) {
            if (a.condition === 'ABOVE' && newPrice >= a.targetPrice) {
              return { ...a, triggered: true };
            }
            if (a.condition === 'BELOW' && newPrice <= a.targetPrice) {
              return { ...a, triggered: true };
            }
          }
          return a;
        }));

        if (selectedInstrument && selectedInstrument.id === item.id) {
          setSelectedInstrument(updatedItem);
        }

        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [selectedInstrument]);

  // Watchlist Toggle
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  // Open Full Superchart
  const handleOpenSuperchart = (inst: Instrument) => {
    setSelectedInstrument(inst);
    setActiveTab('superchart');
  };

  // Alert Actions
  const handleAddAlert = (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert: MarketAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: Date.now(),
      triggered: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Trade Execution
  const handleExecuteTrade = (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => {
    const totalCost = shares * price;
    if (type === 'BUY') {
      if (cashBalance < totalCost) return;
      setCashBalance(prev => prev - totalCost);

      setPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol && p.type === 'BUY');
        if (existing) {
          const totalShares = existing.shares + shares;
          const avgEntry = ((existing.shares * existing.averageEntry) + totalCost) / totalShares;
          return prev.map(p => p.symbol === symbol ? { ...p, shares: totalShares, averageEntry: avgEntry } : p);
        } else {
          const inst = instruments.find(i => i.symbol === symbol);
          return [
            ...prev,
            {
              symbol,
              name: inst ? inst.name : symbol,
              shares,
              averageEntry: price,
              currentPrice: price,
              type: 'BUY',
              openedAt: Date.now()
            }
          ];
        }
      });
    } else {
      // SELL
      setCashBalance(prev => prev + totalCost);
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing && existing.type === 'BUY') {
          if (existing.shares <= shares) {
            return prev.filter(p => p.symbol !== symbol);
          } else {
            return prev.map(p => p.symbol === symbol ? { ...p, shares: p.shares - shares } : p);
          }
        }
        return prev;
      });
    }
  };

  // Close Position
  const handleClosePosition = (symbol: string) => {
    const pos = positions.find(p => p.symbol === symbol);
    if (!pos) return;
    const inst = instruments.find(i => i.symbol === symbol);
    const currentPrice = inst ? inst.price : pos.averageEntry;
    const proceed = pos.shares * currentPrice;

    setCashBalance(prev => prev + proceed);
    setPositions(prev => prev.filter(p => p.symbol !== symbol));
  };

  // Reset Portfolio
  const handleResetPortfolio = () => {
    setCashBalance(100000);
    setPositions([]);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-[#131722] text-[#d1d4dc]' : 'bg-[#f0f3fa] text-[#131722]'}`}>
      {/* 1. TradingView PRO Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        onToggleWatchlist={() => setIsWatchlistOpen(true)}
        portfolioBalance={cashBalance}
        alertCount={alerts.filter(a => a.triggered).length}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      {/* 2. Global Benchmarks Ribbon (S&P 500, Nasdaq, BTC, Gold, Oil, Bonds) */}
      <GlobalTickerBar
        instruments={instruments}
        onSelectInstrument={(inst) => {
          setSelectedInstrument(inst);
          setModalInstrument(inst);
        }}
        selectedSymbol={selectedInstrument.symbol}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {activeTab === 'overview' && (
          <OverviewView
            instruments={instruments}
            onSelectInstrument={(inst) => setModalInstrument(inst)}
            onOpenSuperchart={handleOpenSuperchart}
            onToggleWatchlist={handleToggleWatchlist}
            watchlist={watchlist}
          />
        )}

        {activeTab === 'superchart' && (
          <div className="w-full flex flex-col gap-4">
            <Superchart
              instrument={selectedInstrument}
              onExecuteTrade={handleExecuteTrade}
              portfolioBalance={cashBalance}
              onOpenAlerts={() => setIsAlertsOpen(true)}
            />
          </div>
        )}

        {activeTab === 'heatmap' && (
          <HeatmapView
            instruments={instruments}
            onSelectInstrument={(inst) => setModalInstrument(inst)}
            onOpenSuperchart={handleOpenSuperchart}
          />
        )}

        {activeTab === 'screener' && (
          <ScreenerView
            instruments={instruments}
            onSelectInstrument={(inst) => setModalInstrument(inst)}
            onOpenSuperchart={handleOpenSuperchart}
            onToggleWatchlist={handleToggleWatchlist}
            watchlist={watchlist}
          />
        )}

        {activeTab === 'calendar' && (
          <EconomicCalendarView />
        )}

        {activeTab === 'news' && (
          <NewsView
            onSelectSymbol={(sym) => {
              const match = instruments.find(i => i.symbol === sym);
              if (match) setModalInstrument(match);
            }}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView
            cashBalance={cashBalance}
            positions={positions}
            instruments={instruments}
            onClosePosition={handleClosePosition}
            onResetPortfolio={handleResetPortfolio}
            onOpenSuperchart={(sym) => {
              const match = instruments.find(i => i.symbol === sym);
              if (match) handleOpenSuperchart(match);
            }}
          />
        )}
      </main>

      {/* 4. Asset Detail Modal / Drawer */}
      <AssetDetailModal
        instrument={modalInstrument}
        onClose={() => setModalInstrument(null)}
        onOpenSuperchart={handleOpenSuperchart}
        onToggleWatchlist={handleToggleWatchlist}
        isWatchlisted={modalInstrument ? watchlist.includes(modalInstrument.symbol) : false}
        onExecuteTrade={handleExecuteTrade}
        portfolioBalance={cashBalance}
      />

      {/* 5. Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        instruments={instruments}
        onSelectInstrument={(inst) => {
          setSelectedInstrument(inst);
          setModalInstrument(inst);
        }}
        onToggleWatchlist={handleToggleWatchlist}
        onOpenSuperchart={handleOpenSuperchart}
      />

      {/* 6. Symbol Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        instruments={instruments}
        onSelectInstrument={(inst) => {
          setSelectedInstrument(inst);
          setModalInstrument(inst);
        }}
      />

      {/* 7. PRO Price Alerts Modal */}
      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onDeleteAlert={handleDeleteAlert}
        instruments={instruments}
        currentInstrument={selectedInstrument}
      />
    </div>
  );
}
