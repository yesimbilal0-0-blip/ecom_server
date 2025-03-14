const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Seller = require('../models/sellerModel');
const Admin = require('../models/adminModel');
const Customer= require('../models/customerModel');
const { signToken } = require('../middleware/tokenHandler');

const register = asynchandler( async (req,res) => {
    const {name, email, phoneNo, password} = req.body;
    const role = req.body.role;

    if(!name || !email || !phoneNo || !password)
        return res.status(400).json({message: 'All fields are required'});

    let existingUser;
    switch(role){
        case 'admin':
            existingUser = await Admin.findOne({where: { email: email} });
            break;
        case'seller':
            existingUser = await Seller.findOne({where: { email: email} });
            break;
        case 'customer':
            existingUser = await Customer.findOne({where: { email: email} });
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
            user = await Admin.findOne({where: { email: email} });
            break;
        case'seller':
            user = await Seller.findOne({where: { email: email} });
            break;
        case 'customer':
            user = await Customer.findOne({where: { email: email} });
            break;
        default:
            return res.status(400).json({message: 'Invalid role'});
    }
    
    if(!user)
        return res.status(404).json({message: 'User not found'});
    const isMatch = await bcrypt.compare(password, user.password);
    
    user.role = role;

    if(!isMatch)
        return res.status(401).json({message: 'Invalid email or password'});
    const token = signToken(user);
    
    res.json({ message: 'Logged In Successfully', token});
})

const updateDetails = asynchandler( async (req, res) => {
    const {name, email, phoneNo} = req.body;

    let user;
    switch(req.user.role){
        case 'admin':
            user = await Admin.update({name, email, phoneNo}, { where: {id: req.user.id} });
            break;
        case'seller':
        user = await Seller.update({name, email, phoneNo}, { where: {id: req.user.id} });
            break;
        case 'customer':
            user = await Customer.update({name, email, phoneNo}, { where: {id: req.user.id} });
            break;
        default:
            return res.status(401).json({message: 'Unauthorized'});
    }
    if(!user){
        return res.status(404).json({message: 'User not found'});
    }
    
    res.json({message: 'Details updated successfully'});
})

const resetPassword = asynchandler(async (req, res) => {
    const { email, newPassword } = req.body;
    const role = req.body.role;

    if (!email || !newPassword)
        return res.status(400).json({ message: 'Email and new password are required' });

    let user;
    switch (role) {
        case 'admin':
            user = await Admin.findOne({where: { email: email} });
            break;
        case 'seller':
            user = await Seller.findOne({where: { email: email} });
            break;
        case 'customer':
            user = await Customer.findOne({where: { email: email} });
            break;
        default:
            return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    if (!user)
        return res.status(404).json({ message: 'User not found' });

    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password reset successfully' });
});

module.exports = {
    register,
    login,
    updateDetails,
    resetPassword
}