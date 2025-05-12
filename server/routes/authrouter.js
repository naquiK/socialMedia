const express = require('express')
const upload = require('../middleware/multer-middleware')
const router = express.Router()
const { registration, optVerification, generateOTP, resetPassword, resetPasswordHandler, verifyResetPasswordToken, login, editProfile, changePassword } = require('../controller/userController')
const authMiddleware = require('../middleware/auth-middleware')

router.post('/signup' , upload.single('profile'), registration)
router.post("/opt/:id" , optVerification)
router.post('/resend-otp/:id', generateOTP)
router.post('/reset-password', resetPassword)
router.post('/verifyResetPasswordToken/:id', verifyResetPasswordToken)
router.post('/change-password',authMiddleware, resetPasswordHandler)
router.post("/login" , login)
router.post('/edit-profile/:id' , editProfile)
router.post('edit-password/:id', changePassword )


module.exports = router 