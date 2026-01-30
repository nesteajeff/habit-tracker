import express from "express";
import cors from "cors";
import habitsRouter from "./routes/habits";
import goalsRouter from "./routes/goals";
import requireUser from "./middleware/requireUser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "x-user-id"],
  })
);
app.use(express.json());
app.use(requireUser);
app.use("/habits", habitsRouter);
app.use("/goals", goalsRouter);

export default app;
