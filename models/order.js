'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total_cost: {
      type: DataTypes.FLOAT
    }, 
    status: {
      type: DataTypes.ENUM,
      values: ["preorder", "payed", "delivered"]
    },
    pay_date: {
      type: DataTypes.DATE
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

  Order.associate = function(models) {
    models.Order.belongsToMany(models.Book, {
      through: {
          model: "OrderBooks",
          //as: "_orders",
          //unique: false
        },
        foreignKey: "order_id"
    });
  };
  
  return Order;
};