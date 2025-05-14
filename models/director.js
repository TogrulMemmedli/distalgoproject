const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Director', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
