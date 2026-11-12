import { Instrument, NewsItem, Candle } from '../types/market';

export const INITIAL_INSTRUMENTS: Instrument[] = [
  // INDICES
  {
    id: 'spx',
    symbol: 'SPX',
    name: 'S&P 500 Index',
    assetClass: 'indices',
    price: 5983.25,
    change: 42.80,
    changePercent: 0.72,
    open: 5945.10,
    high: 5991.40,
    low: 5940.20,
    previousClose: 5940.45,
    volume: 3820000000,
    averageVolume: 3950000000,
    high52Week: 6025.50,
    low52Week: 4890.30,
    currency: 'USD',
    exchange: 'CBOE',
    description: 'Standard and Poor\'s 500 index tracking 500 large companies listed on stock exchanges in the United States.',
    sparkline: [5940, 5948, 5955, 5950, 5962, 5970, 5968, 5980, 5975, 5983.25],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 78
    }
  },
  {
    id: 'ndx',
    symbol: 'NDX',
    name: 'Nasdaq 100 Index',
    assetClass: 'indices',
    price: 21180.40,
    change: 228.60,
    changePercent: 1.09,
    open: 20980.10,
    high: 21210.00,
    low: 20950.30,
    previousClose: 20951.80,
    volume: 5120000000,
    averageVolume: 4900000000,
    high52Week: 21350.00,
    low52Week: 16900.50,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Modified capitalization-weighted index composed of the 100 largest non-financial companies listed on Nasdaq.',
    sparkline: [20950, 20990, 21020, 21010, 21080, 21120, 21110, 21160, 21150, 21180.4],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 84
    }
  },
  {
    id: 'dji',
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    assetClass: 'indices',
    price: 43910.80,
    change: 185.30,
    changePercent: 0.42,
    open: 43760.00,
    high: 43980.20,
    low: 43720.50,
    previousClose: 43725.50,
    volume: 380000000,
    averageVolume: 410000000,
    high52Week: 44480.00,
    low52Week: 37120.00,
    currency: 'USD',
    exchange: 'NYSE',
    description: 'Price-weighted measure of 30 U.S. blue-chip companies representing major sectors of the US economy.',
    sparkline: [43725, 43760, 43790, 43810, 43830, 43890, 43870, 43900, 43890, 43910.8],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Neutral',
      movingAverages: 'Buy',
      score: 55
    }
  },
  {
    id: 'rut',
    symbol: 'RUT',
    name: 'Russell 2000 Small-Cap',
    assetClass: 'indices',
    price: 2364.50,
    change: -12.40,
    changePercent: -0.52,
    open: 2378.00,
    high: 2382.10,
    low: 2358.90,
    previousClose: 2376.90,
    volume: 1450000000,
    averageVolume: 1520000000,
    high52Week: 2442.00,
    low52Week: 1910.00,
    currency: 'USD',
    exchange: 'FTSE Russell',
    description: 'Index measuring the performance of approximately 2,000 smallest-cap American companies.',
    sparkline: [2376, 2379, 2372, 2368, 2365, 2361, 2366, 2363, 2360, 2364.5],
    technicalRating: 'Neutral',
    ratingScores: {
      oscillators: 'Sell',
      movingAverages: 'Neutral',
      score: -12
    }
  },
  {
    id: 'dax',
    symbol: 'DAX',
    name: 'DAX 40 Germany',
    assetClass: 'indices',
    price: 19412.30,
    change: 96.10,
    changePercent: 0.50,
    open: 19320.00,
    high: 19450.00,
    low: 19310.00,
    previousClose: 19316.20,
    volume: 68000000,
    averageVolume: 72000000,
    high52Week: 19674.00,
    low52Week: 15600.00,
    currency: 'EUR',
    exchange: 'XETRA',
    description: 'Blue chip stock market index consisting of 40 major German companies trading on the Frankfurt Stock Exchange.',
    sparkline: [19316, 19330, 19360, 19375, 19400, 19420, 19410, 19430, 19400, 19412.3],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Buy',
      score: 62
    }
  },
  {
    id: 'ni225',
    symbol: 'NI225',
    name: 'Nikkei 225 Japan',
    assetClass: 'indices',
    price: 39533.32,
    change: 412.50,
    changePercent: 1.05,
    open: 39180.00,
    high: 39600.00,
    low: 39150.00,
    previousClose: 39120.82,
    volume: 980000000,
    averageVolume: 920000000,
    high52Week: 42426.00,
    low52Week: 31100.00,
    currency: 'JPY',
    exchange: 'Tokyo',
    description: 'Price-weighted index for the Tokyo Stock Exchange calculating the performance of 225 large public companies.',
    sparkline: [39120, 39200, 39280, 39350, 39420, 39480, 39510, 39500, 39520, 39533.32],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 75
    }
  },

  // STOCKS
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    assetClass: 'stocks',
    sector: 'Technology',
    price: 147.20,
    change: 4.85,
    changePercent: 3.41,
    open: 143.10,
    high: 148.50,
    low: 142.80,
    previousClose: 142.35,
    volume: 58400000,
    averageVolume: 51200000,
    marketCap: 3610000000000,
    peRatio: 58.4,
    dividendYield: 0.03,
    high52Week: 149.76,
    low52Week: 47.32,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Pioneer of GPU-accelerated computing and undisputed infrastructure leader for artificial intelligence models and data centers.',
    sparkline: [142.35, 143.5, 144.2, 145.1, 144.8, 146.3, 146.9, 147.8, 146.8, 147.2],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 92
    }
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    assetClass: 'stocks',
    sector: 'Technology',
    price: 228.45,
    change: 1.95,
    changePercent: 0.86,
    open: 226.90,
    high: 229.30,
    low: 226.50,
    previousClose: 226.50,
    volume: 48900000,
    averageVolume: 49500000,
    marketCap: 3470000000000,
    peRatio: 36.1,
    dividendYield: 0.44,
    high52Week: 237.23,
    low52Week: 164.08,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and services globally.',
    sparkline: [226.5, 227.1, 227.4, 227.0, 227.8, 228.1, 228.6, 228.9, 228.2, 228.45],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Neutral',
      movingAverages: 'Buy',
      score: 64
    }
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    assetClass: 'stocks',
    sector: 'Technology',
    price: 423.80,
    change: 3.20,
    changePercent: 0.76,
    open: 421.50,
    high: 425.60,
    low: 420.80,
    previousClose: 420.60,
    volume: 21300000,
    averageVolume: 22400000,
    marketCap: 3150000000000,
    peRatio: 34.8,
    dividendYield: 0.78,
    high52Week: 468.35,
    low52Week: 366.50,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Global tech titan delivering Azure cloud, Copilot AI, enterprise software, productivity platforms, and gaming hardware.',
    sparkline: [420.6, 421.4, 422.3, 421.9, 422.8, 423.5, 424.2, 424.8, 423.4, 423.8],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Neutral',
      movingAverages: 'Buy',
      score: 58
    }
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    assetClass: 'stocks',
    sector: 'Consumer Discretionary',
    price: 209.15,
    change: 2.90,
    changePercent: 1.41,
    open: 206.80,
    high: 210.40,
    low: 206.20,
    previousClose: 206.25,
    volume: 37800000,
    averageVolume: 42100000,
    marketCap: 2190000000000,
    peRatio: 44.2,
    dividendYield: 0.00,
    high52Week: 212.00,
    low52Week: 140.20,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'E-commerce and cloud computing giant driving AWS cloud, advertising services, logistics network, and Prime membership.',
    sparkline: [206.25, 206.9, 207.5, 207.2, 208.1, 208.6, 209.4, 209.9, 208.8, 209.15],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 82
    }
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    assetClass: 'stocks',
    sector: 'Communication',
    price: 181.30,
    change: -1.15,
    changePercent: -0.63,
    open: 182.90,
    high: 183.40,
    low: 180.70,
    previousClose: 182.45,
    volume: 24500000,
    averageVolume: 26100000,
    marketCap: 2240000000000,
    peRatio: 23.9,
    dividendYield: 0.44,
    high52Week: 191.75,
    low52Week: 129.40,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Holding company for Google, YouTube, Android, Chrome, and Cloud, specializing in search algorithms and AI systems.',
    sparkline: [182.45, 182.8, 182.2, 181.8, 181.5, 181.1, 180.9, 181.4, 181.0, 181.3],
    technicalRating: 'Neutral',
    ratingScores: {
      oscillators: 'Neutral',
      movingAverages: 'Neutral',
      score: 5
    }
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    assetClass: 'stocks',
    sector: 'Communication',
    price: 588.60,
    change: 14.20,
    changePercent: 2.47,
    open: 577.20,
    high: 591.80,
    low: 576.40,
    previousClose: 574.40,
    volume: 14900000,
    averageVolume: 13500000,
    marketCap: 1480000000000,
    peRatio: 27.6,
    dividendYield: 0.34,
    high52Week: 602.95,
    low52Week: 313.66,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Operates Facebook, Instagram, WhatsApp, Messenger, and Reality Labs with industry-leading open-source Llama AI models.',
    sparkline: [574.4, 576.8, 579.5, 582.1, 584.0, 587.2, 589.6, 591.2, 588.1, 588.6],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 88
    }
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    assetClass: 'stocks',
    sector: 'Consumer Discretionary',
    price: 328.50,
    change: 18.90,
    changePercent: 6.11,
    open: 312.40,
    high: 334.80,
    low: 310.20,
    previousClose: 309.60,
    volume: 98400000,
    averageVolume: 74200000,
    marketCap: 1050000000000,
    peRatio: 88.5,
    dividendYield: 0.00,
    high52Week: 358.64,
    low52Week: 138.80,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Designs and builds electric cars, energy storage products, Full Self-Driving neural networks, and humanoid robotics.',
    sparkline: [309.6, 314.2, 318.5, 321.0, 325.4, 329.8, 333.1, 331.4, 326.8, 328.5],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Strong Buy',
      movingAverages: 'Strong Buy',
      score: 95
    }
  },
  {
    id: 'jpm',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    assetClass: 'stocks',
    sector: 'Financials',
    price: 242.10,
    change: 2.30,
    changePercent: 0.96,
    open: 240.20,
    high: 243.50,
    low: 239.80,
    previousClose: 239.80,
    volume: 8700000,
    averageVolume: 9200000,
    marketCap: 688000000000,
    peRatio: 12.8,
    dividendYield: 2.02,
    high52Week: 248.80,
    low52Week: 147.50,
    currency: 'USD',
    exchange: 'NYSE',
    description: 'Largest bank holding company in the US offering commercial banking, asset management, and global investment services.',
    sparkline: [239.8, 240.5, 241.1, 241.0, 241.8, 242.4, 242.9, 243.2, 241.8, 242.1],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Buy',
      score: 65
    }
  },
  {
    id: 'lly',
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    assetClass: 'stocks',
    sector: 'Healthcare',
    price: 814.20,
    change: -9.80,
    changePercent: -1.19,
    open: 822.00,
    high: 825.40,
    low: 811.00,
    previousClose: 824.00,
    volume: 3400000,
    averageVolume: 3600000,
    marketCap: 772000000000,
    peRatio: 74.2,
    dividendYield: 0.65,
    high52Week: 972.53,
    low52Week: 550.20,
    currency: 'USD',
    exchange: 'NYSE',
    description: 'Pharmaceutical pioneer leading treatments in diabetes, obesity therapeutics (Mounjaro/Zepbound), oncology, and neuroscience.',
    sparkline: [824.0, 822.5, 820.0, 818.5, 815.0, 813.2, 812.0, 816.0, 813.5, 814.2],
    technicalRating: 'Neutral',
    ratingScores: {
      oscillators: 'Sell',
      movingAverages: 'Neutral',
      score: -18
    }
  },
  {
    id: 'amd',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    assetClass: 'stocks',
    sector: 'Technology',
    price: 142.90,
    change: 3.80,
    changePercent: 2.73,
    open: 139.50,
    high: 144.10,
    low: 139.10,
    previousClose: 139.10,
    volume: 45200000,
    averageVolume: 48900000,
    marketCap: 231000000000,
    peRatio: 112.4,
    dividendYield: 0.00,
    high52Week: 227.30,
    low52Week: 131.20,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Semiconductor pioneer designing high-performance Ryzen CPUs, Radeon GPUs, and Instinct AI accelerators.',
    sparkline: [139.1, 140.2, 141.0, 140.8, 141.9, 142.5, 143.4, 143.8, 142.2, 142.9],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Buy',
      score: 54
    }
  },
  {
    id: 'pltr',
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    assetClass: 'stocks',
    sector: 'Technology',
    price: 64.75,
    change: 3.15,
    changePercent: 5.11,
    open: 61.80,
    high: 65.50,
    low: 61.40,
    previousClose: 61.60,
    volume: 67200000,
    averageVolume: 58000000,
    marketCap: 145000000000,
    peRatio: 122.0,
    dividendYield: 0.00,
    high52Week: 66.06,
    low52Week: 18.50,
    currency: 'USD',
    exchange: 'NYSE',
    description: 'Enterprise AI operating platform providing Foundry, Gotham, and Artificial Intelligence Platform (AIP) for defense and commercial institutions.',
    sparkline: [61.6, 62.4, 63.1, 62.9, 63.8, 64.4, 65.2, 65.4, 64.3, 64.75],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Strong Buy',
      movingAverages: 'Strong Buy',
      score: 96
    }
  },
  {
    id: 'coin',
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    assetClass: 'stocks',
    sector: 'Financials',
    price: 312.40,
    change: 22.80,
    changePercent: 7.87,
    open: 294.00,
    high: 318.50,
    low: 292.10,
    previousClose: 289.60,
    volume: 18900000,
    averageVolume: 12400000,
    marketCap: 77800000000,
    peRatio: 52.1,
    dividendYield: 0.00,
    high52Week: 342.98,
    low52Week: 114.43,
    currency: 'USD',
    exchange: 'NASDAQ',
    description: 'Leading US-based cryptocurrency exchange platform offering retail trading, institutional custody, Base L2, and staking infrastructure.',
    sparkline: [289.6, 295.1, 299.8, 303.4, 307.2, 312.0, 316.5, 317.8, 310.5, 312.4],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Strong Buy',
      movingAverages: 'Strong Buy',
      score: 91
    }
  },

  // CRYPTO
  {
    id: 'btc',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    assetClass: 'crypto',
    price: 88420.00,
    change: 2450.00,
    changePercent: 2.85,
    open: 85970.00,
    high: 89350.00,
    low: 85700.00,
    previousClose: 85970.00,
    volume: 48900000000,
    averageVolume: 42100000000,
    marketCap: 1745000000000,
    high52Week: 93480.00,
    low52Week: 35100.00,
    currency: 'USD',
    exchange: 'CRYPTO',
    description: 'Decentralized digital peer-to-peer store of value and computational sound money governed by algorithmic proof-of-work consensus.',
    sparkline: [85970, 86400, 86900, 86700, 87400, 87900, 88600, 89100, 88200, 88420],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Strong Buy',
      movingAverages: 'Strong Buy',
      score: 89
    }
  },
  {
    id: 'eth',
    symbol: 'ETH/USD',
    name: 'Ethereum',
    assetClass: 'crypto',
    price: 3145.80,
    change: 82.30,
    changePercent: 2.69,
    open: 3063.50,
    high: 3190.00,
    low: 3050.20,
    previousClose: 3063.50,
    volume: 24500000000,
    averageVolume: 21800000000,
    marketCap: 378000000000,
    high52Week: 4092.00,
    low52Week: 1980.00,
    currency: 'USD',
    exchange: 'CRYPTO',
    description: 'Open-source decentralized smart contract compute protocol powering DeFi applications, tokenization, and Layer 2 ecosystems.',
    sparkline: [3063.5, 3080, 3095, 3090, 3120, 3135, 3165, 3180, 3138, 3145.8],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Buy',
      score: 71
    }
  },
  {
    id: 'sol',
    symbol: 'SOL/USD',
    name: 'Solana',
    assetClass: 'crypto',
    price: 218.40,
    change: 14.60,
    changePercent: 7.16,
    open: 203.80,
    high: 224.50,
    low: 202.10,
    previousClose: 203.80,
    volume: 8900000000,
    averageVolume: 7100000000,
    marketCap: 102000000000,
    high52Week: 260.06,
    low52Week: 52.40,
    currency: 'USD',
    exchange: 'CRYPTO',
    description: 'High-throughput Layer 1 blockchain utilizing Proof of History consensus to deliver sub-second finality and ultra-low transaction fees.',
    sparkline: [203.8, 206.5, 209.8, 212.0, 215.3, 219.0, 223.5, 224.1, 216.5, 218.4],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Strong Buy',
      movingAverages: 'Strong Buy',
      score: 94
    }
  },
  {
    id: 'xrp',
    symbol: 'XRP/USD',
    name: 'Ripple XRP',
    assetClass: 'crypto',
    price: 1.18,
    change: 0.12,
    changePercent: 11.32,
    open: 1.06,
    high: 1.25,
    low: 1.04,
    previousClose: 1.06,
    volume: 5900000000,
    averageVolume: 3200000000,
    marketCap: 67000000000,
    high52Week: 1.35,
    low52Week: 0.48,
    currency: 'USD',
    exchange: 'CRYPTO',
    description: 'Digital asset built for fast, cost-effective cross-border global payments and institutional liquidity settlement.',
    sparkline: [1.06, 1.08, 1.11, 1.13, 1.17, 1.20, 1.24, 1.22, 1.16, 1.18],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Strong Buy',
      movingAverages: 'Strong Buy',
      score: 97
    }
  },

  // FOREX
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    assetClass: 'forex',
    price: 1.0542,
    change: -0.0028,
    changePercent: -0.26,
    open: 1.0570,
    high: 1.0585,
    low: 1.0528,
    previousClose: 1.0570,
    volume: 125000000000,
    averageVolume: 130000000000,
    high52Week: 1.1214,
    low52Week: 1.0498,
    currency: 'USD',
    exchange: 'FX',
    description: 'The world\'s most heavily traded currency pair representing the two largest global economies (European Union & United States).',
    sparkline: [1.057, 1.0565, 1.0568, 1.0558, 1.055, 1.0545, 1.0538, 1.0532, 1.054, 1.0542],
    technicalRating: 'Sell',
    ratingScores: {
      oscillators: 'Sell',
      movingAverages: 'Strong Sell',
      score: -72
    }
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    assetClass: 'forex',
    price: 154.68,
    change: 0.82,
    changePercent: 0.53,
    open: 153.86,
    high: 154.95,
    low: 153.75,
    previousClose: 153.86,
    volume: 98000000000,
    averageVolume: 102000000000,
    high52Week: 161.95,
    low52Week: 140.25,
    currency: 'JPY',
    exchange: 'FX',
    description: 'Second most liquid currency pair, heavily responsive to US Treasury yields, Bank of Japan yield curve control, and global trade flows.',
    sparkline: [153.86, 154.02, 154.18, 154.3, 154.45, 154.6, 154.85, 154.9, 154.62, 154.68],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 76
    }
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    assetClass: 'forex',
    price: 1.2685,
    change: -0.0019,
    changePercent: -0.15,
    open: 1.2704,
    high: 1.2720,
    low: 1.2662,
    previousClose: 1.2704,
    volume: 68000000000,
    averageVolume: 72000000000,
    high52Week: 1.3435,
    low52Week: 1.2298,
    currency: 'USD',
    exchange: 'FX',
    description: 'Nicknamed "Cable", tracking the exchange rate between the Great British Pound and the United States Dollar.',
    sparkline: [1.2704, 1.2708, 1.2698, 1.269, 1.2682, 1.2678, 1.2671, 1.268, 1.2682, 1.2685],
    technicalRating: 'Sell',
    ratingScores: {
      oscillators: 'Neutral',
      movingAverages: 'Sell',
      score: -48
    }
  },

  // COMMODITIES
  {
    id: 'xauusd',
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    assetClass: 'commodities',
    price: 2618.40,
    change: 24.60,
    changePercent: 0.95,
    open: 2593.80,
    high: 2625.50,
    low: 2591.20,
    previousClose: 2593.80,
    volume: 18500000000,
    averageVolume: 17200000000,
    high52Week: 2790.15,
    low52Week: 1984.30,
    currency: 'USD',
    exchange: 'COMEX',
    description: 'Precious yellow metal serving as the preeminent global monetary hedge against fiat debasement and geopolitical risk.',
    sparkline: [2593.8, 2598, 2604, 2609, 2612, 2617, 2623, 2624, 2615, 2618.4],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 80
    }
  },
  {
    id: 'cl',
    symbol: 'CL',
    name: 'Crude Oil WTI',
    assetClass: 'commodities',
    price: 69.45,
    change: 1.25,
    changePercent: 1.83,
    open: 68.20,
    high: 69.80,
    low: 68.10,
    previousClose: 68.20,
    volume: 14200000000,
    averageVolume: 15100000000,
    high52Week: 87.67,
    low52Week: 65.27,
    currency: 'USD',
    exchange: 'NYMEX',
    description: 'West Texas Intermediate benchmark crude oil contract for North American energy production and refining consumption.',
    sparkline: [68.2, 68.45, 68.7, 68.65, 68.95, 69.2, 69.65, 69.75, 69.3, 69.45],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Neutral',
      score: 42
    }
  },
  {
    id: 'xagusd',
    symbol: 'XAG/USD',
    name: 'Silver Spot',
    assetClass: 'commodities',
    price: 31.15,
    change: 0.58,
    changePercent: 1.90,
    open: 30.57,
    high: 31.42,
    low: 30.50,
    previousClose: 30.57,
    volume: 6800000000,
    averageVolume: 6100000000,
    high52Week: 35.40,
    low52Week: 21.90,
    currency: 'USD',
    exchange: 'COMEX',
    description: 'Dual-purpose monetary and industrial commodity heavily leveraged in solar photovoltaics, EV electronics, and safe-haven investment.',
    sparkline: [30.57, 30.7, 30.85, 30.8, 30.98, 31.1, 31.35, 31.38, 31.05, 31.15],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 79
    }
  },

  // BONDS
  {
    id: 'us10y',
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    assetClass: 'bonds',
    price: 4.442,
    change: 0.038,
    changePercent: 0.86,
    open: 4.404,
    high: 4.460,
    low: 4.398,
    previousClose: 4.404,
    volume: 24000000000,
    averageVolume: 22000000000,
    high52Week: 4.740,
    low52Week: 3.610,
    currency: '%',
    exchange: 'US GOVT',
    description: 'The global benchmark risk-free discount rate anchoring mortgage rates, equity risk premiums, and sovereign debt yields worldwide.',
    sparkline: [4.404, 4.412, 4.42, 4.428, 4.435, 4.445, 4.452, 4.458, 4.44, 4.442],
    technicalRating: 'Strong Buy',
    ratingScores: {
      oscillators: 'Buy',
      movingAverages: 'Strong Buy',
      score: 85
    }
  },
  {
    id: 'us2y',
    symbol: 'US02Y',
    name: 'US 2-Year Treasury Yield',
    assetClass: 'bonds',
    price: 4.298,
    change: 0.021,
    changePercent: 0.49,
    open: 4.277,
    high: 4.312,
    low: 4.270,
    previousClose: 4.277,
    volume: 18000000000,
    averageVolume: 17500000000,
    high52Week: 5.040,
    low52Week: 3.550,
    currency: '%',
    exchange: 'US GOVT',
    description: 'Sovereign note reflecting market consensus expectations of Federal Reserve short-term policy interest rates.',
    sparkline: [4.277, 4.282, 4.289, 4.292, 4.295, 4.301, 4.308, 4.305, 4.295, 4.298],
    technicalRating: 'Buy',
    ratingScores: {
      oscillators: 'Neutral',
      movingAverages: 'Buy',
      score: 52
    }
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Nvidia Blackwell Ultra Architecture Ramps Shipments Across Top Hyperscalers',
    summary: 'Cloud compute hyperscalers reported accelerating deployments of next-generation GPU server racks, fueling record Q4 datacenter hardware revenue.',
    source: 'Bloomberg Markets',
    url: '#',
    timeAgo: '12m ago',
    assetClass: 'stocks',
    relatedSymbols: ['NVDA', 'MSFT', 'AMZN'],
    sentiment: 'Bullish'
  },
  {
    id: 'news-2',
    title: 'Bitcoin Surges Towards New All-Time Highs on Institutional ETF Inflows',
    summary: 'Net capital inflows into spot Bitcoin exchange-traded funds crossed $1.8 billion this week as institutional asset managers expand digital asset reserves.',
    source: 'CoinDesk',
    url: '#',
    timeAgo: '28m ago',
    assetClass: 'crypto',
    relatedSymbols: ['BTC/USD', 'ETH/USD', 'COIN'],
    sentiment: 'Bullish'
  },
  {
    id: 'news-3',
    title: 'Fed Rate Cut Expectations Recalibrated as Retail Sales Print Above Consensus',
    summary: 'Treasury yields tick higher as consumer spending resilience prompts fixed-income traders to trim expectations for aggressive December monetary easing.',
    source: 'Reuters Financial',
    url: '#',
    timeAgo: '45m ago',
    assetClass: 'bonds',
    relatedSymbols: ['US10Y', 'SPX', 'EUR/USD'],
    sentiment: 'Neutral'
  },
  {
    id: 'news-4',
    title: 'Gold Consolidates Above $2,600 Support as Central Banks Continue Reserves Expansion',
    summary: 'Sovereign central banks purchased a net 240 tonnes of gold bullion this quarter, establishing a robust floor under precious metal spot valuations.',
    source: 'Financial Times',
    url: '#',
    timeAgo: '1h ago',
    assetClass: 'commodities',
    relatedSymbols: ['XAU/USD', 'XAG/USD'],
    sentiment: 'Bullish'
  },
  {
    id: 'news-5',
    title: 'Tesla Robotaxi Pilot Authorization Progresses in Texas and California',
    summary: 'Autonomous miles driven without safety driver disengagements surge past 250 million, boosting investor enthusiasm in full-self-driving commercialization.',
    source: 'Wall Street Journal',
    url: '#',
    timeAgo: '2h ago',
    assetClass: 'stocks',
    relatedSymbols: ['TSLA', 'SPX'],
    sentiment: 'Bullish'
  },
  {
    id: 'news-6',
    title: 'European Central Bank Signals Measured Pace on Disinflation Trajectory',
    summary: 'Euro remains under pressure as economic divergence widens between United States output resilience and Eurozone industrial stagnation.',
    source: 'MarketWatch',
    url: '#',
    timeAgo: '3h ago',
    assetClass: 'forex',
    relatedSymbols: ['EUR/USD', 'DAX'],
    sentiment: 'Bearish'
  }
];

export const SECTOR_PERFORMANCE = [
  { name: 'Technology', change: 2.34, weight: 31.8, leader: 'NVDA +3.41%' },
  { name: 'Financials', change: 0.92, weight: 13.2, leader: 'JPM +0.96%' },
  { name: 'Consumer Discretionary', change: 1.88, weight: 10.4, leader: 'TSLA +6.11%' },
  { name: 'Communication Services', change: 1.45, weight: 9.1, leader: 'META +2.47%' },
  { name: 'Industrials', change: 0.38, weight: 8.5, leader: 'GE +1.12%' },
  { name: 'Energy', change: 1.62, weight: 3.9, leader: 'XOM +1.74%' },
  { name: 'Healthcare', change: -0.74, weight: 11.5, leader: 'LLY -1.19%' },
  { name: 'Utilities', change: -0.42, weight: 2.3, leader: 'NEE -0.38%' },
  { name: 'Real Estate', change: -0.85, weight: 2.1, leader: 'PLD -0.92%' },
  { name: 'Materials', change: 0.29, weight: 2.4, leader: 'LIN +0.55%' }
];

// Generates realistic OHLC candlestick history for any instrument
export function generateCandles(instrument: Instrument, timeframe: string = '1D', count: number = 60): Candle[] {
  const candles: Candle[] = [];
  const now = Math.floor(Date.now() / 1000);
  
  let stepSeconds = 300; // 5 min for 1D
  if (timeframe === '5D') stepSeconds = 1800; // 30 min
  else if (timeframe === '1M') stepSeconds = 86400; // 1 day
  else if (timeframe === '3M') stepSeconds = 86400;
  else if (timeframe === '1Y') stepSeconds = 86400 * 3;
  else if (timeframe === '5Y') stepSeconds = 86400 * 14;

  const basePrice = instrument.price;
  // Volatility factor based on asset class
  let volatility = 0.012;
  if (instrument.assetClass === 'crypto') volatility = 0.035;
  if (instrument.assetClass === 'forex') volatility = 0.003;
  if (instrument.assetClass === 'bonds') volatility = 0.004;

  let currentPrice = basePrice * (1 - (instrument.changePercent / 100));
  
  // Seed pseudo-random walk that ends nicely at current instrument price
  const startTs = now - (count * stepSeconds);
  const targetEndPrice = instrument.price;
  const driftPerStep = (targetEndPrice - currentPrice) / count;

  for (let i = 0; i < count; i++) {
    const time = startTs + (i * stepSeconds);
    const noise = (Math.sin(i * 0.45) * 0.4 + (Math.random() - 0.48)) * (currentPrice * volatility);
    const open = i === 0 ? currentPrice : candles[i - 1].close;
    let close = open + noise + driftPerStep;
    
    // Ensure final candle closes at current price
    if (i === count - 1) {
      close = targetEndPrice;
    }

    const high = Math.max(open, close) + (Math.random() * currentPrice * volatility * 0.6);
    const low = Math.min(open, close) - (Math.random() * currentPrice * volatility * 0.6);
    const volume = Math.floor((instrument.volume / count) * (0.6 + Math.random() * 0.8));

    candles.push({
      time,
      open: Number(open.toFixed(instrument.price < 5 ? 4 : 2)),
      high: Number(high.toFixed(instrument.price < 5 ? 4 : 2)),
      low: Number(low.toFixed(instrument.price < 5 ? 4 : 2)),
      close: Number(close.toFixed(instrument.price < 5 ? 4 : 2)),
      volume
    });
    currentPrice = close;
  }

  return candles;
}
