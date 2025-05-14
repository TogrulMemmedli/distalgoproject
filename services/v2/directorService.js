const { Director, Movie } = require("../../models");

module.exports = {
  async getAllDirectors({ page = 1, limit = 20, sortBy = "id", sort = "asc" }) {
    try {
      const offset = (page - 1) * limit;
      const orderDirection = sort === "desc" ? "DESC" : "ASC";

      const validSortFields = ["id", "name"];
      if (!validSortFields.includes(sortBy)) {
        throw new Error("Invalid sortBy field");
      }

      const { count, rows } = await Director.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, orderDirection]],
      });

      return {
        directors: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (err) {
      throw new Error("Error fetching directors: " + err.message);
    }
  },

  async getDirectorById(directorId) {
    try {
      const director = await Director.findByPk(directorId);

      if (!director) {
        throw new Error("Director not found");
      }

      return director;
    } catch (err) {
      throw new Error("Error fetching director: " + err.message);
    }
  },

  async createDirector({ name }) {
    try {
      const director = await Director.create({ name });
      return director;
    } catch (err) {
      throw new Error("Error creating director: " + err.message);
    }
  },

  async updateDirector(directorId, { name }) {
    try {
      const director = await Director.findByPk(directorId);

      if (!director) {
        throw new Error("Director not found");
      }

      director.name = name || director.name;
      await director.save();

      return director;
    } catch (err) {
      throw new Error("Error updating director: " + err.message);
    }
  },

  async deleteDirector(directorId) {
    try {
      const director = await Director.findByPk(directorId);

      if (!director) {
        throw new Error("Director not found");
      }

      await director.destroy();
      return { message: "Director deleted successfully" };
    } catch (err) {
      throw new Error("Error deleting director: " + err.message);
    }
  },

  async getMoviesByDirector(directorId) {
    try {
      const director = await Director.findByPk(directorId, {
        include: {
          model: Movie,
          attributes: ['title', 'overview', 'year'],
        },
      });

      if (!director) {
        throw new Error("Director not found");
      }

      return director;
    } catch (err) {
      throw new Error("Error fetching movies for director: " + err.message);
    }
  },
};
