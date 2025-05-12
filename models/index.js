const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');
const MovieModel = require('./movie');
const GenreModel = require('./genre');

const Movie = MovieModel(sequelize, Sequelize.DataTypes);
const Genre = GenreModel(sequelize, Sequelize.DataTypes);

Movie.belongsToMany(Genre, { through: 'MovieGenres' });
Genre.belongsToMany(Movie, { through: 'MovieGenres' });

module.exports = {
  sequelize,
  Movie,
  Genre,
};
