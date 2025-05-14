const { Actor, Movie } = require("../../models");

module.exports = {
    async getAllActors({ page = 1, limit = 20, sortBy = "id", sort = "asc" }) {
        try {
          const offset = (page - 1) * limit;
          const orderDirection = sort === "desc" ? "DESC" : "ASC";
      
          const validSortFields = ["name", "id"]; 
          if (!validSortFields.includes(sortBy)) {
            return { status: 400, error: "Invalid sortBy field" };
          }
      
          const { count, rows } = await Actor.findAndCountAll({
            limit,
            offset,
            order: [[sortBy, orderDirection]], 
          });
      
          return {
            status: 200,
            data: {
              total: count,
              actors: rows,
              totalPages: Math.ceil(count / limit),
              currentPage: page,
            },
          };
        } catch (err) {
          return { status: 500, error: "Failed to fetch actors" };
        }
      }
      
      ,

  async getActorById(id) {
    try {
      const actor = await Actor.findByPk(id, {
        include: Movie,
      });
      if (!actor) return { status: 404, error: "Actor not found" };
      return { status: 200, data: actor };
    } catch (err) {
      return { status: 500, error: "Failed to fetch actor" };
    }
  },

  async createActor(data) {
    try {
      const actor = await Actor.create(data);
      return { status: 201, data: actor };
    } catch (err) {
      return { status: 400, error: err.message };
    }
  },

  async updateActor(id, data) {
    try {
      const actor = await Actor.findByPk(id);
      if (!actor) return { status: 404, error: "Actor not found" };

      await actor.update(data);
      return { status: 200, data: actor };
    } catch (err) {
      return { status: 400, error: err.message };
    }
  },

  async deleteActor(id) {
    try {
      const actor = await Actor.findByPk(id);
      if (!actor) return { status: 404, error: "Actor not found" };

      await actor.destroy();
      return { status: 204 };
    } catch (err) {
      return { status: 500, error: "Failed to delete actor" };
    }
  },

  async getMoviesByActor(id) {
    try {
      const actor = await Actor.findByPk(id);
      if (!actor) return { status: 404, error: "Actor not found" };

      const movies = await actor.getMovies();
      return { status: 200, actor: actor, data: movies };
    } catch (err) {
      return { status: 500, error: "Failed to fetch movies by actor" };
    }
  },
};
