import express from "express";
import cors from "cors";
import habitsRouter from "./routes/habits";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/habits", habitsRouter);

export default app;
