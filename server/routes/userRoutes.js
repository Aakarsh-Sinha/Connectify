import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userModel.js";
import { postsModel } from "../models/postsModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { friendsModel } from "../models/friendsModel.js";
import { requestsModel } from "../models/requestsModel.js";
const router = express.Router();
dotenv.config();

const jwtsecret = process.env.JWT_SECRET;
const signupbody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
  username: zod.string(),
});

router.post("/signup", async (req, res) => {
  try {
    const { success } = signupbody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "incorrect input",
      });
    }
    const existinguser = await userModel.findOne({
      username: req.body.username,
    });
    if (existinguser) {
      return res.status(411).json({
        message: "username already taken",
      });
    }
    const newUser = await userModel.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });

    const userId = newUser._id;
    await requestsModel.create({
      userId: userId,
      requests: [],
    });
    await friendsModel.create({
      userId: userId,
      friends: [],
    });
    const token = jwt.sign(
      {
        userId,
      },
      jwtsecret
    );

    res.status(200).json({
      message: "User created Successfully",
      token: token,
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({
      message: "error while signing up",
    });
  }
});

const signinbody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  try {
    const { success, data } = signinbody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Incorrect input", errors: data });
    }

    const { username, password } = data;

    const user = await userModel.findOne({ username, password });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or credentials incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, jwtsecret);

    res.json({
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error while signing in:", error);
    res
      .status(500)
      .json({ message: "Error while signing in", error: error.message });
  }
});

// router.post('/signin',async(req,res)=>{

//     try{
//         const {success}=signinbody.safeParse(req.body);
//         if(!success){
//             return res.status(411).json({
//                 message:"incorrect input"
//             })
//         }
//         const user=await userModel.findOne({
//             username:req.body.username,
//             password:req.body.password
//         });
//         const userId=user._id;
//         if(user){
//             const token=jwt.sign({
//                 userId:user._id
//             },jwtsecret);

//             res.json({
//                 token:token,
//                 userId:userId
//             })
//             return;
//         }

//         res.status(411).json({
//             message:"Error"
//         })
//     }catch(error){
//         res.status(500).json({
//             message:"error while signing in"
//         })
//     }

// });

router.post("/createpost", authMiddleware, async (req, res) => {
  try {
    const userId = req.headers.userid;
    console.log(userId);
    //this part in middleware:
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing in headers" });
    }
    const user = await userModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { base64 } = req.body;
    const newpost = await postsModel.create({
      userId: userId,
      likes: 0,
      caption: req.body.caption,
      username: user.username,
      image: base64,
    });
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
});

router.get("/getposts", authMiddleware, async (req, res) => {
  try {
    console.log("WE");
    const userId = req.headers.userid;

    console.log("WE");
    const friends = await friendsModel.findOne({
      userId: userId,
    });
    console.log("WE");
    if (!friends) {
      return res.status(411).json({
        message: "Add friends to see their posts on your feed",
      });
    }

    const friendsArray = friends.friends;
    const posts = await postsModel.find({ userId: { $in: friendsArray } });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "error getting the posts",
    });
  }
});

router.post("/sendrequest", authMiddleware, async (req, res) => {
  const userId = req.headers["userid"];
  const { to } = req.body;
  console.log(to);
  const existingRequest = await requestsModel.findOne({
    userId: to,
    requests: userId,
  });

  if (existingRequest) {
    return res.status(400).json({
      message: "Request already sent",
    });
  }

  await requestsModel.updateOne(
    { userId: to },
    { $push: { requests: userId } }
  );
  return res.status(200).json({
    message: "request sent successfully",
  });
});

router.post("/acceptrequest", authMiddleware, async (req, res) => {
  try {
    const userId = req.headers["userid"];
    const { from } = req.body;

    if (!userId || !from) {
      return res.status(400).json({ message: "userId and from are required" });
    }

    const request = await requestsModel.findOne({
      userId: userId,
      requests: from,
    });

    if (!request) {
      return res.status(400).json({
        message: "No request from this user",
      });
    }

    await requestsModel.updateOne(
      { userId: userId },
      { $pull: { requests: from } }
    );
    await friendsModel.updateOne(
      { userId: userId },
      { $addToSet: { friends: from } },
      { upsert: true }
    );
    await friendsModel.updateOne(
      { userId: from },
      { $addToSet: { friends: userId } },
      { upsert: true }
    );

    return res.status(200).json({
      message: "Request accepted",
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    return res.status(500).json({ message: "Error accepting request" });
  }
});

export default router;
