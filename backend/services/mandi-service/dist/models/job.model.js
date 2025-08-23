import mongoose, { Schema } from "mongoose";
const jobSchema = new Schema({
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
        required: true
    },
    ngoId: { type: String },
    status: {
        type: String,
        enum: ["open", "assigned", "completed", "cancelled", "rejected"],
        default: "open",
    },
}, { timestamps: true });
// Add 2dsphere index for geo queries
jobSchema.index({ location: "2dsphere" });
const Job = mongoose.model("Job", jobSchema);
export default Job;
