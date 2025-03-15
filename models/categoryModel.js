const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Category = sequelize.define('category', {
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
    }
 }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'category'
    }
);

Category.sync()
    .then( () => {
    console.log('Category table has been created');
    })
    .catch(err => console.log('An error occurred', err));

module.exports = Category;