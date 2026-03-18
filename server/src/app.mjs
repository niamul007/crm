import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoute.mjs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:8000",
    process.env.FRONTEND_URL,
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use("/api/clients", clientRoutes); // Prefix all client routes with /api/clients
// import authRoutes from "./routes/auth.mjs";
// app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World! here is the backend server of CRM");
});
app.get("/health", (req, res) => {
  res.send("Health check: OK");
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});
