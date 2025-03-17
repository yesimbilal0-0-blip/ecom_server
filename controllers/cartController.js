const asynchandler = require('express-async-handler');

const Product = require('../models/productModel');
const Cart = require('../models/shoppingCart');
const CartItem = require('../models/cartItem');

const getCart = asynchandler(async (req, res) => {
    const cart = await Cart.findOne({
        where: {
            userId: req.user.id
        }
    });

    const cartItems = await CartItem.findAll({
        where: {
            cartId: cart.id
        }
    });
    res.json({ message: 'Cart items:', cartItems, total: cart.total });
});

const addToCart = asynchandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
        where: {
            userId: req.user.id
        }
    });
    console.log("1");

    const product = await Product.findOne({
        where: {
            id: productId
        }
    });
    console.log("2");

    const cartItem = await CartItem.create({
        productId,
        quantity,
        cartId: cart.id,
    });

    cart.total += product.price * quantity;
    await cart.save()

    res.json({ message: 'Product added to cart', cartItem });
});

const deleteFromCart = asynchandler(async (req, res) => { 
    const cartItemId = req.params.id;

    const cart = await Cart.findOne({
        where: {
            userId: req.user.id
        }
    });

    const cartItem = await CartItem.destroy({
        where: {
            id: cartItemId,
            cartId: cart.id
        }
    });
    res.json({ message: 'Product removed from cart' });
});

module.exports = {
    getCart,
    addToCart,
    deleteFromCart
}