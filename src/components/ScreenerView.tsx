import React, { useState, useMemo } from 'react';
import { Instrument, TechnicalRating } from '../types/market';
import { 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Star, 
  ExternalLink,
  Filter,
  RefreshCw,
  Zap,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ScreenerViewProps {
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onOpenSuperchart: (instrument: Instrument) => void;
  onToggleWatchlist: (symbol: string) => void;
  watchlist: string[];
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap' | 'peRatio';
type SortOrder = 'asc' | 'desc';
type PresetScan = 'all' | 'volume_surge' | 'breakouts' | 'high_beta' | 'oversold';

export const ScreenerView: React.FC<ScreenerViewProps> = ({
  instruments,
  onSelectInstrument,
  onOpenSuperchart,
  onToggleWatchlist,
  watchlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'gainers' | 'losers' | 'momentum'>('all');
  const [presetScan, setPresetScan] = useState<PresetScan>('all');

  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Extract unique sectors
  const sectors = useMemo(() => {
    const set = new Set<string>();
    instruments.forEach(i => {
      if (i.sector) set.add(i.sector);
    });
    return Array.from(set);
  }, [instruments]);

  // Filtering
  const filtered = useMemo(() => {
    return instruments.filter(item => {
      // Preset Scan logic
      if (presetScan === 'volume_surge' && item.volume < item.averageVolume * 0.9) return false;
      if (presetScan === 'breakouts' && item.price < item.high52Week * 0.95) return false;
      if (presetScan === 'high_beta' && Math.abs(item.changePercent) < 2.5) return false;
      if (presetScan === 'oversold' && item.changePercent > -1.0) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Asset Class
      if (selectedAssetClass !== 'all' && item.assetClass !== selectedAssetClass) return false;

      // Sector
      if (selectedSector !== 'all' && item.sector !== selectedSector) return false;

      // Rating
      if (selectedRating !== 'all' && item.technicalRating !== selectedRating) return false;

      // Performance Filter
      if (performanceFilter === 'gainers' && item.changePercent <= 0) return false;
      if (performanceFilter === 'losers' && item.changePercent >= 0) return false;
      if (performanceFilter === 'momentum' && Math.abs(item.changePercent) < 2.5) return false;

      return true;
    });
  }, [instruments, presetScan, searchQuery, selectedAssetClass, selectedSector, selectedRating, performanceFilter]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a[sortField] ?? 0;
      let valB: any = b[sortField] ?? 0;

      if (sortField === 'symbol') {
        return sortOrder === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [filtered, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['Symbol', 'Name', 'Asset Class', 'Sector', 'Price', 'Change %', 'Volume', 'Market Cap', 'Rating'];
    const rows = sorted.map(i => [
      i.symbol,
      `"${i.name}"`,
      i.assetClass,
      `"${i.sector || 'N/A'}"`,
      i.price,
      i.changePercent,
      i.volume,
      i.marketCap || 'N/A',
      i.technicalRating
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TradePulse_PRO_Screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Pre-Built PRO Scans Banner */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2962ff]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">PRO Scanner Presets:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setPresetScan('all')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              presetScan === 'all' ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            All Instruments
          </button>
          <button
            onClick={() => setPresetScan('volume_surge')}
            className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
              presetScan === 'volume_surge' ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Volume Surges</span>
          </button>
          <button
            onClick={() => setPresetScan('breakouts')}
            className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
              presetScan === 'breakouts' ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
            <span>52W High Breakouts</span>
          </button>
          <button
            onClick={() => setPresetScan('high_beta')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              presetScan === 'high_beta' ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            ⚡ High Volatility
          </button>
          <button
            onClick={() => setPresetScan('oversold')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              presetScan === 'oversold' ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            Pullbacks (Dip Buys)
          </button>
        </div>
      </div>

      {/* 2. Filter Controls Box */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-white">Multi-Asset Financial Screener</h2>
            <span className="text-xs font-mono text-[#787b86]">({sorted.length} results)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAssetClass('all');
                setSelectedSector('all');
                setSelectedRating('all');
                setPerformanceFilter('all');
                setPresetScan('all');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#787b86] hover:text-[#d1d4dc] bg-[#131722] border border-[#2a2e39] rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#2962ff]/90 rounded-md transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#787b86]" />
            <input
              type="text"
              placeholder="Search ticker, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-md pl-9 pr-3 py-2 text-white placeholder-[#787b86] focus:outline-none focus:border-[#2962ff]"
            />
          </div>

          <div>
            <select
              value={selectedAssetClass}
              onChange={(e) => setSelectedAssetClass(e.target.value)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-md px-3 py-2 text-[#d1d4dc] focus:outline-none focus:border-[#2962ff] capitalize"
            >
              <option value="all">All Asset Classes</option>
              <option value="stocks">Stocks</option>
              <option value="crypto">Crypto</option>
              <option value="forex">Forex</option>
              <option value="indices">Indices</option>
              <option value="commodities">Commodities</option>
              <option value="bonds">Bonds</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-md px-3 py-2 text-[#d1d4dc] focus:outline-none focus:border-[#2962ff]"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-md px-3 py-2 text-[#d1d4dc] focus:outline-none focus:border-[#2962ff]"
            >
              <option value="all">All Technical Ratings</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Neutral">Neutral</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div>
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value as any)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-md px-3 py-2 text-[#d1d4dc] focus:outline-none focus:border-[#2962ff]"
            >
              <option value="all">All Price Moves</option>
              <option value="gainers">Gainers Only (+)</option>
              <option value="losers">Losers Only (-)</option>
              <option value="momentum">High Volatility (|Change| &gt; 2.5%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Screener Data Grid */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead>
              <tr className="bg-[#181c27] text-[#787b86] border-b border-[#2a2e39] font-medium font-sans select-none">
                <th 
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Ticker & Company</span>
                    {sortField === 'symbol' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962ff]" /> : <ArrowDown className="w-3 h-3 text-[#2962ff]" />)}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Price</span>
                    {sortField === 'price' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962ff]" /> : <ArrowDown className="w-3 h-3 text-[#2962ff]" />)}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>1D %</span>
                    {sortField === 'changePercent' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962ff]" /> : <ArrowDown className="w-3 h-3 text-[#2962ff]" />)}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('volume')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Volume</span>
                    {sortField === 'volume' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962ff]" /> : <ArrowDown className="w-3 h-3 text-[#2962ff]" />)}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('marketCap')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white hidden md:table-cell"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Market Cap</span>
                    {sortField === 'marketCap' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962ff]" /> : <ArrowDown className="w-3 h-3 text-[#2962ff]" />)}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('peRatio')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>P/E</span>
                    {sortField === 'peRatio' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962ff]" /> : <ArrowDown className="w-3 h-3 text-[#2962ff]" />)}
                  </div>
                </th>

                <th className="py-3 px-4 text-center hidden md:table-cell font-sans">Technical Rating</th>
                <th className="py-3 px-4 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#787b86] font-sans">
                    No instruments match your active criteria. Try choosing another scanner preset.
                  </td>
                </tr>
              ) : (
                sorted.map(item => {
                  const isUp = item.change >= 0;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectInstrument(item)}
                      className="hover:bg-[#131722] cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWatchlist(item.symbol);
                            }}
                            className={`p-1 rounded hover:bg-[#2a2e39] ${
                              watchlist.includes(item.symbol) ? 'text-[#f59e0b]' : 'text-[#787b86]'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">{item.symbol}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2e39] text-[#787b86] uppercase font-mono">{item.exchange}</span>
                            </div>
                            <span className="text-[11px] text-[#787b86] truncate max-w-[160px] sm:max-w-xs block">{item.name}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right text-white font-semibold">
                        ${item.price < 5 && item.assetClass === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {item.currency === '%' ? '%' : ''}
                      </td>

                      <td className={`py-3 px-4 text-right font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </td>

                      <td className="py-3 px-4 text-right text-[#787b86] hidden sm:table-cell">
                        {(item.volume / 1000000).toFixed(1)}M
                      </td>

                      <td className="py-3 px-4 text-right text-[#d1d4dc] hidden md:table-cell">
                        {item.marketCap ? `$${(item.marketCap / 1000000000).toFixed(1)}B` : '—'}
                      </td>

                      <td className="py-3 px-4 text-right text-[#787b86] hidden lg:table-cell">
                        {item.peRatio ? item.peRatio.toFixed(1) : '—'}
                      </td>

                      <td className="py-3 px-4 text-center hidden md:table-cell font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.technicalRating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/30'
                            : item.technicalRating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/30'
                            : 'bg-[#2a2e39] text-[#787b86]'
                        }`}>
                          {item.technicalRating}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSuperchart(item);
                          }}
                          className="px-2.5 py-1 bg-[#2a2e39] hover:bg-[#2962ff] text-[#d1d4dc] hover:text-white rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Superchart</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
