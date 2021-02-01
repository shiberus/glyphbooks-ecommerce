const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "product",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        defaultValue: "No hay una descripcion",
      },
      author: {
        type: DataTypes.STRING,
        defaultValue: "No especificado",
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount: {
        type: DataTypes.INTEGER,
        validate: (value) => {
          if (value < 0 || value > 100) {
            throw new Error("valor invalido");
          }
        },
        defaultValue: 0,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      img: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
};
