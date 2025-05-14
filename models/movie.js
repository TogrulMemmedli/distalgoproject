const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Movie', {
    title: DataTypes.STRING,
    overview: DataTypes.TEXT,
    year: DataTypes.INTEGER,
    votes: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    popularity: DataTypes.FLOAT,
    budget: DataTypes.INTEGER,
    poster_url: DataTypes.STRING,
  });
