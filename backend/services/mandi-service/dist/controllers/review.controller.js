import Job from "../models/job.model.js";
import Review from "../models/review.model.js";
import Bid from "../models/bid.model.js";
import amqp from "amqplib";
class ReviewController {
    constructor() {
        this.publishReview = this.publishReview.bind(this);
        this.userFeedback = this.userFeedback.bind(this);
    }
    async publishReview(review) {
        const REVIEW_OUEUE = "review.update";
        const RABBIT_URL = process.env.RABBIT_URL;
        console.log(RABBIT_URL);
        const connection = await amqp.connect(RABBIT_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(REVIEW_OUEUE, { durable: true });
        const msg = JSON.stringify(review);
        channel.sendToQueue(REVIEW_OUEUE, Buffer.from(msg), { persistent: true });
        console.log("New Review Added to Queue");
        await channel.close();
        await connection.close();
    }
    async userFeedback(req, res) {
        try {
            if (req.user && req.user.role === "worker") {
                return res.status(401).send("Unauthorized");
            }
            const { jobId, rating, review } = req.body;
            const employerId = req.user?.id;
            const job = await Job.findOne({
                _id: jobId,
                employerId,
                status: { $in: ["completed", "assigned"] }
            });
            if (!job) {
                return res.status(400).send("No Jobs found to be reviewed");
            }
            const existingReview = await Review.findOne({ jobId, author: employerId });
            const bid = await Bid.findOne({ jobId });
            if (!bid) {
                return res.status(400).send("No Bid found for this job");
            }
            const workerId = String(bid.workerId);
            if (existingReview) {
                existingReview.review = review;
                existingReview.rating = rating;
                await existingReview.save();
                await this.publishReview({
                    jobId,
                    workerId,
                    author: employerId,
                    rating
                });
                return res.status(201).json({
                    message: "Review has been updated",
                });
            }
            else {
                const newReview = await Review.create({
                    jobId: jobId,
                    rating: rating,
                    review: review,
                    author: employerId
                });
                await this.publishReview({
                    jobId,
                    workerId,
                    author: employerId,
                    rating
                });
                return res.status(201).json({
                    message: "Review has been added successfully",
                });
            }
        }
        catch (err) {
            const error = err;
            console.error(error.message);
            return res.status(500).send("Internal Server Error");
        }
    }
}
export default new ReviewController();
