import mongoose from "mongoose";
import type {Model, Schema, Document} from "mongoose";

export interface PostInterface extends Document {
    communityId : mongoose.Types.ObjectId;
    author : mongoose.Types.ObjectId;
    content : string;
    postType : string;
    flag : string;
    status : string;
    createdAt : Date;
    updatedAt : Date;
}

const postSchema : Schema<PostInterface> = new mongoose.Schema<PostInterface>({
    communityId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Community",
        required:true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    content : String,
    postType : {
        type : String,
        enum : ["help", "common"],
        default : "common",
    },
    flag : {
        type : String,
        enum : ["hate", "no-hate"],
        default : "no-hate",
    },
    status : {
        type : String,
        enum : ["not-resolved","resolved"],
        default : "not-resolved",
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
})

const Posts : Model<PostInterface> = mongoose.model<PostInterface>("Post", postSchema);

export default Posts;