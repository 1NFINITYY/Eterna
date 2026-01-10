import { useEffect } from "react";

export default function TokenTable({ tokens, setTokens }) {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No tokens found
      </div>
    );
  }

  // 🔥 Clear flash after animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTokens(prev =>
        prev.map(t => ({
          ...t,
          _flash: false,
          _flashDir: null
        }))
      );
    }, 350);

    return () => clearTimeout(timeout);
  }, [tokens, setTokens]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-900 sticky top-0">
          <tr>
            <th className="px-4 py-3">Token</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">Liquidity</th>
            <th className="px-4 py-3">Volume (24h)</th>
            <th className="px-4 py-3">1h %</th>
            <th className="px-4 py-3">DEX</th>
          </tr>
        </thead>

        <tbody>
          {tokens.map(token => (
            <tr
              key={token.token_address}
              className={`border-b border-gray-800 transition-colors duration-300
                ${
                  token._flash
                    ? token._flashDir === "up"
                      ? "bg-green-900/30"
                      : "bg-red-900/30"
                    : "hover:bg-gray-900"
                }`}
            >
              {/* Token */}
              <td className="px-4 py-3 font-semibold">
                {token.token_name}
                <span className="ml-2 text-xs text-gray-400">
                  ({token.token_ticker})
                </span>
              </td>

              {/* Price */}
              <td
                className={`px-4 py-3 font-mono ${
                  token._flash
                    ? token._flashDir === "up"
                      ? "text-green-400"
                      : "text-red-400"
                    : ""
                }`}
              >
                {token.price_usd
                  ? `$${token.price_usd.toFixed(6)}`
                  : "-"}
              </td>

              {/* Market Cap */}
              <td className="px-4 py-3">
                {formatNumber(token.market_cap_usd)}
              </td>

              {/* Liquidity */}
              <td className="px-4 py-3">
                {formatNumber(token.liquidity_usd)}
              </td>

              {/* Volume */}
              <td className="px-4 py-3">
                {formatNumber(token.volume_24h)}
              </td>

              {/* 1h Change */}
              <td
                className={`px-4 py-3 font-semibold ${
                  token.price_change_1h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {token.price_change_1h?.toFixed(2)}%
              </td>

              {/* Protocol */}
              <td className="px-4 py-3 uppercase text-xs">
                {token.protocol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------- helpers -------- */

function formatNumber(value) {
  if (!value || value === 0) return "-";
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}
