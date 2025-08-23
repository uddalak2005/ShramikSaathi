import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema = new Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: Number,
    review: String
});
const Review = mongoose.model("Review", reviewSchema);
export default Review;
