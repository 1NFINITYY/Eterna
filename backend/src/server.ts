import "dotenv/config";
import http from "http";
import app from "./app";
import { initSocket } from "./websocket/socket";
import { logger } from "./utils/logger";

const server = http.createServer(app);
initSocket(server);

server.listen(4000, () => {
  logger.info("Backend running on http://localhost:4000");
});
