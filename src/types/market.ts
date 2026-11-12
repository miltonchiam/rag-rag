export type AssetClass = 'indices' | 'stocks' | 'crypto' | 'forex' | 'commodities' | 'bonds';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  averageVolume: number;
  marketCap?: number; // In USD
  peRatio?: number;
  dividendYield?: number;
  high52Week: number;
  low52Week: number;
  currency: string;
  exchange: string;
  sector?: string;
  description: string;
  sparkline: number[];
  technicalRating: TechnicalRating;
  ratingScores: {
    oscillators: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
    movingAverages: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
    score: number; // -100 to +100
  };
  // PRO Metrics
  beta?: number;
  vwap?: number;
  rsi14?: number;
  atr14?: number;
  volatility30d?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  timeAgo: string;
  assetClass: AssetClass;
  relatedSymbols: string[];
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  imageUrl?: string;
}

export interface PaperTradePosition {
  symbol: string;
  name: string;
  shares: number;
  averageEntry: number;
  currentPrice: number;
  type: 'BUY' | 'SELL';
  openedAt: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface MarketMovers {
  gainers: Instrument[];
  losers: Instrument[];
  mostActive: Instrument[];
  highVolume: Instrument[];
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface TimeAndSale {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  currency: string;
  country: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface MarketAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: number;
  triggered: boolean;
  message?: string;
}

export type ChartLayoutMode = 'single' | 'split-h' | 'split-v' | 'quad';

export type DrawingTool = 'cursor' | 'trendline' | 'horizontal' | 'fibonacci' | 'position' | 'ruler';

export interface PositionToolConfig {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
}
