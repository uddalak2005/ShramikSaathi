import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.ts";
import CommunityController from "../controllers/community.controller.ts";
import PostsController from "../controllers/posts.controller.ts";

const communityRouter = express.Router();

communityRouter.post("/create", authMiddleware, CommunityController.createCommunity);

communityRouter.get("/getCommunity", authMiddleware, CommunityController.getCommunity);

communityRouter.post("/createPost", authMiddleware, PostsController.createPost);

communityRouter.get("/", authMiddleware, PostsController.getAllPosts);

communityRouter.get("/resolve/:postId", authMiddleware, PostsController.resolveIssue);

export default communityRouter;