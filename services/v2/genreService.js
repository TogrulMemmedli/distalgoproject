const { Genre, Movie } = require("../../models");

module.exports = {
  async getAllGenres() {
    try {
      const genres = await Genre.findAll({
        order: [["name", "ASC"]], 
      });

      return {
        status: 200,
        data: {
          genres,
        },
      };
    } catch (err) {
      return { status: 500, error: "Failed to fetch genres" };
    }
  },

  async getGenreById(id) {
    try {
      const genre = await Genre.findByPk(id);
      if (!genre) return { status: 404, error: "Genre not found" };
      return { status: 200, data: genre };
    } catch (err) {
      return { status: 500, error: "Failed to fetch genre" };
    }
  },

  async createGenre(data) {
    try {
      const genre = await Genre.create(data);
      return { status: 201, data: genre };
    } catch (err) {
      return { status: 400, error: err.message };
    }
  },

  async updateGenre(id, data) {
    try {
      const genre = await Genre.findByPk(id);
      if (!genre) return { status: 404, error: "Genre not found" };

      await genre.update(data);
      return { status: 200, data: genre };
    } catch (err) {
      return { status: 400, error: err.message };
    }
  },

  async deleteGenre(id) {
    try {
      const genre = await Genre.findByPk(id);
      if (!genre) return { status: 404, error: "Genre not found" };

      await genre.destroy();
      return { status: 204 };
    } catch (err) {
      return { status: 500, error: "Failed to delete genre" };
    }
  },

  async getMoviesByGenre(id) {
    try {
      const genre = await Genre.findByPk(id);
      if (!genre) return { status: 404, error: "Genre not found" };

      const movies = await genre.getMovies();
      return { status: 200, genre: genre, data: movies };
    } catch (err) {
      return { status: 500, error: "Failed to fetch movies by genre" };
    }
  },
};
