const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Customer = sequelize.define('customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'customer'
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('User table has been successfully created.');
    })
    .catch(error => console.log('An error occurred', error));

module.exports = Customer;
