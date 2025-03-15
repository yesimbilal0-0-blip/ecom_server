const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
 }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'inventory'
    }
);

Inventory.sync()
    .then( () => {
    console.log('Inventory table has been created');
    })
    .catch(err => console.log('An error occurred', err));

module.exports = Inventory;