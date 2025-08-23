import mongoose from "mongoose";
import {Model, Schema, Document} from "mongoose";


interface ReviewInterface extends Document{
    jobId : mongoose.Types.ObjectId;
    author : mongoose.Types.ObjectId;
    rating : number;
    review : string;
}

const reviewSchema : Schema<ReviewInterface> = new Schema<ReviewInterface>({
    jobId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    rating : Number,
    review : String
})

const Review : Model<ReviewInterface> = mongoose.model<ReviewInterface>("Review", reviewSchema);
export default Review;