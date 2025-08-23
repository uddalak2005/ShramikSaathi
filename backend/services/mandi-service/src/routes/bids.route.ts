import express from 'express';
import bidController from "../controllers/bid.controller.ts";
import {authMiddleware} from "../middleware/auth.middleware.ts";

const  bidRouter  = express.Router();


bidRouter.post("/createBid", authMiddleware, bidController.placeOrUpdateBid);

bidRouter.get("/acceptBid/:bidId", authMiddleware, bidController.acceptBid);

bidRouter.get("/rejectBid/:bidId", authMiddleware, bidController.rejectBid);


export default bidRouter;