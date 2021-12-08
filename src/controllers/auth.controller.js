require("dotenv").config();
const express = require("express")
const jwt = require("jsonwebtoken")
const {body,validationResult} = require("express-validator");
const User = require("../model/user.model")
const router = express.Router();
const newToken = (user)=>{
   return jwt.sign({user:user},process.env.JWT_ACCESS_KEY)
}


const register = async(req,res)=>{

try{

// check if the email addres provide already exist
const errors = validationResult(req)

if(!errors.isEmpty())
{
    let error = errors.array().map(({msg,param,location})=> {
        return{
            [param]:msg
        }
    })
    return res.status(400).json({errors:error})

}
let user  = await User.findOne({email:req.body.email}).lean().exec()

    // if already exist the throw an error
if(user) res.status(400).json({status:"failed",message:"please provide the different email address"});

    // else we will create the user

user = await User.create(req.body);
    // we will hash the password as plain text password is harmful




    // we will create the token
    //type of authentiaction :-1)stateful
    // remebering 
    //2)stateless
    // forgeeting

    const token = newToken(user);

    // return to user and the token


    
    res.status(201).json({user,token})




   
} catch(e){
       return res.status(500).json({status:"failed",message:e.message});
}
    
}

const login =async (req,res)=>{


    try{

        // check if the email addres provide already exist
        
        let user  = await User.findOne({email:req.body.email})
        
            // if already exist the throw an error
        if(!user){
             return res.status(400).json({status:"failed",message:"please provide correct email address"});
    }
            // else we will match password
        const match = await user.checkPassword(req.body.password);
     
       
            // we will hash the password as plain text password is harmful
            if(!match) return res.status(400).json({status:"failed",message:"please provide correct email address"});
        
            // we will create the token
            //type of authentiaction :-1)stateful
            // remebering 
            //2)stateless
            // forgeeting
        
            const token = newToken(user);
        
            // return to user and the token
        
        
            
            res.status(201).json({user,token})
        
        
        
        
           
        } catch(e){
               return res.status(500).json({status:"failed",message:e.message});
        }
            
        


}

module.exports = {
    register,
    login
};