import React from 'react';
import { 
  TrendingUp, 
  Search, 
  Sun, 
  Moon, 
  Star, 
  BarChart2, 
  LayoutGrid, 
  SlidersHorizontal, 
  Newspaper, 
  Briefcase,
  Calendar,
  Bell
} from 'lucide-react';

export type ActiveTab = 'overview' | 'superchart' | 'heatmap' | 'screener' | 'news' | 'calendar' | 'portfolio';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  onToggleWatchlist: () => void;
  portfolioBalance: number;
  alertCount: number;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  onOpenSearch,
  watchlistCount,
  onToggleWatchlist,
  portfolioBalance,
  alertCount,
  onOpenAlerts
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#131722] border-b border-[#2a2e39] px-4 lg:px-6 h-14 flex items-center justify-between gap-4 select-none">
      {/* Zone 1: Brand & Search */}
      <div className="flex items-center gap-5 shrink-0">
        <button 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center shadow-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white font-sans">TradePulse</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#2962ff] text-white tracking-widest font-mono">
              PRO
            </span>
          </div>
        </button>

        {/* Global Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] border border-[#2a2e39] rounded-lg text-xs transition-colors w-60 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span className="truncate">Search tickers, crypto, forex...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#131722] border border-[#363a45] rounded text-[#787b86] font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Zone 2: Navigation Tabs */}
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#2962ff] text-white shadow-sm'
              : 'text-[#d1d4dc] hover:text-white hover:bg-[#1e222d]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('superchart')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'superchart'
              ? 'bg-[#2962ff] text-white shadow-sm'
              : 'text-[#d1d4dc] hover:text-white hover:bg-[#1e222d]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Superchart</span>
        </button>

        <button
          onClick={() => setActiveTab('heatmap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'heatmap'
              ? 'bg-[#2962ff] text-white shadow-sm'
              : 'text-[#d1d4dc] hover:text-white hover:bg-[#1e222d]'
          }`}
        >
          <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
            <span className="bg-[#089981] rounded-xs"></span>
            <span className="bg-[#f23645] rounded-xs"></span>
            <span className="bg-[#089981] rounded-xs"></span>
            <span className="bg-[#089981] rounded-xs"></span>
          </div>
          <span>Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('screener')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'screener'
              ? 'bg-[#2962ff] text-white shadow-sm'
              : 'text-[#d1d4dc] hover:text-white hover:bg-[#1e222d]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Screener</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'calendar'
              ? 'bg-[#2962ff] text-white shadow-sm'
              : 'text-[#d1d4dc] hover:text-white hover:bg-[#1e222d]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'news'
              ? 'bg-[#2962ff] text-white shadow-sm'
              : 'text-[#d1d4dc] hover:text-white hover:bg-[#1e222d]'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>News</span>
        </button>
      </nav>

      {/* Zone 3: Market Status & User Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile search button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d] rounded-lg"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Market Open Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-[#1e222d] border border-[#2a2e39] rounded-md text-[11px] text-[#787b86]">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
          <span className="font-medium text-[#d1d4dc]">NYSE / NASDAQ</span>
          <span className="text-[#787b86]">· Live Streaming</span>
        </div>

        {/* Price Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-[#787b86] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors border border-transparent hover:border-[#2a2e39]"
          title="Price Alerts Manager"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#f59e0b] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {alertCount}
            </span>
          )}
        </button>

        {/* Paper Trade Balance */}
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono tabular-nums transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-[#1e222d] border-[#2962ff] text-[#2962ff]'
              : 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc] hover:border-[#363a45]'
          }`}
          title="PRO Trading Account"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#2962ff]" />
          <span className="hidden sm:inline text-[#787b86] font-sans">Sim:</span>
          <span className="font-semibold">${portfolioBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
        </button>

        {/* Watchlist Toggle */}
        <button
          onClick={onToggleWatchlist}
          className="relative p-2 text-[#787b86] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors border border-transparent hover:border-[#2a2e39]"
          title="Toggle Watchlist"
        >
          <Star className="w-4 h-4" />
          {watchlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#2962ff] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d] rounded-lg transition-colors"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
