const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Review = sequelize.define('review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customer',
            key: 'id',
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product',
            key: 'id',
        },
    },
}, {
    tableName: 'review',
    timestamps: false,
    freezeTableName: true
});

Review.sync()
    .then(() => {
        console.log('Review table created successfully');   
    })
    .catch(err => console.log('Error creating review table:', err));

module.exports = Review;