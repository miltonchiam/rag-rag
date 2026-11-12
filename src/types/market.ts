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
}

export interface MarketMovers {
  gainers: Instrument[];
  losers: Instrument[];
  mostActive: Instrument[];
  highVolume: Instrument[];
}
