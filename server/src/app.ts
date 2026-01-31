import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import habitsRouter from "./routes/habits";
import goalsRouter from "./routes/goals";
import requireUser from "./middleware/requireUser";
import authRouter from "./routes/auth";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
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
