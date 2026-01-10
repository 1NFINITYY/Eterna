import { Router } from "express";
import { redis } from "../config/redis";
import { aggregateTokens } from "../services/aggregator.service";
import { logger } from "../utils/logger";

const router = Router();

const CACHE_TTL = 30; // seconds
const PAGE_SIZE = 20;

router.get("/", async (req, res) => {
  try {
    // -----------------------------
    // 1️⃣ Read params
    // -----------------------------
    const page = Math.max(Number(req.query.page) || 1, 1);

    const timePeriod =
      req.query.timePeriod === "1h" ||
      req.query.timePeriod === "7d"
        ? req.query.timePeriod
        : "24h";

    // 🔍 DEBUG LOG (IMPORTANT)
    logger.info(
      `REQ → page=${page}, timePeriod=${timePeriod}`
    );

    const cacheKey = `tokens:discover:${timePeriod}:page:${page}`;

    // -----------------------------
    // 2️⃣ Try cache first
    // -----------------------------
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          logger.info(
            `Cache HIT (${timePeriod}, page ${page})`
          );
          return res.json(JSON.parse(cached));
        }
        logger.info(
          `Cache MISS (${timePeriod}, page ${page})`
        );
      } catch (err) {
        logger.warn("Redis read failed, skipping cache");
      }
    }

    // -----------------------------
    // 3️⃣ Fetch tokens (REAL CALL)
    // -----------------------------
    const data = await aggregateTokens(
      page,
      PAGE_SIZE,
      timePeriod
    );

    // -----------------------------
    // 4️⃣ Save to cache
    // -----------------------------
    if (redis) {
      try {
        await redis.set(
          cacheKey,
          JSON.stringify(data),
          "EX",
          CACHE_TTL
        );
        logger.info(
          `Cache SET (${timePeriod}, page ${page})`
        );
      } catch (err) {
        logger.warn("Redis write failed, skipping cache");
      }
    }

    res.json(data);
  } catch (err) {
    logger.error("Token route failed", err);
    res.status(500).json({
      message: "Failed to fetch tokens"
    });
  }
});

export default router;
