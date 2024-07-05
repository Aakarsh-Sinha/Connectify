import express from "express";
import userRouter from "./userRoutes.js";
import postRouter from "./postRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/post", postRouter);

export default router;
