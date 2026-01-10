import { fetchPairsBySearch } from "./dexScreener.service";
import {
  fetchJupiterVerifiedTokens,
  JupiterToken
} from "./jupiter.service";
import { SEED_TOKENS } from "../constants/seeds";
import { logger } from "../utils/logger";

export async function aggregateTokens(
  page: number = 1,
  limit: number = 20,
  timePeriod: "1h" | "24h" | "7d" = "24h"
) {
  logger.info(
    `Aggregating tokens page=${page} period=${timePeriod}`
  );

  const offset = (page - 1) * limit;

  // -----------------------------
  // 1️⃣ Jupiter tokens
  // -----------------------------
  let jupiterTokens: JupiterToken[] = [];
  try {
    jupiterTokens = (await fetchJupiterVerifiedTokens()).slice(0, 10);
  } catch {
    logger.warn("Jupiter token fetch failed");
  }

  // -----------------------------
  // 2️⃣ DexScreener pairs
  // -----------------------------
  const [seedResults, jupiterResults] = await Promise.all([
    Promise.all(SEED_TOKENS.map(t => fetchPairsBySearch(t))),
    Promise.all(jupiterTokens.map(t => fetchPairsBySearch(t.address)))
  ]);

  const dexPairs = [
    ...seedResults.flat(),
    ...jupiterResults.flat()
  ];

  // -----------------------------
  // 3️⃣ Deduplication
  // -----------------------------
  const map = new Map<string, any>();

  dexPairs.forEach(pair => {
    if (!pair?.baseToken?.address) return;

    const address = pair.baseToken.address;
    const liquidity = pair.liquidity?.usd ?? 0;

    const existing = map.get(address);
    if (existing && existing.liquidity_usd > liquidity) return;

    const volume_1h = pair.volume?.h1 ?? 0;
    const volume_24h = pair.volume?.h24 ?? 0;
    const volume_7d = pair.volume?.h7 ?? 0;

    const price_change_1h = pair.priceChange?.h1 ?? 0;
    const price_change_24h = pair.priceChange?.h24 ?? 0;
    const price_change_7d = pair.priceChange?.h7 ?? 0;

    map.set(address, {
      token_address: address,
      token_name: pair.baseToken.name,
      token_ticker: pair.baseToken.symbol,

      price_usd: Number(pair.priceUsd) || null,
      market_cap_usd: pair.marketCap ?? pair.fdv ?? 0,
      liquidity_usd: liquidity,

      volume_1h,
      volume_24h,
      volume_7d,

      price_change_1h,
      price_change_24h,
      price_change_7d,

      // normalized (frontend uses these)
      volume:
        timePeriod === "1h"
          ? volume_1h
          : timePeriod === "7d"
          ? volume_7d
          : volume_24h,

      price_change:
        timePeriod === "1h"
          ? price_change_1h
          : timePeriod === "7d"
          ? price_change_7d
          : price_change_24h,

      txns_1h:
        (pair.txns?.h1?.buys ?? 0) +
        (pair.txns?.h1?.sells ?? 0),

      protocol: pair.dexId,
      chain: pair.chainId
    });
  });

  let tokens = Array.from(map.values());

  // -----------------------------
  // 4️⃣ Ranking (UNCHANGED)
  // -----------------------------
  tokens.sort((a, b) => {
    const scoreA =
      a.volume_1h * 0.6 +
      Math.abs(a.price_change_1h) * 0.25 +
      Math.log10(a.liquidity_usd + 1) * 15;

    const scoreB =
      b.volume_1h * 0.6 +
      Math.abs(b.price_change_1h) * 0.25 +
      Math.log10(a.liquidity_usd + 1) * 15;

    return scoreB - scoreA;
  });

  // -----------------------------
  // 5️⃣ Filter + pagination
  // -----------------------------
  const filtered = tokens.filter(t => t.liquidity_usd > 1_000);
  return filtered.slice(offset, offset + limit);
}
