const express = require("express");
const router = express.Router();

const Post = require("../model/post.model");


const authenticate = require("../middleware/auth")

router.post("/",authenticate,async(req,res)=>{
    try{
        console.log(authenticate)
        const user = req.user;

        //console.log(user)
        const post = await Post.create({
            title:req.body.title,
            body:req.body.title,
            user:user.user._id,

        })

        return res.status(201).json({post});
    }catch(e){
        return res.status(500).json({ status: "Failed", message: e.message });
    }
})

router.get("/",authenticate,async(req,res)=>{
    try{
const post = await Post.find({})
res.send(post)
    }catch(err){
        return res.status(500).json({status:"Failed",message:e.message});

    }
})

module.exports = router;