const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cartid"
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productid"
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'cartitems',
    timestamps: false,
  }
);

module.exports = CartItem;
