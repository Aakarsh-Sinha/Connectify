import { postsModel } from "../models/postsModel.js";

export const postComment = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const newComment = {
      userId: req.body.userId,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
