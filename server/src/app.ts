import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import habitsRouter from "./routes/habits";
import goalsRouter from "./routes/goals";
import requireUser from "./middleware/requireUser";
import authRouter from "./routes/auth";

const app = express();

const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "x-user-id"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use(requireUser);
app.use("/habits", habitsRouter);
app.use("/goals", goalsRouter);

export default app;
