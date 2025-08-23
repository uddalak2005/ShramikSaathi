import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import NotificationController from "./controller/notification.controller.ts";


const app = express();

app.use(cors({
    origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



await NotificationController.notificationConsumerForJobAlert();

app.get("/", (req : Request, res : Response) => {
    res.send("notification service");
});

export default app;