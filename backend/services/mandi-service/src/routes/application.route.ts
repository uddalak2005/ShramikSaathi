import express from 'express';
import applicationController from "../controllers/application.controller.ts";
import {authMiddleware} from "../middleware/auth.middleware.ts";

const applicationRouter = express.Router();

applicationRouter.get("/applyForJob/:jobId", authMiddleware, applicationController.applyForJob);

applicationRouter.get("/acceptApplication", authMiddleware, applicationController.acceptApplication);

applicationRouter.get("/rejectApplication", authMiddleware, applicationController.rejectApplication);


export default applicationRouter;