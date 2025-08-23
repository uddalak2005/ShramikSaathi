import mongoose from 'mongoose';
import type {Model, Schema, Document} from "mongoose";

export interface CommunityDocument extends Document {
    title : string;
    admin : mongoose.Types.ObjectId;
    location : {
        type : string;
        coordinates : [number, number];
    }
}

const communitySchema : Schema<CommunityDocument> = new mongoose.Schema<CommunityDocument>({
    title : {
        type : String,
        required : true
    },
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    location : {
        type : {
            type : String,
            enum: ["Point"],
            required: true
        },
        coordinates : [Number],
    }
})

const Community : Model<CommunityDocument> = mongoose.model<CommunityDocument>("Community",communitySchema);

export default Community;

