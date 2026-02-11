import express from "express";
import cors from "cors";
import { config } from "./config";
import { prisma } from "./config/database";
import { logger } from "./utils/logger";
import "dotenv/config";

// Middleware
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

// Routes
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import conversationRoutes from "./routes/conversations";
import walletRoutes from "./routes/wallet";
import transactionRoutes from "./routes/transactions";
import userRoutes from "./routes/user";

// -----------------------------
// Initialize app
// -----------------------------
const app = express();

// -----------------------------
// Global middleware
// -----------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowed = config.cors.allowedOrigins.includes(origin);
      if (allowed) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Request logging
app.use((req, _res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
  });
  next();
});

// -----------------------------
// Health check
// -----------------------------
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------
// API Routes (🔥 CORRECT PREFIXING)
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);

// -----------------------------
// 404 handler
// -----------------------------
app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// -----------------------------
// Error handler (🔥 MUST BE LAST)
// -----------------------------
app.use(errorHandler);
app.use(requestLogger);

// -----------------------------
// Start server
// -----------------------------
const server = app.listen(config.server.port, async () => {
  try {
    await prisma.$connect();

    logger.info("🚀 Nexis backend started", {
      port: config.server.port,
      env: config.server.env,
    });

    logger.info("Available routes", {
      auth: "/api/auth/*",
      chat: "/api/chat",
      conversations: "/api/conversations",
      wallet: "/api/wallet/*",
      transactions: "/api/transactions/*",
      user: "/api/user/*",
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
});

// -----------------------------
// Graceful shutdown
// -----------------------------
const shutdown = async (signal: string) => {
  logger.info("Shutting down server", { signal });

  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info("Database disconnected");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown", error);
      process.exit(1);
    }
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
