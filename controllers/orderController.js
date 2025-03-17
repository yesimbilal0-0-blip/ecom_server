const asynchandler = require('express-async-handler');

const Cart = require('../models/shoppingCart');
const CartItem = require('../models/cartItem');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Product = require('../models/productModel');
const Discount = require('../models/discountModel');

const generateShippingCost = require('../helpers/calculateShippingCost');

const generateOrder = asynchandler(async (req, res) => {
    const discountCodes = req.body.discountCodes;

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
            name: product.name,
            price: product.price,
            quantity: item.quantity
        };
    }));

    const shippingCost = generateShippingCost(items);

    if(discountCodes){
        let total = cart.total;
        const tDiscount = await Promise.all(discountCodes.map(async (discountCode) => {
            const discount = await Discount.findOne({
                where: {
                    code: discountCode
                }
            });
            return discount.percentage;
        }));
        tDiscount.forEach(
            (tDiscount, index) => {
                total = total - (total * tDiscount / 100);
            }
        );

        const order = await Order.create({
            userId: req.user.id,
            items: items,
            total: total + shippingCost,
            shippingCost: shippingCost
        });
        res.status(200).json({ message: 'Order Generated', orderItems: items, price: total + shippingCost });
    }
    if(!discountCodes){
        const order = await Order.create({
            userId: req.user.id,
            items: items,
            total: cart.total + shippingCost,
            shippingCost: shippingCost
        });

        res.status(200).json({ message: 'Order Generated', orderItems: items, price: cart.total + shippingCost });
    }
});

const updateStatus = asynchandler(async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
        return res.status(400).json({ message: 'Order ID and status are required' });
    }

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await Order.update(
        { status: status },
        { where: { id: orderId } }
    );
    if (updatedOrder[0] === 0) {
        return res.status(500).json({ message: 'Failed to update order status' });
    }

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
});

module.exports = {
    generateOrder,
    updateStatus
}