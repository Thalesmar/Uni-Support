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

// Allow requests from your local dev environment AND your GitHub Pages domain
const allowedOrigins = [
  "http://localhost:5173",
  "https://thalesmar.github.io",
];

// Allow the Vite app (port 5173) to call this API and send cookies.
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for sending cookies/JWT headers
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