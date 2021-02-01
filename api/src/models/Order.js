const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const Order = sequelize.define('order', {
  status: {
    type: DataTypes.ENUM('carrito', 'creada', 'procesando', 'cancelada', 'completa')
  },
  date: {
    type: DataTypes.DATE
  },
  // shippingAdress: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  // userId: {s
  //     type: DataTypes.INTEGER,
  //     allowNull: false,    
  // },
});
}