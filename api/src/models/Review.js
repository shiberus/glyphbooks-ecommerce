const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {


const Review = sequelize.define('review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  });
}
