const { Op } = require("sequelize");
const { Movie, Director, Genre, Actor } = require("../../models");

const defaultIncludes = [
  { model: Director },
  { model: Genre },
  { model: Actor }
];

module.exports = {
  async getAllMovies({
    page = 1,
    limit = 10,
    genreId,
    directorId,
    sort = "createdAt",
    order = "DESC",
    search,
    actorsInclude = 1,
    genresInclude = 1
  }) {
    console.log("Service:");
    console.log({ page, limit, genreId, directorId, sort, order, search, actorsInclude, genresInclude });
  
    try {
      const offset = (page - 1) * limit;
      const where = {};
  
      if (directorId) where.DirectorId = directorId;
  
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { overview: { [Op.iLike]: `%${search}%` } },
          !isNaN(search) ? { year: Number(search) } : null,
        ].filter(Boolean);
      }
  
      const include = [{
        model: Director,
        attributes: ['id', 'name'],
      }];
  
      if (genresInclude || genreId) {
        const genreOptions = {
          model: Genre,
          through: { attributes: [] },
        };
        if (genreId) genreOptions.where = { id: genreId };
        include.push(genreOptions);
      }
  
      if (actorsInclude) {
        include.push({
          model: Actor,
          through: { attributes: [] },
        });
      }
  
      const { count, rows } = await Movie.findAndCountAll({
        where,
        include,
        limit,
        offset,
        order: [[sort, order.toUpperCase()]],
        distinct: true,
      });
  
      const result = rows.map(row => {
        const movie = row.toJSON(); 
        if (!actorsInclude) delete movie.Actors;
        if (!genresInclude) delete movie.Genres;
        return movie;
      });
  
      return {
        status: 200,
        data: {
          total: count,
          page,
          totalPages: Math.ceil(count / limit),
          movies: result,
        },
      };
    } catch (err) {
      console.error("getAllMovies error:", err);
      return { status: 500, error: "Failed to fetch movies" };
    }
  }
  
,  

  async getMovieById(id) {
    try {
      const movie = await Movie.findByPk(id, {
        include: defaultIncludes,
      });
      if (!movie) return { status: 404, error: "Movie not found" };
      return { status: 200, data: movie };
    } catch (err) {
      console.error("getMovieById error:", err);
      return { status: 500, error: "Failed to fetch movie" };
    }
  },

  async createMovie(data) {
    try {
      const {
        title,
        overview,
        year,
        votes,
        rating,
        popularity,
        budget,
        poster_url,
        directorId,
        genreIds = [],
        actorIds = [],
      } = data;

      const movie = await Movie.create({
        title,
        overview,
        year,
        votes,
        rating,
        popularity,
        budget,
        poster_url,
        DirectorId: directorId,
      });

      await movie.setGenres(genreIds);
      await movie.setActors(actorIds);

      const fullMovie = await Movie.findByPk(movie.id, { include: defaultIncludes });

      return { status: 201, data: fullMovie };
    } catch (err) {
      console.error("createMovie error:", err);
      return { status: 400, error: err.message || "Failed to create movie" };
    }
  },

  async updateMovie(id, data) {
    try {
      const movie = await Movie.findByPk(id);
      if (!movie) return { status: 404, error: "Movie not found" };

      const updatableFields = [
        "title", "overview", "year", "votes",
        "rating", "popularity", "budget", "poster_url", "DirectorId"
      ];

      const updateData = {};
      updatableFields.forEach(field => {
        if (data[field] !== undefined) updateData[field] = data[field];
      });

      await movie.update(updateData);

      if (data.genreIds) await movie.setGenres(data.genreIds);
      if (data.actorIds) await movie.setActors(data.actorIds);

      const updatedMovie = await Movie.findByPk(id, { include: defaultIncludes });

      return { status: 200, data: updatedMovie };
    } catch (err) {
      console.error("updateMovie error:", err);
      return { status: 400, error: err.message || "Failed to update movie" };
    }
  },

  async deleteMovie(id) {
    try {
      const movie = await Movie.findByPk(id);
      if (!movie) return { status: 404, error: "Movie not found" };

      await movie.destroy();
      return { status: 204, data: "Movie deleted" };
    } catch (err) {
      console.error("deleteMovie error:", err);
      return { status: 500, error: "Failed to delete movie" };
    }
  },
};
