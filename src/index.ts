import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/mongo";
import todoRouter from "./routes/todo.routes"
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));

// Rate limiting - more lenient in development
const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // 5 login attempts in prod, 50 in dev
  message: { error: "Too many login attempts, please try again later." }
});

const refreshLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 10 : 100, // 10 refresh attempts per minute in prod, 100 in dev
  message: { error: "Too many refresh attempts, please try again later." }
});

// connect to DB first
connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });

// Apply rate limiting to specific auth routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/refresh", refreshLimiter);

// mount routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/todos",todoRouter)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
