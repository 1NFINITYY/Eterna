import fetch from "node-fetch";
import { logger } from "../utils/logger";

export interface JupiterToken {
  address: string;   // ✅ matches aggregator
  symbol: string;    // ✅ matches aggregator
  name: string;
  decimals: number;
  chainId: "solana";
}

const JUPITER_BASE_URL = "https://api.jup.ag";
const JUPITER_API_KEY = process.env.JUPITER_API_KEY || "";

export async function fetchJupiterVerifiedTokens(): Promise<JupiterToken[]> {
  const url = `${JUPITER_BASE_URL}/tokens/v2/tag?query=verified`;

  logger.info("[JUPITER] Fetching verified tokens");
  logger.info(`[JUPITER] URL: ${url}`);
  logger.info(`[JUPITER] API key present: ${Boolean(JUPITER_API_KEY)}`);

  const res = await fetch(url, {
    headers: {
      "x-api-key": JUPITER_API_KEY, // same as your friend
      "accept": "application/json",
      "user-agent": "Mozilla/5.0"
    }
  });

  logger.info(`[JUPITER] Status: ${res.status}`);

  const raw = await res.text();
  logger.info(
    `[JUPITER] Raw response (first 800 chars)}`
  );

  if (!res.ok) {
    throw new Error(`Jupiter token API failed (${res.status})`);
  }

  const json = JSON.parse(raw);

  if (!Array.isArray(json)) {
    throw new Error("Unexpected Jupiter response format");
  }

  logger.info(`[JUPITER] Tokens received: ${json.length}`);

  // 🔥 KEY PART: SHAPE MATCHES AGGREGATOR
  return json.map((t: any) => ({
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
    chainId: "solana"
  }));
}
