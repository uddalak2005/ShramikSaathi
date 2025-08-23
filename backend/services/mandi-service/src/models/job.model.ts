import mongoose, { Schema, Document, Model } from "mongoose";

export interface JobDocument extends Document {
    type: "NGO" | "Petty";
    title: string;
    description: string;
    skillsRequired: string[];

    location: {
        type: "Point";
        coordinates: [number, number];
        address?: string;
    };

    salary?: number;
    suggestedWage?: number;
    offeredWage?: number;
    duration?: string;

    employerId: mongoose.Types.ObjectId;
    ngoId?: string;

    status: "open" | "assigned" | "completed" | "cancelled" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema: Schema<JobDocument> = new Schema<JobDocument>(
    {
        type: {
            type: String,
            enum: ["NGO", "Petty"],
        },
        title: { type: String, required: true },
        description: { type: String, required: true },

        skillsRequired: [{ type: String }],

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number], // [lng, lat]
                required: true,
            },
            address: { type: String },
        },

        salary: { type: Number },
        suggestedWage: { type: Number },
        offeredWage: { type: Number },
        duration: { type: String },

        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true },
        ngoId: { type: String },

        status: {
            type: String,
            enum: ["open", "assigned", "completed", "cancelled", "rejected"],
            default: "open",
        },
    },
    { timestamps: true }
);

// Add 2dsphere index for geo queries
jobSchema.index({ location: "2dsphere" });

const Job: Model<JobDocument> = mongoose.model<JobDocument>("Job", jobSchema);
export default Job;
