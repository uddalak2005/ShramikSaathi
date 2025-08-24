import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    aadhar: String,
    role: {
        type: String,
        enum: ["worker", "employer", "NGO"],
        default: "worker",
    },
    location: {
        type: {
            type: String,
            enum: ["Point"], // must be "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
        },
    },
    rating: {
        type: Number,
        default: 1,
    },
    address: {
        type: String,
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    points: {
        type: Number,
        default: 0
    }
});
userSchema.index({ location: "2dsphere" });
const User = mongoose.model("User", userSchema);
export default User;
