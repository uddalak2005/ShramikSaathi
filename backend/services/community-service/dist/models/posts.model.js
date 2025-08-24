import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: String,
    postType: {
        type: String,
        enum: ["help", "common"],
        default: "common",
    },
    flag: {
        type: String,
        enum: ["hate", "no-hate"],
        default: "no-hate",
    },
    status: {
        type: String,
        enum: ["not-resolved", "resolved"],
        default: "not-resolved",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Posts = mongoose.model("Post", postSchema);
export default Posts;
