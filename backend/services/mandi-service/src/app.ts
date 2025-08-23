import express from "express";
import cors from "cors";
import type {Request, Response} from "express";
import jobRouter from "./routes/jobs.route.ts";
import bidRouter from "./routes/bids.route.ts";
import applicationRouter from "./routes/application.route.ts";

const app = express();

app.use(express.json());
app.use(cors({
    origin : process.env.ORIGIN,
}));

app.use(express.urlencoded({extended: true}));

app.use("/", jobRouter);

app.use("/bids", bidRouter);

app.use("/apply", applicationRouter)

app.get("/", (req : Request, res: Response) : Response => {
    return res.send("mandi-service");
});

export default app;
