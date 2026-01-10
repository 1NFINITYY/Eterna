Eterna – Real-Time Crypto Token Discovery Platform

Eterna is a full-stack crypto token discovery platform that aggregates and merges live token data from multiple sources, supports real-time updates, advanced sorting, caching, and multiple time-period views. The project is designed with production-grade architecture and realistic market-data handling.

Features

Token Discovery and Data Aggregation
Token data is aggregated from two primary sources: Jupiter and DexScreener. Jupiter provides a verified and trusted list of tokens, while DexScreener provides real-time market data such as price, volume, liquidity, and price changes. The backend merges these sources to create a clean and reliable token discovery feed.

How Jupiter and DexScreener Are Merged
The backend first fetches a list of verified tokens from Jupiter to ensure token authenticity. In parallel, a curated list of seed tokens is also used to guarantee coverage of important and trending assets.
For each Jupiter token address and each seed token, the backend queries DexScreener to fetch all available trading pairs.
All DexScreener pairs are then merged into a single collection and deduplicated by token address. If multiple pairs exist for the same token, the pair with the highest liquidity is selected. This ensures that users always see the most relevant and liquid market for each token.
After deduplication, token metrics are normalized into consistent fields so the frontend does not need to understand raw DexScreener structures.

Time-Period Filtering
The platform supports 1h, 24h, and 7d views. Market metrics such as volume and price change are dynamically selected based on the chosen time period. When 7d data is unavailable from DexScreener, the backend applies a fallback strategy (7d → 24h → 1h) to avoid misleading zero values.

Advanced Sorting
Tokens can be sorted by volume, price, market cap, and liquidity. Sorting respects the selected time period and always operates on normalized backend fields.

Real-Time Updates
Live token updates are delivered via WebSockets. Real-time updates are optimized for short-term (1h) views to maintain responsiveness without overwhelming the client.

Caching with Redis
Redis is used to cache aggregated token results per page and per time period. This significantly reduces repeated calls to external APIs and improves overall response times.

Production-Grade Data Handling
The backend normalizes all market data before sending it to the frontend. Missing or unavailable data is explicitly represented as null and displayed in the UI as “—” instead of fake zero values.

Tech Stack

Frontend
React (Vite)
Tailwind CSS
Fetch API
Deployed as a Render Static Site

Backend
Node.js with Express
TypeScript
Socket.IO
Redis
DexScreener API
Jupiter API
Deployed as a Render Web Service

Live URLs

Frontend
https://eterna-umber.vercel.app/

Backend API
https://eterna-backend-o1rp.onrender.com


Project Structure

root
  frontend
    src
    .env.example
    package.json
  backend
    src
      routes
      services
      websocket
      server.ts
    .env.example
    package.json
  .gitignore

Environment Variables

Frontend (frontend/.env)
VITE_BACKEND_URL=https://<your-backend>.onrender.com

Backend (backend/.env)
PORT=4000
REDIS_URL=redis://<render-redis-url>
JUPITER_API_KEY=your_api_key_here

Do not commit .env files. Only commit .env.example.

Running Locally

Clone the repository
git clone https://github.com/
<your-username>/<repo-name>.git
cd <repo-name>

Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

Backend runs on http://localhost:4000

Frontend setup
cd frontend
npm install
cp .env.example .env
npm run dev

Frontend runs on http://localhost:5173

API Endpoints

Fetch tokens
GET /api/tokens?page=1&timePeriod=24h

Query parameters
page – pagination
timePeriod – 1h, 24h, or 7d

Health check
GET /health
Returns a simple status response indicating the backend is running.

Key Engineering Decisions

DexScreener is used for real-time market data, while Jupiter is used for token verification and discovery.
Multiple data sources are merged and deduplicated by liquidity to ensure high-quality results.
Redis cache keys include both page number and time period to avoid stale data.
Backend normalization simplifies frontend logic and reduces UI bugs.
Missing market data is handled explicitly instead of defaulting to zero.

Future Improvements

Persist filters and sorting in the URL.
Support ascending and descending sorting.
Display fallback badges for estimated 7d data.
Add token detail pages.
Implement authentication and user watchlists.

Author

Anant Jain
Computer Science and Engineering
Full-Stack and Backend-Focused Developer

If you like this project, feel free to star the repository on GitHub.