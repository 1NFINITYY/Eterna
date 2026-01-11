# Eterna – Real-Time Crypto Token Discovery Platform

Eterna is a full-stack crypto token discovery platform that aggregates, normalizes, and serves real-time token market data from multiple sources. The project focuses on clean backend aggregation, realistic market-data handling, caching, and real-time delivery rather than simple API forwarding.

The architecture is designed to simulate production-grade data pipelines used in real-world crypto analytics platforms.

---

## Implemented Features

### Token Discovery and Data Aggregation
- Token data is aggregated from **Jupiter** and **DexScreener**
- Jupiter provides a verified and trusted token list
- DexScreener provides real-time market data such as:
  - Price
  - Volume
  - Liquidity
  - Market capitalization
  - Price changes

The backend merges these sources into a unified and reliable token discovery feed.

---

### How Jupiter and DexScreener Are Merged

1. The backend fetches a verified token list from Jupiter to ensure authenticity
2. A curated list of seed tokens is included to guarantee coverage of important and trending assets
3. For each Jupiter token and seed token address:
   - DexScreener is queried for all available trading pairs
4. All trading pairs are merged into a single collection
5. Tokens are deduplicated by **token address**
6. If multiple pairs exist for the same token:
   - The pair with the **highest liquidity** is selected
7. Final token data is normalized into consistent fields before being sent to the frontend

This ensures users always see the most relevant and liquid market for each token.

---

### Time-Period Support

- Backend supports **1h, 24h, and 7d** market metrics
- Metrics such as volume and price change are selected dynamically based on the requested time period
- When 7d data is unavailable, a fallback strategy is applied:


This avoids misleading zero values and preserves realistic market behavior.

---

### Advanced Sorting
- Tokens can be sorted by:
  - Volume
  - Price
  - Market capitalization
  - Liquidity
- Sorting respects the selected time period
- Sorting operates entirely on normalized backend fields

---

### Real-Time Updates
- Live token updates are delivered using **WebSockets**
- Optimized for short-term (1h) market views
- Prevents excessive client updates while maintaining responsiveness

---

### Caching with Redis
- Aggregated token results are cached using Redis
- Cache keys include:
  - Page number
  - Time period
- Significantly reduces repeated external API calls
- Improves response times and backend stability

---

### Production-Grade Data Handling
- All market data is normalized on the backend
- Missing or unavailable values are explicitly set to `null`
- The frontend displays missing data as `—` instead of fake zero values
- Frontend logic remains simple and predictable

---

## Current UI Scope

The current frontend focuses on **real-time token discovery and comparison**, not deep analytics.

### Implemented in UI
- Token discovery feed
- Live price, volume, liquidity, and price-change display
- Real-time updates for short-term views
- Pagination-based browsing
- Backend-normalized data rendering

### Backend-Ready / Planned UI Features
- Persistent filters and sorting via URL
- Ascending and descending sort toggles
- Visual indicators for fallback time-period data
- Token detail pages
- Authentication and user watchlists

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Fetch API
- Deployed as a **Render Static Site**

### Backend
- Node.js
- Express
- TypeScript
- Socket.IO
- Redis
- DexScreener API
- Jupiter API
- Deployed as a **Render Web Service**

---

## Project Structure

root
├── frontend
│ ├── src
│ ├── .env.example
│ └── package.json
│
├── backend
│ ├── src
│ │ ├── routes
│ │ ├── services
│ │ ├── websocket
│ │ └── server.ts
│ ├── .env.example
│ └── package.json
│
└── .gitignore
---

## Environment Variables

### Frontend (`frontend/.env`)
VITE_BACKEND_URL=https://<your-backend>.onrender.com

### Backend (`backend/.env`)
PORT=4000
REDIS_URL=redis://<render-redis-url>
JUPITER_API_KEY=your_api_key_here


**Important:**  
Do not commit `.env` files. Only commit `.env.example`.

---

## Running Locally

### Clone the repository
git clone https://github.com/
<your-username>/<repo-name>.git
cd <repo-name>


### Backend setup
- cd backend
- npm install
- cp .env.example .env
- npm run dev

Backend runs on:
http://localhost:4000



### Frontend setup
- cd frontend
- npm install
- cp .env.example .env
- npm run dev


Frontend runs on:
http://localhost:5173



---

## API Endpoints

### Fetch tokens
GET /api/tokens?page=1&timePeriod=24h


### Query Parameters
- `page` – pagination
- `timePeriod` – `1h`, `24h`, or `7d`

---

## Key Engineering Decisions

- Jupiter is used for token verification and discovery
- DexScreener is used for real-time market data
- Liquidity-based deduplication ensures high-quality results
- Redis cache keys include page number and time period to avoid stale data
- Backend normalization reduces frontend complexity and UI bugs
- Missing data is handled explicitly instead of defaulting to zero

---

## Live URLs

Frontend  
https://eterna-umber.vercel.app/

Backend API  
https://eterna-backend-o1rp.onrender.com

---

## Author

**Anant Jain**  
Computer Science and Engineering  
Full-Stack and Backend-Focused Developer

If you like this project, feel free to star the repository on GitHub.
