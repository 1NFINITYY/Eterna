import express from "express";
import cors from "cors";
import tokenRoutes from "./routes/tokens.routes";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 REQUEST LOGGING
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ✅ MOUNT ROUTES (THIS WAS MISSING)
app.use("/api/tokens", tokenRoutes);

// ❌ OPTIONAL: 404 HANDLER (for clarity)
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
