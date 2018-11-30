'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.FLOAT
    },
    rank: {
        type: DataTypes.ENUM,
        values: ["one", "two", "three", "four", "five"]
    },
    category: {
        type: DataTypes.INTEGER
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
  Book.associate = function(models) {
    
    models.Book.hasMany(models.File, {
        foreignKey: "book_id",
        onDelete: "CASCADE"
    });

    models.Book.hasMany(models.Comment, {
        foreignKey: "book_id",
        onDelete: "CASCADE"
    });

    models.Book.belongsToMany(models.Order, {
        through: {
            model: "OrderBooks",
            //as: "_books",
            //unique: false
          },
          foreignKey: "book_id",
    });

  };
  return Book;
};