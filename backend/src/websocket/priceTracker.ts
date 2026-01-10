import { aggregateTokens } from "../services/aggregator.service";
import { logger } from "../utils/logger";

let lastSnapshot = new Map<string, number>();

export async function trackPriceChanges(io: any) {
  try {
    const tokens = await aggregateTokens();

    const updates: any[] = [];

    tokens.forEach(token => {
      const prevPrice = lastSnapshot.get(token.token_address);
      const currPrice = token.price_usd;

      if (
        prevPrice !== undefined &&
        currPrice !== null &&
        prevPrice !== currPrice
      ) {
        updates.push({
          token_address: token.token_address,
          price_usd: currPrice,
          price_change_1h: token.price_change_1h
        });
      }

      if (currPrice !== null) {
        lastSnapshot.set(token.token_address, currPrice);
      }
    });

    if (updates.length > 0) {
      logger.info(`Emitting ${updates.length} price updates`);
      io.emit("price-updates", updates);
    }
  } catch (err) {
    logger.warn("Price tracker failed");
  }
}
