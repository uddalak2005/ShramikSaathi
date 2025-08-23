import mongoose, { Schema } from "mongoose";
const bidSchema = new Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    offeredWage: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    pastBids: [{
            bidType: String,
            offeredWage: Number,
        }]
}, { timestamps: { createdAt: true, updatedAt: false } });
const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
