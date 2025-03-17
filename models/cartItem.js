const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Cart = require('../models/shoppingCart');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'product',
            key: 'id'
        }
    },
    cartId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'cart',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
 }, {
    timestamps: false,
    tableName: 'cart_item',
    freezeTableName: true
})

CartItem.sync()
    .then(() => {
        console.log('CartItems table has been successfully created.');
    })
    .catch(error => console.log('An error occurred', error));


module.exports = CartItem;