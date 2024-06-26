import mongoose from 'mongoose';
import { userModel } from './userModel.js';

const postsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    caption:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    }
});

const postsModel=mongoose.model("postsModel",postsSchema);

export { postsModel };