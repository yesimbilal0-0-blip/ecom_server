const asynchandler = require('express-async-handler');

const Cart = require('../models/shoppingCart');
const CartItem = require('../models/cartItem');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Product = require('../models/productModel');
const Discount = require('../models/discountModel');

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

    if(discountCodes){
        let total = cart.total;
        const tDiscount = await Promise.all(discountCodes.map(async (discountCode) => {
            const discount = await Discount.findOne({
                where: {
                    code: discountCode
                }
            });
            return discount.percentage;
            console.log(discount.percent)
        }));
        console.log(tDiscount)
        tDiscount.forEach(
            (tDiscount, index) => {
                total = total - (total * tDiscount / 100);
            }
        );

        console.log(total);
        const order = await Order.create({
            userId: req.user.id,
            items: items,
            total: total
        });
        res.status(200).json({ message: 'Order Generated', orderItems: items, price: total });
    }
    if(!discountCodes){
        const order = await Order.create({
            userId: req.user.id,
            items: items,
            total: cart.total
        });
        res.status(200).json({ message: 'Order Generated', orderItems: items, price: cart.total });
    }
});

module.exports = {
    generateOrder
}