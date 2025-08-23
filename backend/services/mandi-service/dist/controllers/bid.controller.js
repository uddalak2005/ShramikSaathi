import Bid from "../models/bid.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";
class BidController {
    // Create or Update Bid
    async placeOrUpdateBid(req, res) {
        try {
            const { jobId, offeredWage } = req.body;
            const workerId = req.user?.id;
            const job = await Job.findById(jobId);
            if (!job)
                return res.status(404).send("Job not found");
            if (job.status !== "open") {
                return res.status(400).send("Bidding closed for this job");
            }
            // Check if bid already exists for this worker & job
            let bid = await Bid.findOne({ jobId });
            if (bid) {
                // Update existing bid
                const oldWage = {
                    bidType: req.user?.role,
                    offeredWage: bid.offeredWage
                };
                bid.offeredWage = offeredWage;
                bid.workerId = new mongoose.Types.ObjectId(workerId);
                bid.status = "pending"; // reset if worker changes amount
                bid.pastBids.push(oldWage);
                const newBid = await bid.save();
            }
            else {
                // Create new bid
                bid = new Bid({ jobId, workerId, offeredWage });
                await bid.save();
            }
            return res.json(bid);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
    // Employer accepts a bid
    async acceptBid(req, res) {
        try {
            const { bidId } = req.params;
            const bid = await Bid.findById(bidId);
            if (!bid)
                return res.status(404).send("Bid not found");
            // Mark this bid as accepted
            bid.status = "accepted";
            await bid.save();
            // Reject all other bids for this job
            await Bid.updateMany({ jobId: bid.jobId, _id: { $ne: bid._id } }, { $set: { status: "rejected" } });
            // Update job status
            await Job.findByIdAndUpdate(bid.jobId, {
                status: "assigned",
                assignedWorkerId: bid.workerId,
            });
            return res.json(bid);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
    async rejectBid(req, res) {
        try {
            const { bidId } = req.params;
            const employerId = req.user?.id; // passed from authenticated user
            const bid = await Bid.findById(bidId);
            if (!bid)
                return res.status(404).send("Bid not found");
            const job = await Job.findById(bid.jobId);
            if (!job)
                return res.status(404).send("Job not found");
            // Ensure only job owner can reject
            if (job.employerId.toString() !== employerId) {
                return res.status(403).send("Not authorized to reject this bid");
            }
            // Only allow rejecting if still pending
            if (bid.status !== "pending") {
                return res.status(400).send("Only pending bids can be rejected");
            }
            bid.status = "rejected";
            await bid.save();
            return res.json(bid);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}
export default new BidController();
