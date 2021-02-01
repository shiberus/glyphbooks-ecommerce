const { DataTypes } = require("sequelize");
const bcyrpt = require("bcrypt");

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,

      set(value) {
        if (value) {
          const salt = bcyrpt.genSaltSync(10);
          const hash = bcyrpt.hashSync(value, salt);
          this.setDataValue("password", hash);
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    shippingAdress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // resetPasswordToken: String,s
    // resetPasswordExpires: Date,

    resetPasswordToken: {
      type: DataTypes.STRING,
    },

    resetPasswordExpires: {
      type: DataTypes.DATE,
    },
  });
  User.prototype.compare = function (pass) {
    return bcyrpt.compareSync(pass, this.password);
  };
  return User;
};
