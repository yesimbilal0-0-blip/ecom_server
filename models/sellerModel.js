const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Seller = sequelize.define('seller', {
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
        allowNull: false,
        unique: true
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
    tableName: 'seller'
});

sequelize.sync()
    .then(() => {
        console.log('Seller table has been successfully created.');
    })
    .catch(error => console.log('An error occurred', error));

module.exports = Seller;
