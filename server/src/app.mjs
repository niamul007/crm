/**
 * APP.MJS — SERVER ENTRY POINT
 * -----------------------------
 * This is the first file Node.js runs.
 * It creates the Express app, wires up middleware,
 * mounts routes, and starts the server.
 * 
 * MIDDLEWARE ORDER MATTERS:
 * 1. cors()         → must be first, before any request is processed
 * 2. express.json() → parses req.body, must be before routes
 * 3. routes         → actual endpoint handlers
 * 4. 404 handler    → catches anything routes didn't match
 * 5. errorHandler   → must be LAST, catches all errors from above
 */

import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoute.mjs";
import authRoutes from "./routes/auth.mjs";
import dotenv from "dotenv";
import { globalErrorHandler } from "./middleware/errorMiddleware.mjs";
dotenv.config();

const app = express();

/**
 * CORS CONFIGURATION
 * ------------------
 * Browsers block requests between different origins by default.
 * We whitelist our frontend URLs here.
 * process.env.FRONTEND_URL → production Vercel URL
 * localhost:5173 → Vite dev server
 * 
 * credentials: true → required for sending Authorization header
 */
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Parses incoming JSON bodies into req.body
// Without this req.body would be undefined
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ─── ROUTES ──────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);

// ─── HEALTH CHECK ────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.send("Health check: OK");
});

// ─── 404 HANDLER ─────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────
// Must be LAST — catches all errors passed via next(err)
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});