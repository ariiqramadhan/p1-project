'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserDetail);
      User.belongsToMany(models.Product, { through: models.Transaction });
      User.hasMany(models.Transaction);
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email already registered, register with other email or login'
      },
      validate: {
        notNull: {
          msg: 'Email Required'
        },
        notEmpty: {
          msg: 'Email Required'
        },
        isEmail: {
          msg: 'Please enter valid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password Required'
        },
        notEmpty: {
          msg: 'Password Required'
        },
        len: {
          args: [8,20],
          msg: 'Password must be 8 - 20 characters'
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(instance => {
    instance.role = 'user';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(instance.password, salt);
    instance.password = hash;
  });

  return User;
};