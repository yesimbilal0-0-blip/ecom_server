const asynchandler = require('express-async-handler');
const multer = require('multer');

const Product = require('../models/productModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAllProducts = asynchandler(async (req, res) => {
    const products = await Product.find();

    if(products.inStock > 0)
        res.status(200).json({products, message: $`In stock: ${products.inStock}`});
    else 
        res.status(200).json({products, message: 'Out of stock'});
});

const getProductById = asynchandler(async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id }});
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
});

const addProduct = asynchandler(async (req, res) => {
    const image = req.file;
    const jsonData = req.body.jsonData;

    let data;
    try {
        data = JSON.parse(JSON.parse(jsonData));
    } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON format', error: error.message });
    }

    const { name, description, category, tags, price, count } = data;

    if (!name ||!description ||!category ||!tags ||!price ||!count){
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!image) return res.status(400).json({ message: 'Image is required' });

    if(req.user.role !== 'seller')
        return res.status(403).json({ message: 'Unauthorized to add a product' });


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
    res.status(201).json({ message: 'Successfully added product', product});
});

const updateProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    const image = req.file;
    const jsonData = req.body.jsonData;

    let data;
    try {
        data = JSON.parse(JSON.parse(jsonData));
    } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON format', error: error.message });
    }

    const { name, description, category, tags, price, count } = data;

    if (!name ||!description ||!category ||!tags ||!price ||!count){
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!image) return res.status(400).json({ message: 'Image is required' });

    const product = await Product.findOne({ where: { id: id }});
    if (!product) return res.status(404).json({ message: 'Product not found' });

    
    if(req.user.role !== 'seller' && req.user.id !== product.sellerId)
        return res.status(403).json({ message: 'Unauthorized to update a product' });
    

    await Product.update({
        name,
        description,
        category,
        tags,
        image,
        price,
        inStock: count
    }, {
        where: { id: id }
    });
    res.status(200).json({ message: 'Successfully updated product' });
});

const deleteProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    

    const product = await Product.findOne({ where: { id: id }});
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if((req.user.role !== 'seller' && req.user.id !== product.sellerId) && req.user.role !== 'admin')
        return res.status(403).json({ message: 'Unauthorized to delete a product' });
    
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