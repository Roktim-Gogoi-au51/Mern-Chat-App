const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth');

const User = require('../models/users');

router.post('/register',async(req,res) => {
    try {
        const usernameCheck = await User.findOne({username:req.body.username});
        const emailCheck = await User.findOne({email:req.body.email});

        if(usernameCheck){
            return res.json({message:'Username already exists', status:false})
        }
        if(emailCheck){
            return res.json({message:'Email already exists', status:false})
        }
        const newUser = new User(req.body);
        await newUser.save()
        res.json({ status:true})
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/login',async(req,res) => {
    try {
        console.log(req.body)
        const user = await User.findOne({email:req.body.email});
        console.log(user)

        if(user){
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
            if(!isPasswordValid){
                return res.json({message:'Wrong Password', status:false})
            }
            delete user.password
            const token = jwt.sign({ username: user.username,  isAvatar: user.isAvatar }, process.env.Secret_key);
            res.status(200).json({
                token: token,
                status: true,
            });
            
        }

        else{
            return res.json({message:'Check your email once again', status:false})
        }
        
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/avatar/:username',authenticate,async(req,res)=>{
    try {
        if(req.body.payload){
            const user = await User.findOneAndUpdate(
                {username: req.params.username},
                {avaterImage: req.body.payload.avatar, isAvatar: req.body.payload.isAvatar},
                {new: true}
            )
            res.json({status: true})
        }
        else res.json({status: false})
    } catch (error) {
        console.log(error.message)
        res.json({message:'unable to set profile picture, try again',status: false})
    }
    
})

router.get('/getContacts/:username',authenticate,async(req,res)=>{
    try {
        const contacts = await User.find({username: {$ne:req.params.username}}).select([
            'name',
            'username',
            'email',
            'avaterImage'
        ]);
        res.json(contacts)
    } catch (error) {
        console.log(error.message)
        res.json({meessage:"something went wrong"})
    }
})

router.get('/user/:username',authenticate,async(req,res)=>{
    try {
        const user = await User.findOne({username: req.params.username}).select([
            'name',
            'username',
            'avaterImage'
        ])
        res.json(user)
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router;
