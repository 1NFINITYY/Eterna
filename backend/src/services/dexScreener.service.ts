import axios from "axios";
import { logger } from "../utils/logger";

const BASE_URL = "https://api.dexscreener.com/latest/dex";

/**
 * 🔍 Symbol-based discovery (SAFE)
 */
export async function fetchPairsBySearch(query: string) {
  try {
    const res = await axios.get(`${BASE_URL}/search?q=${query}`);
    return res.data?.pairs ?? [];
  } catch {
    logger.warn(`DexScreener search failed for "${query}"`);
    return [];
  }
}
