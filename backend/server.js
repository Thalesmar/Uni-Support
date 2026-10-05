import express from "express";
import ticketRoutes from "./routes/ticketRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || process.env.MAIN_PORT || 8080;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://thalesmar.github.io",
  "https://thalesmar.github.io/Uni-Support",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/", ticketRoutes);
app.use("/api/", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API is running" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Listening to ${PORT}`));
}

export default app;
