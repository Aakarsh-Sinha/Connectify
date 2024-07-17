import express from "express";
import {
  createpost,
  getposts,
  userposts,
  likePost,
} from "../controllers/postsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/like/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = req.headers.userid;
  console.log(postId);
  console.log(userId);

  try {
    const result = await likePost(postId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/createpost", authMiddleware, createpost);
router.get("/getposts", authMiddleware, getposts);
router.get("/userposts", authMiddleware, userposts);

export default router;
