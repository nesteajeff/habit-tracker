import express from "express";
import habitsRouter from "./routes/habits";

const app = express();

app.use(express.json());
app.use("/habits", habitsRouter);

export default app;
