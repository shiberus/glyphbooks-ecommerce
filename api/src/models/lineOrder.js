const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const lineOrder = sequelize.define("lineOrder", {
    price: {
      type: DataTypes.INTEGER,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
