require("dotenv").config()

const jwt = require("jsonwebtoken");

const verifytoken = (token)=>{
return new Promise((resolve,reject)=>{
    jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,token){
        if(err){return reject(err)};
        return resolve(token)
    })
})
}

module.exports = async(req,res,next)=>{
    const bearerToken = req?.headers?.authorization;

    if(!bearerToken||!bearerToken.startswith("Bearer")){
        return res.status(400).json({
            status:"Failed",
            message:"please provide a valid token"
        })
    }
    const token = bearerToken.split(" ")[1]

    let user;
    
    try {
        user = await verifytoken(token);
    
    }catch(e) {
        return res.status(400).json({
            status : "Failed",
            message: "Please provide a valid token"
        })
    }
    
    if(!user) {
        return res.status(400).json({
            status : "Failed",
            message: "Please provide a valid token"
        })
    }
    
    req.user = user
    
    return next()
    
    }


