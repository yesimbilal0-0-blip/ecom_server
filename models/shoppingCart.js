const { DataTypes } = require('sequelize');
const sequalize = require('../config/dbConfig');

const Customer = require('./productModel');

const Cart = sequalize.define('cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customer',
            key: 'id'
        }
    },
    total:{
        type: DataTypes.DECIMAL(10, 2),
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'cart'
})

Cart.sync()
    .then(() => {
        console.log('Cart table created successfully');
    })
    .catch(err => console.log('Error creating cart table:', err));


module.exports = Cart;