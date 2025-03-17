const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Customer = require('./customerModel');

const Order = sequelize.define('order', {
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
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'order'
});

Order.sync()
    .then(() => {
        console.log('Order table created successfully');
    })
    .catch(err => console.log('Error creating order table:', err));

module.exports = Order;
