module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movies', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'unreleased',
    },
    poster: {
      type: DataTypes.STRING,
    },
    originalLanguage: {
      type: DataTypes.STRING,
    },
  });

  return Movie;
};
