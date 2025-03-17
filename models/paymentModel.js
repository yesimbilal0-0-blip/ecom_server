const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Payment = sequelize.define('Payment', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'order',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'payment'
});

Payment.sync()
    .then(() => {
        console.log('Payment table has been created');
    })
    .catch(error => console.log('An error occurred', error));

module.exports = Payment;