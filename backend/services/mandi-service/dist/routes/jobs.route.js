import express from 'express';
import authController from '../controllers/jobs.controller.js';
import reviewController from '../controllers/review.controller.js';
import { authMiddleware } from "../middleware/auth.middleware.js";
const jobRouter = express.Router();
jobRouter.post("/createJob", authMiddleware, authController.createJob);
jobRouter.get("/getJobs", authMiddleware, authController.getNearbyJobs);
jobRouter.post("/review", authMiddleware, reviewController.userFeedback);
export default jobRouter;
