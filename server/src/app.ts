import express from "express";
import cors from "cors";
import habitsRouter from "./routes/habits";
import goalsRouter from "./routes/goals";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/habits", habitsRouter);
app.use("/goals", goalsRouter);

export default app;
