import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { userModel } from '../models/userModel.js';
import { postsModel } from '../models/postsModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { friendsModel } from '../models/friendsModel.js';
import { requestsModel } from '../models/requestsModel.js';

const router=express.Router();
dotenv.config();

const jwtsecret = process.env.JWT_SECRET;
const signupbody=zod.object({
    email: zod.string().email(),
    password:zod.string(),
    username:zod.string()
});

router.post('/signup',async (req,res)=>{
    try{
       const {success}=signupbody.safeParse(req.body);
       if(!success){
        return res.status(411).json({
            message:"incorrect input"
        })
       }
       const existinguser=await userModel.findOne({
            username:req.body.username
       })
       if(existinguser){
            return res.status(411).json({
                message:"username already taken"
            })
       }
       const newUser=await userModel.create({
            email:req.body.email,
            password:req.body.password,
            username:req.body.username
       });
 
        const userId=newUser._id;
        await requestsModel.create({
            userId:userId,
            requests:[]
        });
        await friendsModel.create({
            userId:userId,
            friends:[]
        })
       const token=jwt.sign({
            userId
        },jwtsecret);

        res.status(200).json({
            message:"User created Successfully",
            token:token,
            userId:userId
        })
    }catch(error){
        res.status(500).json({
            message:"error while signing up"
        });
    }
    
});

const signinbody=zod.object({
    username:zod.string(),
    password:zod.string()
});
router.post('/signin',async(req,res)=>{

    try{
        const {success}=signinbody.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message:"incorrect input"
            })
        }
        const user=await userModel.findOne({
            username:req.body.username,
            password:req.body.password
        });
        const userId=user._id;
        if(user){
            const token=jwt.sign({
                userId:user._id
            },jwtsecret);

            res.json({
                token:token,
                userId:userId
            })
            return;
        }

        res.status(411).json({
            message:"Error"
        })
    }catch(error){
        res.status(500).json({
            message:"error while signing in"
        })
    }
   
});

router.post('/createpost',authMiddleware,async(req,res)=>{
    try{
        const userId = req.headers.userid;
        console.log(userId);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID missing in headers' });
        }
        const user=await userModel.findOne({
            _id:userId
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const {base64}=req.body;
        const newpost=await postsModel.create({
            userId:userId,
            likes:0,
            caption:req.body.caption,
            username:user.username,
            image:base64
        });
        res.status(201).json({ message: 'Post created successfully'});
    }catch(error){
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }

});

router.get('/getusers', async (req, res) => {
    try {
        const userId = req.headers.userid; 
        const users = await userModel.find({ _id: { $ne: userId } });

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/getposts',authMiddleware,async(req,res)=>{
    try{
        const userId = req.headers.userid;
        const friends=await friendsModel.findOne({
            userId:userId
        });
        if(!friends){
            return res.status(411).json({
                message:"Add friends to see their posts on your feed"
            })
        };
        
        const friendsArray = friends.friends;
        const posts = await postsModel.find({ userId: { $in: friendsArray } });
        return res.status(200).json(posts);
    }catch(error){
        return res.status(500).json({
            message:"error getting the posts"
        })
    };
});
router.get('/userposts',authMiddleware,async (req,res)=>{
    try{
        const userId=req.query.userId;
        console.log(userId);
        
        const user = await userModel.findById(userId); 
        const posts=await postsModel.find({
            userId:userId
        });
        const friends=await friendsModel.findOne({
            userId:userId
        });
        return res.status(200).json({
            user:user,
            posts:posts,
            friends:friends.friends
        });
    }catch(error){
        return res.status(500).json(error);
    }
})

router.get('/sentrequests', async (req, res) => {
    try {
        const userId = req.headers.userid;
        const requests = await requestsModel.find({ requests: userId }).populate('requests', 'username');
        
        const usernames = requests.map(request => request.requests.map(user => user.username)).flat();
    
        return res.status(200).json(usernames);
    } catch (error) {
      return res.status(500).json({
        message: "Error"
      });
    }
  });
  router.get('/test', async (req, res) => {
    return res.status(200).json({message:"hello"});
  });
  
  
router.get('/issent',authMiddleware,async(req,res)=>{
    try{
        const userId = req.headers.userid;
        const {to}=req.query;
        const sent=await requestsModel.findOne({
            userId:to,
            requests:userId
        });
        if(!sent){
            return res.status(200).json(
                "Add Friend"
            );
        };
        if(sent){
            return res.status(200).json(
                "Sent")
        }
    }catch(error){
        return res.status(500).json({
            message:"error"
        })
    };
});

router.post('/sendrequest',authMiddleware,async(req,res)=>{
    try{
        const userId = req.headers['userid'];
        const {to}=req.body;
        console.log(to);
        const existingRequest = await requestsModel.findOne({
            userId: to,
            requests: userId
        });

        const reqalr=await requestsModel.findOne({
            userId:userId,
            requests:to
        });
        if(reqalr){
            return res.status(200).json({
                message:"Alreadysent"
            })
        }

        if (existingRequest) {
            return res.status(400).json({
                message: "Request already sent"
            });
        };

        console.log("hello");
        await requestsModel.updateOne(
            { userId: to },
            { $push: { requests: userId } }
        );
        return res.status(200).json({
            message:"request sent successfully"
        })    
    }catch(error){
        return res.json({
            message:error
        });
    }

});
router.get('/getfriends',authMiddleware,async(req,res)=>{
    try{
        const userId=req.headers.userid;
        const friends=await friendsModel.findOne({
            userId:userId
        }).populate('friends','username _id');
        if(!friends){
            return res.status(200).json({
                message:"You have no friends"
            })
        }
        const friendDetails = friends.friends.map(user => ({ userId: user._id, username: user.username }));
        return res.status(200).json(friendDetails);
    }catch(error){
        return res.status(500).json(error)
    }
})
router.get('/isfriend',authMiddleware,async(req,res)=>{
    try{
        const userId=req.headers['userid'];
        const {to}=req.query;
        
        const isfriend=await friendsModel.findOne({
            userId:userId,
            friends:to
        });
        if(isfriend){
            return res.status(200).json("Added");
        }
        if(!isfriend){
            return res.status(200).json("Add Friend");
        }
    }catch(error){
        return res.json({message:error});
    }

});

router.get('/receivedrequests',async (req,res)=>{
    try{
        const userId=req.headers.userid;
        const userRequests = await requestsModel.findOne({ userId: userId }).populate('requests', 'username _id');
        const userDetails = userRequests.requests.map(user => ({ userId: user._id, username: user.username }));
        return res.status(200).json(userDetails);
    }catch(error){
        return res.status(500).json({message:error});
    }
})
router.post('/acceptrequest', authMiddleware, async (req, res) => {
    try {
        const userId = req.headers['userid']; 
        const { from } = req.body; 

        if (!userId || !from) {
            return res.status(400).json({ message: 'userId and from are required' });
        }

       
        const request= await requestsModel.findOne({
            userId:userId,
            requests:from
        });

        if (!request) {
            return res.status(400).json({
                message: "No request from this user"
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
            message: "Request accepted"
        });
    } catch (error) {
        console.error('Error accepting request:', error);
        return res.status(500).json({ message: 'Error accepting request' });
    }
});

export default router;