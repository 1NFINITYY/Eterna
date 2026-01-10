import { useEffect, useState, useCallback } from "react";
import { fetchTokens } from "../services/api";
import { useSocket } from "../hooks/useSocket";
import TokenTable from "../components/TokenTable";
import Filters from "../components/Filters";

export default function Discover() {
  const [tokens, setTokens] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [timePeriod, setTimePeriod] = useState("24h");
  const [animate, setAnimate] = useState(false);

  // -----------------------------
  // 1️⃣ Fetch tokens (single source of truth)
  // -----------------------------
  const loadPage = useCallback(
    async (pageToLoad, reset = false) => {
      setLoading(true);
      try {
        const data = await fetchTokens(pageToLoad, timePeriod);

        setTokens(prev => {
          if (reset) return data;

          // 🔥 Deduplicate
          const map = new Map(
            prev.map(t => [t.token_address, t])
          );
          data.forEach(t =>
            map.set(t.token_address, t)
          );
          return Array.from(map.values());
        });
      } finally {
        setLoading(false);

        // ✨ subtle animation
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
      }
    },
    [timePeriod]
  );

  // ✅ SINGLE effect: initial load + timePeriod change
  useEffect(() => {
    setTokens([]);
    setPage(1);
    loadPage(1, true);
  }, [timePeriod, loadPage]);

  // -----------------------------
  // 2️⃣ WebSocket updates (1h only)
  // -----------------------------
  useSocket(update => {
    if (timePeriod !== "1h") return;

    setTokens(prev =>
      prev.map(t =>
        t.token_address === update.token_address
          ? { ...t, ...update }
          : t
      )
    );
  });

  // -----------------------------
  // 3️⃣ Sorting
  // -----------------------------
  useEffect(() => {
    if (!sortBy) return;

    setTokens(prev => {
      const sorted = [...prev];

      switch (sortBy) {
        case "volume":
          sorted.sort(
            (a, b) => (b.volume ?? 0) - (a.volume ?? 0)
          );
          break;

        case "price":
          sorted.sort(
            (a, b) => (b.price_usd ?? 0) - (a.price_usd ?? 0)
          );
          break;

        case "market_cap":
          sorted.sort(
            (a, b) =>
              (b.market_cap_usd ?? 0) -
              (a.market_cap_usd ?? 0)
          );
          break;

        case "liquidity":
          sorted.sort(
            (a, b) =>
              (b.liquidity_usd ?? 0) -
              (a.liquidity_usd ?? 0)
          );
          break;

        default:
          break;
      }

      return sorted;
    });
  }, [sortBy]);

  function handleSort(type) {
    setSortBy(type);
  }

  // -----------------------------
  // 4️⃣ Time period change
  // -----------------------------
  function handleTimeChange(period) {
    if (period === timePeriod) return;
    setTimePeriod(period);
  }

  // -----------------------------
  // 5️⃣ Load more
  // -----------------------------
  async function handleLoadMore() {
    if (loading) return;
    const nextPage = page + 1;
    await loadPage(nextPage);
    setPage(nextPage);
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">
        Discover Tokens
      </h1>

      <Filters
        onSort={handleSort}
        timePeriod={timePeriod}
        onTimeChange={handleTimeChange}
      />

      {/* 🔄 Soft loading indicator */}
      {loading && (
        <div className="mb-2 text-sm text-gray-400 animate-pulse">
          Updating {timePeriod} data…
        </div>
      )}

      {/* ✨ Fade-in table */}
      <div
        className={`transition-opacity duration-200 ${
          animate ? "opacity-60" : "opacity-100"
        }`}
      >
        <TokenTable tokens={tokens} />
      </div>

      {/* Load more */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="px-6 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 transition"
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      </div>
    </div>
  );
}
