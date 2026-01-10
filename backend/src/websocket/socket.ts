import { Server } from "socket.io";
import { logger } from "../utils/logger";
import { trackPriceChanges } from "./priceTracker";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", socket => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.warn(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  // 🔥 Run price tracker every 5 seconds
  setInterval(() => {
    trackPriceChanges(io);
  }, 5000);
}
