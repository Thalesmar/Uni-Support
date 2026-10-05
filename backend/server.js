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
// MAIN_PORT comes from backend/.env (1337). 8080 is only a fallback.
const PORT = process.env.MAIN_PORT || 8080;

// Reads JSON bodies on POST/PATCH (req.body).
app.use(express.json());

// Allow the Vite app (port 5173) to call this API and send cookies.
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
// Turns the Cookie header into req.cookies so auth middleware can read `token`.
app.use(cookieParser());


app.use("/api/", ticketRoutes);
app.use("/api/", authRoutes);

app.use("/api/admin", adminRoutes);


app.listen(PORT, () => console.log(`Listening to ${PORT}`));
