const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
         unique:false,
    },
    name:{
        type:String,
        required:true,
        unique:false,
    },
    email:{
        type:String,
        required:true,
        unique:false,
    }, 
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        url:{
            type:String,
            default:"https://clipground.com/images/white-profile-icon-png-7.png",
        },
        publicId:{
            type:String,
        }
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
     verificationCode: {type: Number},
     verificationCodeExpire: Date,
     resetPasswordToken: {type: Number},
     resetPasswordExpire: Date,
     createdAt:{
        type:Date,
        default:Date.now,
     }
})
  

module.exports = mongoose.model("Profile", userSchema);
