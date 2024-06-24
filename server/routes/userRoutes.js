const express=require("express");
const app=express();
const zod=require("zod");
const {userModel}=require('../models/userModel');
const {postsModel}=require('../models/postsModel');
const router=express.Router();
const jwt=require('jsonwebtoken');

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
       })
    }catch(error){
        res.status(500).json({
            message:"error while signing up"
        });
    }
    
});
