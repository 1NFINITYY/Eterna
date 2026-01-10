import Redis from "ioredis";
import { logger } from "../utils/logger";

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl ? new Redis(redisUrl) : null;

if (redis) {
  redis.on("connect", () => {
    logger.info("Redis connected");
  });

  redis.on("error", () => {
    logger.warn("Redis error – running without cache");
  });
} else {
  logger.warn("Redis disabled (no REDIS_URL)");
}
