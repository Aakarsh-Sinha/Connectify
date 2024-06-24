const express=require('express');
const app=express();
const router=express.Router();

const userRouter=require('./userRoutes');

router.use('/user',userRouter);

module.exports=router;