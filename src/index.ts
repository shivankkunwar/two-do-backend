import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/mongo";
import todoRouter from "./routes/todo.routes"
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

app.use(express.json());

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
