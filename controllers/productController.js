const asynchandler = require('express-async-handler');
const multer = require('multer');

const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Inventory = require('../models/inventoryModel');
const Discount = require('../models/discountModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAllCategories = asynchandler(async (req, res) => {
    const categories = await Category.findAll();
    res.status(200).json(categories);
});

const getAllProducts = asynchandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
});

const getProductById = asynchandler(async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id }});

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const inventory = await Inventory.findOne( { where: {
        id: product.inventoryId
    }});

    if(inventory.quantity > 0) {
        res.status(200).json({ product, message: 'In Stock' });
    } else {
        res.status(200).json({ product, message: 'Out of Stock' });
    }
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

    const { name, description, productCategory, tags, price, quantity } = data;

    if (!name ||!description ||!productCategory ||!tags ||!price ||!quantity){
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!image) return res.status(400).json({ message: 'Image is required' });

    if(req.user.role !== 'seller')
        return res.status(403).json({ message: 'Unauthorized to add a product' });

    const category = await Category.findOne({
        where: { name: productCategory }
    })
    
    if(!category)
        return res.status(404).json({ message: 'Category not found' });

    const inventory = await Inventory.create({
        quantity: quantity
    })

    const product = await Product.create({
        name,
        description,
        categoryId: category.id,
        inventoryId: inventory.id,
        tags,
        image: req.file.buffer,
        price,
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

    const { name, description, productCategory, tags, price, quantity } = data;

    if (!name ||!description ||!productCategory ||!tags ||!price ||!quantity){
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!image) return res.status(400).json({ message: 'Image is required' });

    const product = await Product.findOne({ where: { id: id }});
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    if(req.user.role !== 'seller' && req.user.id !== product.sellerId)
        return res.status(403).json({ message: 'Unauthorized to update a product' });
    
    const category = await Category.findOne({
        where: { name: productCategory }
    })
    
    if(!category)
        return res.status(404).json({ message: 'Category not found' });

    const inventory = await Inventory.update({
        quantity: quantity
    }, {
        where: { id: product.inventoryId }
    })

    await Product.update({
        name,
        description,
        tags,
        image,
        price,
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

    await Inventory.destroy({ where: { id: product.inventoryId } })
});

module.exports = {
    getAllCategories,
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}