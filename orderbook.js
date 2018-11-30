'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderBook = sequelize.define('OrderBook', {
    
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    underscored: true
  });
  OrderBook.associate = function(models) {
    // associations can be defined here
  };
  return OrderBook;
};