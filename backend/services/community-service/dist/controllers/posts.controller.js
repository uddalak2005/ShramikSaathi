import Joi from "joi";
import Posts from "../models/posts.model.js";
import mongoose from "mongoose";
import Community from "../models/community.model.js";
import amqp from "amqplib";
class PostsController {
    postValidationSchema;
    constructor() {
        this.postValidationSchema = Joi.object({
            content: Joi.string().min(5).max(1000).required(),
            postType: Joi.string().valid("help", "common").default("common").optional(),
        });
        this.createPost = this.createPost.bind(this);
        this.updatePoints = this.updatePoints.bind(this);
        this.getAllPosts = this.getAllPosts.bind(this);
        this.resolveIssue = this.resolveIssue.bind(this);
    }
    async updatePoints(userDetails) {
        const RABBIT_URL = process.env.RABBIT_URL;
        const REWARD_QUEUE = "user.reward";
        const connection = await amqp.connect(RABBIT_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(REWARD_QUEUE, { durable: true });
        const message = JSON.stringify({ userDetails });
        channel.sendToQueue(REWARD_QUEUE, Buffer.from(message), { persistent: true });
        console.log("Sent reward message:", message);
    }
    async createPost(req, res) {
        try {
            // 1. Validate input
            const { error, value } = this.postValidationSchema.validate(req.body, {
                abortEarly: false, // collect all errors
                stripUnknown: true, // remove extra fields
            });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    details: error.details.map((err) => err.message),
                });
            }
            const userId = req.user?.id;
            const userCollection = mongoose.connection.collection("users");
            const user = await userCollection.findOne({ _id: new mongoose.Types.ObjectId(userId) });
            if (!user) {
                return res.status(400).json({
                    error: "User does not exist",
                });
            }
            const communityId = new mongoose.Types.ObjectId(user?.communityId);
            const author = new mongoose.Types.ObjectId(userId);
            // 2. Save post
            const newPost = new Posts({
                communityId,
                author,
                ...value,
            });
            await newPost.save();
            return res.status(201).json({
                newPost
            });
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
            });
        }
    }
    async getAllPosts(req, res) {
        try {
            const userID = new mongoose.Types.ObjectId(req.user?.id);
            const userCollection = mongoose.connection.collection("users");
            await userCollection.createIndex({ location: "2dsphere" });
            const user = await userCollection.findOne({ _id: userID });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const communityId = user?.communityId;
            let posts;
            posts = await Posts.find({ communityId });
            const community = await Community.findOne({ _id: new mongoose.Types.ObjectId(communityId) });
            if (!community) {
                return res.status(404).json({ message: "Community not found" });
            }
            if (!posts) {
                posts = [];
            }
            return res.status(200).json({
                community,
                posts,
            });
        }
        catch (err) {
            const error = err;
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
    async resolveIssue(req, res) {
        try {
            const { postId } = req.params;
            if (!postId) {
                return res.status(400).json({ message: "Post Id not found" });
            }
            const post = await Posts.findOne({ _id: postId });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            if (post?.author === new mongoose.Types.ObjectId(req.user?.id)) {
                return res.status(200).send("unauthorized to resolve post");
            }
            if (post?.postType === "help") {
                post.status = "resolved";
            }
            await post.save();
            await this.updatePoints({
                userId: req.user?.id,
            });
            return res.status(200).json({ message: "Issue Resolved" });
        }
        catch (err) {
            const error = err;
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}
export default new PostsController();
