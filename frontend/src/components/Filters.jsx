import { useState } from "react";

export default function Filters({
  onSort,
  timePeriod,
  onTimeChange
}) {
  const [open, setOpen] = useState(false);

  const periods = ["1h", "24h", "7d"];

  function handleSort(type) {
    onSort(type);
    setOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* ⏱ Time period buttons */}
      <div className="flex gap-2">
        {periods.map(p => (
          <button
            key={p}
            onClick={() => onTimeChange(p)}
            className={`px-3 py-1 rounded text-sm transition
              ${
                timePeriod === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 🔽 Sort dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="px-4 py-1.5 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-2"
        >
          Sort
          <span className="text-xs opacity-70">▼</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded shadow-lg z-20">
            <button
              onClick={() => handleSort("volume")}
              className="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Volume
            </button>
            <button
              onClick={() => handleSort("price")}
              className="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Price
            </button>
            <button
              onClick={() => handleSort("market_cap")}
              className="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Market Cap
            </button>
            <button
              onClick={() => handleSort("liquidity")}
              className="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Liquidity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
