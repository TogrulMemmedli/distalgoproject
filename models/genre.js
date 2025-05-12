module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genres', {
      name: DataTypes.STRING
    });
  
    return Genre;
  };
  