const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Discount = sequelize.define('discount', {
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
    percentage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
 }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'discount'
    }
);

Discount.sync()
    .then( () => {
    console.log('Discount table has been created');
    })
    .catch(err => console.log('An error occurred', err));

module.exports = Discount;