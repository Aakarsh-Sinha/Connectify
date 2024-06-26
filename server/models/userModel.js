import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    email:{
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
    username:{
        type:String,
        required:true,
        trim:true
    }

});

const userModel = mongoose.model('userModel', userSchema);

export { userModel };