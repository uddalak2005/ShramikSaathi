import express from "express";
import IvrController from "../controllers/ivr.controller.js";

const router = express.Router();

const ivrController = new IvrController();


router.post("/makeCall", ivrController.makeCall);

router.post("/intro", ivrController.outGoingIVR);

router.post("/jobDescription", ivrController.jobDescription);

router.post("/saveInterest", ivrController.saveInterest);

router.post("/bidding", ivrController.biddingOrHangUp);

router.post("/saveBid", ivrController.saveBid);

export default router;