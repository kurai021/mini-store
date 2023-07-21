const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define(
    'order',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'productid',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'userid',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'totalprice',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'createdat',
        },
    },
    {
        tableName: 'orders',
        timestamps: false,
    }
);

module.exports = Order;
