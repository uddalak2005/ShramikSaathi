import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { updateRating } from "./utils/rating.util.js";
import { updateReward } from "./utils/reward.util.js";
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
}));
app.use(express.urlencoded({ extended: true }));
//Listening to RabbitMQ
updateRating().catch(console.error);
updateReward().catch(console.error);
app.use((req, res, next) => {
    console.log("Request received:", req.method, req.path, req.headers);
    next();
});
app.get("/", (req, res) => {
    return res.send("auth-service");
});
app.use("/", authRouter);
export default app;
