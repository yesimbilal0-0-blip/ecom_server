const asynchandler = require('express-async-handler');

const Cart = require('../models/shoppingCart');
const CartItem = require('../models/cartItem');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Product = require('../models/productModel');

const generateOrder = asynchandler(async (req, res) => {
    const cart = await Cart.findOne({
        where: { 
            userId: req.user.id 
        },
    });

    const orderItems = await CartItem.findAll({
        where: {
            cartId: cart.id
        }
    });
    
    if(!orderItems){
        return res.status(404).json({ message: 'Cart is empty' });
    }

    const items = await Promise.all(orderItems.map(async (item) => {
        const product = await Product.findOne({
            where: {
                id: item.productId
            }
        });
        return {
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity
        };
    }));

    const order = await Order.create({
        userId: req.user.id,
        items: items,
        total: cart.total,
    });

    res.status(200).json({ message: 'Order Generated', orderItems: items, price: cart.total });
});

module.exports = {
    generateOrder
}