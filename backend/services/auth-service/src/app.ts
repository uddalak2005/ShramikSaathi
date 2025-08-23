import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.ts";
import type {Request, Response} from "express";
import {updateRating} from "./utils/rating.util.ts";
import {updateReward} from "./utils/reward.util.ts";

const app = express();

app.use(express.json());
app.use(cors({
    origin : process.env.ORIGIN,
}));

app.use(express.urlencoded({extended: true}));


//Listening to RabbitMQ
updateRating().catch(console.error);
updateReward().catch(console.error);

app.use((req, res, next) => {
    console.log("Request received:", req.method, req.path, req.headers);
    next();
});

app.get("/", (req : Request, res: Response) : Response => {
    return res.send("auth-service");
});

app.use("/", authRouter);



export default app;
