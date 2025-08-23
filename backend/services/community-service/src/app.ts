import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import communityRouter from "./routes/community.route.ts";

const app = express();

app.use(cors({
    origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/", communityRouter);

app.get("/", (req:Request, res:Response) => {
    res.status(200).send("community service");
})

export default app;