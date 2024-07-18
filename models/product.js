'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async getSortedStock(sortOpt, search) {
      try {
        const options = {}
        if (sortOpt) {
          options.order = [
            ['stock', sortOpt]
          ];
        }
        if (search) {
          options.where = {
            name: {
              [Op.iLike]: `%${search}%`
            }
          }
        }
        const products = await Product.findAll(options);
        return products;
      } catch (err) {
        throw err;
      }
    }

    static associate(models) {
      // define association here
      Product.belongsToMany(models.Transaction, { through: models.TransactionProduct });
      Product.belongsToMany(models.Category, { through: models.ProductCategory });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Product Name Required'
        },
        notEmpty: {
          msg: 'Product Name Required'
        }
      }
    },
    description: DataTypes.TEXT,
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Stock Required'
        },
        notEmpty: {
          msg: 'Stock Required'
        },
        min: {
          args: 1,
          msg: 'Stock must be above 0'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price Required'
        },
        notEmpty: {
          msg: 'Price Required'
        },
        min: {
          args: 1,
          msg: 'Price must be above 0'
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Image Url Required'
        },
        notEmpty: {
          msg: 'Image Url Required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};