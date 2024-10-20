const express = require('express');
const becryptJs = require("bcryptjs");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/api/signup', async (req, res) => {
    try {
        const {email, password } = req.body;
        // Check if the user already exists
        const exitedUser = await User.findOne({ email });
        if (exitedUser) {
            return res.status(400).json({ message: "User already exists" });
        }

       const hashedPassword = await becryptJs.hash(password, 10);

        // Create a new user
        let user = new User({
            email,
            password:hashedPassword,    
        });

        user = await user.save();
        res.status(200).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                address: user.address,
                role: user.role,     
                createdAt: user.createdAt, 
                updatedAt: user.updatedAt 
            },
        });
    } catch (e) {
        // Check if it's a Mongoose validation error
        if (e.name === 'ValidationError') {
            const messages = Object.values(e.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') }); // Custom error message for validation errors
        }
        // General error handler
        res.status(500).json({ error: e.message });
    }
});

router.post('/api/login',async (req,res)=>{
    try{
        const{email,password} = req.body;

        const user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist!"});
        }

       const isMatch = await becryptJs.compare(password,user.password);

       if(!isMatch){
        return res.status(400).json({message:"Incorrect password"});
       }

     const token =  jwt.sign({id: user._id},'accessToken');

     res.status(200).json({
        token: token,
        id: user._id,
        email: user.email,
     });
    }catch(e){
        res.status(500).json({ error: e.message });
    }
});



module.exports = router;
