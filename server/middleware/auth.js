const jwt = require('jsonwebtoken');

const authMiddleware = (req , res , next) =>{
    const token = req.header('Authorization')?.replace('Bearer' , " ");

    if(!token){
        return res.status(401).json({
            message:"invaluid token"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = {id: decoded.userId};
        next();
    } catch (error) {
        res.status(401).json({error:"Invalid token "});
        
    }

};

module.exports = authMiddleware;