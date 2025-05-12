const { uploadImage } = require("../cloudinary/cloudinary");

const Profile = require("../Models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");

const registration = async (req, res) =>{
    const { username, name, email, phone, password } = req.body;

    if (!req.file) {    
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }


    if (!username || !name || !email || !phone || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    const existingProfile = await Profile.findOne({
            $or: [{ username }, { email }]
        });

        // If profile exists and is verified => block registration
        if (existingProfile && existingProfile.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists"
            });
        }

    const hashPassword = await bcrypt.hash(password,10)

        // Upload the image to Cloudinary
    const {url , publicId} = await uploadImage(req.file.path);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now



    const newProfile = Profile({
        username,
        name,
        email,
        phone,
        password: hashPassword,
        profilePic: {
            url,
            publicId
        },
        verificationCode,
        verificationCodeExpire,
    })
    await newProfile.save();

    mailSender({
        email: newProfile.email,
        subject: "Verification Code",
        message: `<h1>Your verification code is ${verificationCode}</h1>`
    })
    return res.status(200).json({
        success:true,
        message:"user created",
        data:newProfile._id,
        verificationCode
    })
}

const optVerification = async (req,res)=>{
    const {verificationCode} = req.body;
    const id = req.params.id;
    if(!verificationCode){
        return res.status(400).json({
            success:false,
            message:"please provide verification code"
        })
    }
    const user = await Profile.findById(id);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    if(user.isVerified){
        return res.status(400).json({
            success:false,
            message:"user already verified"
        })
    }
    if(!user.verificationCode){
        return res.status(400).json({
            success:false,
            message:"verification code not sent"
        })
    }
    if(user.verificationCode !== verificationCode){
        return res.status(400).json({
            success:false,
            message:"invalid verification code"
        })
    }
    if(user.verificationCodeExpire < Date.now()){
        return res.status(400).json({
            success:false,
            message:"verification code expired"
        })
    }
    user.isVerified = true;
    await user.save()

    const token = jwt.sign({ id: user._id , name:user.name , username:user.username , email:user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    
    return res.status(200).json({
        success:true,
        message:"user verified",
        data:{
            token
        }
    })
}

const generateOTP = async (req , res) =>{
    const id = req.params.id;

    const user = await Profile.findById(id);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    if(user.isVerified){
        return res.status(400).json({
            success:false,
            message:"user already verified"
        })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.verificationCode = verificationCode;
    user.verificationCodeExpire = verificationCodeExpire;
    await user.save();
    mailSender({
        email: user.email,
        subject: "Verification Code",
        message: `<h1>Your verification code is ${verificationCode}</h1>`
    })
    return res.status(200).json({
        success:true,
        message:"verification code sent",
        data:user._id
    })

}
const resetPassword = async (req , res) =>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            success:false,
            message:"please provide email"
        })
    }
    const user = await Profile.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    const resetPasswordToken = Math.floor(100000 + Math.random() * 900000);
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();
    mailSender({
        email: user.email,
        subject: "Reset Password",
        message: `<h1>Your reset password token is ${resetPasswordToken}</h1>`
    })
    return res.status(200).json({
        success:true,
        message:"reset password token sent",
        data:user._id
    })

}
const verifyResetPasswordToken = async (req , res) =>{
    const {resetPasswordToken} = req.body;
    const id = req.params.id;
    if(!resetPasswordToken){
        return res.status(400).json({
            success:false,
            message:"please provide reset password token"
        })
    }

    const user = await Profile.findById(id);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    if(user.resetPasswordToken !== resetPasswordToken){
        return res.status(400).json({
            success:false,
            message:"invalid reset password token"
        })
    }
    if(user.resetPasswordExpire < Date.now()){
        return res.status(400).json({
            success:false,
            message:"reset password token expired"
        })
    }
    const token = jwt.sign({email:user.email, id:user._id}, process.env.JWT_SECRET, {
        expiresIn: "5m"
    });
    return res.status(200).json({
        success:true,
        message:"reset password token verified",
        data:token,
    })
}
const resetPasswordHandler = async (req , res) =>{
    const {password} = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    email= jwt.verify(token, process.env.JWT_SECRET).email;
    id = jwt.verify(token, process.env.JWT_SECRET).id;
    if(!email){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }

    if(!password){
        return res.status(400).json({
            success:false,
            message:"please provide password"
        })  
    }

    user = await Profile.findById(id);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    if(user.email !== email){
        return res.status(400).json({
            success:false,
            message:"invalid email"
        })
    }
        hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword;

        res.status(200).json({
            success:true,
            message:"password reset successfully",
            data:user._id
        })
}
const login = async (req , res) =>{
        const {email , password } = req.body

        const user = await Profile.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"invalid credentials"
            })
        }

        const token = jwt.sign({ id: user._id ,
             name:user.name , 
             username:user.username , 
             email:user.email, 
             id:user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        return res.status(200).json({
            success:true,
            message:"user logged in",
            data:token
        })


}

const editProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await Profile.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    if (req.file) {
        const { url, publicId } = await uploadImage(req.file.path);
        user.profilePic = {
            url,
            publicId
        };
    }
    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    if (phone) {
        user.phone = phone;
    }
    await user.save();
    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
    });

   
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await Profile.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Old password is incorrect"
        });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
}


module.exports = {
    registration, 
    optVerification ,
    generateOTP,
    resetPassword,
    verifyResetPasswordToken,
    resetPasswordHandler,
    login,
    editProfile,
    changePassword
}