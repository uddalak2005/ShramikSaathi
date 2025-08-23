import mongoose, { Schema, Document, Model } from "mongoose";

export interface bidModel {
    bidType : string;
    offeredWage : number;
}

export interface BidDocument extends Document {
    jobId: mongoose.Types.ObjectId;
    workerId: mongoose.Types.ObjectId;
    offeredWage: number;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
    pastBids : Array<bidModel>
}

const bidSchema: Schema<BidDocument> = new Schema<BidDocument>(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        workerId: { type: mongoose.Schema.Types.ObjectId, required: true },
        offeredWage: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
        pastBids : [{
            bidType: String,
            offeredWage: Number,
        }]
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Bid: Model<BidDocument> = mongoose.model<BidDocument>("Bid", bidSchema);
export default Bid;
