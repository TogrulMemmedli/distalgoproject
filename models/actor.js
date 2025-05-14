const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Actor', {
    name: {
      type: DataTypes.STRING,
      unique: false,
    },
  });
