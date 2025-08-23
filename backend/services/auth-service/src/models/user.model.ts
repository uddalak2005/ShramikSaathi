import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    password: string;
    aadhar?: string;
    role: "worker" | "employer" | "NGO";
    location: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };
    address?: string;
    communityId : mongoose.Types.ObjectId;
    rating: number;
    points : number;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
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
    communityId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    points : {
        type : Number,
        default : 0
    }
});

userSchema.index({ location: "2dsphere" });

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
