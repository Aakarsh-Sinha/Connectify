const express=require("express");
const app=express();
const zod=require("zod");
const {userModel}=require('../models/userModel');
const {postsModel}=require('../models/postsModel');
const router=express.Router();
const jwt=require('jsonwebtoken');
const dotenv=require("dotenv");
const {authMiddleware}=require('../middleware/authMiddleware');
dotenv.config();

const jwtsecret = process.env.JWT_SECRET;
const signupbody=zod.object({
    username: zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
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
            username:req.body.username,
            password:req.body.password,
            firstname:req.body.firstname,
            lastname:req.body.lastname
       });
       const userId=newUser._id;

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

module.exports=router;