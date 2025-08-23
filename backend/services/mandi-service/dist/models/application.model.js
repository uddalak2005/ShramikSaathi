import mongoose, { Schema } from "mongoose";
const ApplicationSchema = new Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    agreedWage: { type: Number, required: true },
    status: {
        type: String,
        enum: ["assigned", "completed", "cancelled", "rejected"],
        default: "assigned",
    },
}, { timestamps: true });
const Application = mongoose.model("Application", ApplicationSchema);
export default Application;
