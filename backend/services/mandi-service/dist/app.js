import express from "express";
import cors from "cors";
import jobRouter from "./routes/jobs.route.js";
import bidRouter from "./routes/bids.route.js";
import applicationRouter from "./routes/application.route.js";
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
}));
app.use(express.urlencoded({ extended: true }));
app.use("/", jobRouter);
app.use("/bids", bidRouter);
app.use("/apply", applicationRouter);
app.get("/", (req, res) => {
    return res.send("mandi-service");
});
export default app;
