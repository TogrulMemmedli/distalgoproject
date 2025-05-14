const { Sequelize } = require('sequelize');
const { sequelize } = require("../config/database")

const Movie = require('./movie')(sequelize);
const Director = require('./director')(sequelize);
const Actor = require('./actor')(sequelize);
const Genre = require('./genre')(sequelize);


Director.hasMany(Movie);
Movie.belongsTo(Director);

Movie.belongsToMany(Actor, { through: 'MovieActors' });
Actor.belongsToMany(Movie, { through: 'MovieActors' });

Movie.belongsToMany(Genre, { through: 'MovieGenres' });
Genre.belongsToMany(Movie, { through: 'MovieGenres' });

module.exports = {
  sequelize,
  Movie,
  Director,
  Actor,
  Genre,
};
