const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Seller = require('../models/sellerModel');
const Admin = require('../models/adminModel');
const Customer= require('../models/customerModel');

const register = asynchandler( async (req,res) => {
    const {name, email, phoneNo, password} = req.body;
    const role = req.body.role;

    if(!name || !email || !phoneNo || !password)
        return res.status(400).json({message: 'All fields are required'});

    let existingUser;
    switch(role){
        case 'admin':
            existingUser = await Admin.findOne({email});
            break;
        case'seller':
            existingUser = await Seller.findOne({email});
            break;
        case 'customer':
            existingUser = await Customer.findOne({email});
            break;
        default:
            return res.status(400).json({message: 'Invalid role'});
    }
    if(existingUser)
        return res.status(400).json({message: 'Email already registered'});

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if(role === 'admin') {
        user = await Admin.create({
            name,
            email,
            phoneNo,
            password: hashedPassword
        })
    }
        
    else if(role ==='seller') {
        user = await Seller.create({
            name,
            email,
            phoneNo,
            password: hashedPassword
        })
    }
        
    else if(role === 'customer') {
        user = await Customer.create({
            name,
            email,
            phoneNo,
            password: hashedPassword
        })
    }
        
    await user.save();
    res.status(201).json({message: 'User registered successfully'});
})

const login = asynchandler(async (req, res) => {
    const {email, password} = req.body;
    const role = req.body.role;

    if(!email || !password)
        return res.status(400).json({message: 'Email and password are required'});
    
    let user;
    switch(role){
        case 'admin':
            user = await Admin.findOne({email});
            break;
        case'seller':
            user = await Seller.findOne({email});
            break;
        case 'customer':
            user = await Customer.findOne({email});
            break;
        default:
            return res.status(400).json({message: 'Invalid role'});
    }
    
    if(!user)
        return res.status(404).json({message: 'User not found'});
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch)
        return res.status(401).json({message: 'Invalid email or password'});
    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
    
    res.json({ message: 'Logged In Successfully', token});
})


module.exports = {
    register,
    login
}