const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Seller = require('./sellerModel');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productCategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productTags: {
        type: DataTypes.JSON,
        allowNull: true
    },
    productImage: {
        type: DataTypes.BLOB('long'),
        allowNull: true
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

sequelize.sync()
    .then(() => {
        console.log('Product table has been successfully created.');
    })
    .catch(error => console.log('An error occurred', error));

module.exports = Product;
