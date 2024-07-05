import express from "express";
import { postComment } from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:postId/comments", authMiddleware, postComment);

export default router;
