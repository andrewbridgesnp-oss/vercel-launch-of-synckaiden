import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import freebiesRouter from "../routes/freebies";
import { initializeDatabase, closeDatabase } from "../db";
import { standardRateLimiter, strictRateLimiter, cleanupRateLimiter } from "./rateLimit";
import { requestId, requestLogger, errorTracker } from "./tracing";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Initialize database connection pool before starting server
  await initializeDatabase();

  const app = express();
  const server = createServer(app);
  
  // Request tracing - add request ID to all requests
  app.use(requestId());
  
  // Request logging
  app.use(requestLogger({
    skipPaths: ['/health', '/favicon.ico'],
    logBody: process.env.NODE_ENV === 'development',
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Apply rate limiting to all routes
  app.use(standardRateLimiter);
  
  // OAuth callback under /api/oauth/callback (with stricter rate limit)
  app.use("/api/oauth", strictRateLimiter);
  registerOAuthRoutes(app);
  
  // Freebies API endpoints
  app.use("/api", freebiesRouter);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Error tracking middleware (must be last)
  app.use(errorTracker());

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Graceful shutdown handler
  const shutdown = async () => {
    console.log("\nShutting down gracefully...");
    server.close(() => {
      console.log("HTTP server closed");
    });
    cleanupRateLimiter();
    await closeDatabase();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer().catch(console.error);
