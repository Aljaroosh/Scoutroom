import playerRoutes from "./routes/playerRoutes.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ScoutRoom API is running",
  });
});
app.use("/api/players", playerRoutes);
app.use("/api/payments", paymentRoutes);
export default app;