# Project Prompts Log

Chronological history of prompts provided during the creation and iteration of the **TradePulse PRO** market analytics application.

---

### Prompt 1
> **User Prompt:**  
> `Build me an app with screens that look like this. You can hotlink images from the URL ; https//trading views.com/markets`

- **Summary of Action:** Built the complete TradingView Markets suite featuring Global Market Overview with key benchmark cards, interactive Superchart with candlesticks and technical indicators, interactive S&P 500 / Crypto Heatmap, multi-asset Financial Screener, News & Macro feed, simulated Paper Trading ($100k account), Speedometer Technical Analysis gauge, and persistent Watchlist drawer.

---

### Prompt 2
> **User Prompt:**  
> `git push https://<GITHUB_TOKEN>@https://github.com/miltonchiam/rag-rag.git`

- **Summary of Action:** Initialized git repository, configured safe directory and user metadata, committed initial application files (`ecd1666`), and pushed to GitHub main branch.

---

### Prompt 3
> **User Prompt:**  
> `would you make this like a PRO?`

- **Summary of Action:** Upgraded the application to institutional TradingView Pro+ standard:
  - **PRO Superchart Tools**: Added left-hand drawing toolbar (pointer, horizontal support/resistance rays, Fibonacci retracement grid, risk/reward position tool, clear tool).
  - **PRO Resolutions**: Added `1m`, `5m`, `15m`, `1h`, `4h`, `1D`, and `1W`.
  - **Extended Indicators**: Added EMA 200, VWAP, Bollinger Bands, Volume Profile (VPVR), RSI (14), and MACD with histogram.
  - **Live Candle Countdown**: Bar-close countdown timer (`03:42`).
  - **Level 2 Order Book & Depth (DOM)**: Bid/ask ladder with depth bars, live Time & Sales tape prints, and cumulative depth curves.
  - **Institutional Economic Calendar**: High-impact macro releases (FOMC, CPI, NFP, PMI) with impact and currency filters.
  - **Real-Time Price Alerts**: Alert manager evaluating price crossing triggers with header notifications.
  - **PRO Screener Presets**: One-click scans for Volume Surges, 52W High Breakouts, High Beta, and Dip Buys.

---

### Prompt 4
> **User Prompt:**  
> `yes gitpush`

- **Summary of Action:** Pushed the PRO upgrade commit (`14fd618`) to `https://github.com/miltonchiam/rag-rag.git` on the `main` branch.

---

### Prompt 5
> **User Prompt:**  
> `collate all the prompts that i have given and store into file named prompts.md`

- **Summary of Action:** Created `prompts.md` containing the full chronological prompt history and corresponding implementation notes.
