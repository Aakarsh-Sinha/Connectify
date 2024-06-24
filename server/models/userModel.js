const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30

    },    
    password:{
        type: String,
        required: true,
        minLength:6
    },
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    }

});

const userModel=mongoose.model("userModel",userSchema);

module.exports=userModel;