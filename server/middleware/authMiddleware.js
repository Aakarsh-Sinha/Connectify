const jwt=require('jsonwebtoken');
const dotenv=require("dotenv");

dotenv.config();
const jwtsecret = process.env.JWT_SECRET;

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader||!authHeader.startsWith('Bearer ')){
        return res.status(403).json({message:"error"});
    }
    const token=authHeader.split(' ')[1];

    try{
        jwt.verify(token,jwtsecret);
        next();
    }
    catch(err){
        return res.status(403).json({});
    }
};

module.exports={
    authMiddleware
}