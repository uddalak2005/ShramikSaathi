import mongoose, { Schema, Document, Model } from "mongoose";

export interface ApplicationDocument extends Document {
    jobId: mongoose.Types.ObjectId;
    workerId: mongoose.Types.ObjectId;
    agreedWage: number;
    status: "assigned" | "completed" | "cancelled" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema: Schema<ApplicationDocument> = new Schema<ApplicationDocument>(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        workerId: { type: mongoose.Schema.Types.ObjectId, required: true },
        agreedWage: { type: Number, required: true },
        status: {
            type: String,
            enum: ["assigned", "completed", "cancelled", "rejected"],
            default: "assigned",
        },
    },
    { timestamps: true }
);

const Application: Model<ApplicationDocument> = mongoose.model<ApplicationDocument>(
    "Application",
    ApplicationSchema
);
export default Application;
