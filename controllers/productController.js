const asynchandler = require('express-async-handler');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Product = require('../models/productModel');
const { validateToken } = require('../middleware/tokenHandler');

const getAllProducts = asynchandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
});

const getProductById = asynchandler(async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id }});
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
});

const addProduct = asynchandler(async (req, res) => {
    const { name, description, category, tags, price, count } = req.body;
    
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    
    if (!name ||!description ||!category ||!tags ||!price){
        return res.status(400).json({ message: 'All fields are required' });
    }

    if(!req.file)
        return res.status(400).json({ message: 'Image is required' });

    if(req.user.id !== 'seller'){
        return res.status(403).json({ message: 'Unauthorized to add a product' });
    }

    const product = await Product.create({
        name,
        description,
        category,
        tags,
        image: req.file.buffer,
        price,
        inStock: count,
        sellerId: req.user.id
    });
    res.status(201).json({ message: 'Successfully added product' });
});

const updateProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, category, tags, price, count } = req.body;

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    
    if(req.user.id !== 'seller')
        return res.status(403).json({ message: 'Unauthorized to update a product' });

    const product = await Product.findOne({ where: { id: id }});
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.update({
        name,
        description,
        category,
        tags,
        image: req.file.buffer,
        price,
        inStock: count
    }, {
        where: { id: id }
    });
    res.status(200).json({ message: 'Successfully updated product' });
});

const deleteProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    
    if(req.user.id !== 'seller' || req.user.id !== 'admin')
        return res.status(403).json({ message: 'Unauthorized to delete a product' });

    const product = await Product.findOne({ where: { id: id }});
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.destroy({ where: { id: id }});
    res.status(200).json({ message: 'Successfully deleted product' });
});


module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}