const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Seller = require('./sellerModel');
const Category = require('./categoryModel');
const Inventory = require('./inventoryModel');

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
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        }
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'inventory',
            key: 'id'
        }
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
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'seller',
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