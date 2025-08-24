import express from "express";
import cors from "cors";
import communityRouter from "./routes/community.route.js";
const app = express();
app.use(cors({
    origin: "*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", communityRouter);
app.get("/", (req, res) => {
    res.status(200).send("community service");
});
export default app;
