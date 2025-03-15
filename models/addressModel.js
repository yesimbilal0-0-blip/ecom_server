const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    houseNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    streetNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customer',
            key: 'id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'address'
});

Address.sync()
    .then(() => {
        console.log('Address table created successfully');
    })
    .catch(err => console.log('Error creating address table:', err));

module.exports = Address;