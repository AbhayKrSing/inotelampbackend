require('dotenv').config()
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');
mongoose.set('strictQuery', true)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js')
const fetchuser = require('../middleware/fetchuser.js')
const express = require('express')
router = express.Router()

 //ideally it must be in local environment(env.local)
//Route 1)Create a User using:- using POST "/api/auth/createuser"(No login required)
router.post('/createuser', [
    body('name', 'Write a valid name').isAlpha('en-US', { ignore: " " }),             //adding express-validator
    body('email', "Write a valid email address").isEmail(),
    body('password', 'Write a password whose length must be till 8 letters').isLength({ min: 8 })
], async (req, res) => {
    //if express-validator founds error ,errors.isEmpty() becomes false and code inside it runs and code will end with error response.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success:false, errors: errors.array() });     //expres-validator error syntax
    }

    try { //checking if email already exists
        user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success:false,error: 'This email already exists' })
        }
        var salt = bcrypt.genSaltSync(10);    //synchronous
        // var salt =await bcrypt.genSalt(10);  //It is promise
        var secpass = bcrypt.hashSync(req.body.password, salt);   //synchronous
        // var secpass = await bcrypt.hash(req.body.password, salt);  //It is promise
        req.body.password = secpass
        //Saving data to database
        user = new User(req.body)
        user = await user.save()
        console.log(user)
        console.log('data saved')
        data = {
            id: user.id
        }
        const authtoken = jwt.sign(data,process.env.JWT_secret_token); //jwt is json web token (please visit website for more details or refer harry video)
        res.json({ success:true,authtoken })
    } catch (error) {
        console.log(error.message)
        res.status(400).send('Some error occured')
    }

    // .then((value) => {
    //     res.json(value)
    //     console.log('data saved')
    // })
    // .catch((err) => {
    //     console.log(err.message)
    //     res.status(400).send('Write unique email address')
    // })
})
//Route 2) Login:- using POST "/api/auth/login"(login required)
router.post('/login', [
    body('email', 'Write a valid credentials').isEmail(),
    body('password', 'Write a valid credentials').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:false,errors: errors.array() });     //expres-validator error syntax
    }
    try {
        user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ error: 'Please login with correct credentials' })
        }
        let passwordcompare = bcrypt.compareSync(req.body.password, user.password) //synchronous method
        if (!passwordcompare) {
            return res.status(400).json({ success:false,error: 'Please login with correct credentials' })
        }
        // console.log(req.body.password,user.password)
        data = {
            id: user.id
        }
        const authtoken = jwt.sign(data, process.env.JWT_secret_token);
        res.json({ success:true,authtoken })
    }
    catch (err) {
        console.log(err.message)
        res.status(400).json({success:false,error:'Error in a interval server'})
    }
})
//Route 3) Login:- using POST "/api/auth/getuser"(login required)
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        res.send(user)
    }
    catch (error) {
        if (error) return res.status(500).json({success:false,error:'Error in a interval server'})
    }
})
module.exports = router

//Note: if you write duplicate email is get passed from middleware(express-validator) but later on the promise use.save() will get rejected because schema(or model) will not followed due to this duplicate error is shown in console.
//please note ,I actually removed indexing of email in schema.(so above statement will not work)