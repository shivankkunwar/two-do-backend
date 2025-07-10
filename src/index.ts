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
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// connect to DB first
connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });

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
