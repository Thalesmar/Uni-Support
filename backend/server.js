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
// Vercel injects its own PORT, while local dev can still use MAIN_PORT.
const PORT = process.env.PORT || process.env.MAIN_PORT || 8080;

// Reads JSON bodies on POST/PATCH (req.body).
app.use(express.json());

// Allow requests from local development, GitHub Pages, and Vercel deployments.
const configuredOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://thalesmar.github.io",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (configuredOrigins.includes(origin)) return true;

  return origin.endsWith(".vercel.app") || origin.includes("vercel.app");
};

// Allow the frontend app to call this API and send cookies.
app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Turns the Cookie header into req.cookies so auth middleware can read `token`.
app.use(cookieParser());


app.use("/api/", ticketRoutes);
app.use("/api/", authRoutes);

app.use("/api/admin", adminRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Listening to ${PORT}`));
}

export default app;