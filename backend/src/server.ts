import "dotenv/config";
import http from "http";
import app from "./app";
import { initSocket } from "./websocket/socket";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  logger.info(`Backend running on port ${PORT}`);
});
