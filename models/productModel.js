const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Seller = require('./sellerModel');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    inStock: {
        type: DataTypes.INTEGER,
        defaultValue: true
    },
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model: Seller,
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'product'
});

sequelize.sync({force: true})
    .then(() => {
        console.log('Product table has been successfully created.');
    })
    .catch(error => console.log('An error occurred', error));

module.exports = Product;
