const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is required",
        });
    }
    // decode token
    try{
         const userData = jwt.verify(token, process.env.JWT_SECRET);
         req.userData = userData;
         next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}
module.exports = authMiddleware;