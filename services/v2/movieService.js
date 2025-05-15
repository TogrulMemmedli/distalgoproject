const { Op } = require("sequelize");
const { Movie, Director, Genre, Actor } = require("../../models");

const defaultIncludes = [
  { model: Director },
  { model: Genre },
  { model: Actor }
];

const VALID_SORT_FIELDS = [
  "title", "year", "votes", "rating", "popularity", "budget", "createdAt"
];

function isValidOrder(value) {
  return ["ASC", "DESC"].includes(value.toUpperCase());
}

module.exports = {
  async getAllMovies({
    page = 1,
    limit = 10,
    genreId,
    directorId,
    sort = "createdAt",
    order = "ASC",
    search,
    actorsInclude = 1,
    genresInclude = 1
  }) {
    try {
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);

      if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
        return { status: 400, error: "Invalid pagination parameters" };
      }

      if (!isValidOrder(order)) {
        return { status: 400, error: "Invalid order parameter" };
      }

      if (!VALID_SORT_FIELDS.includes(sort)) {
        return { status: 400, error: "Invalid sort field" };
      }

      const offset = (parsedPage - 1) * parsedLimit;
      const where = {};

      if (directorId) where.DirectorId = directorId;

      if (search) {
        const searchConditions = [
          { title: { [Op.iLike]: `%${search}%` } },
          { overview: { [Op.iLike]: `%${search}%` } }
        ];
        if (!isNaN(Number(search))) {
          searchConditions.push({ year: Number(search) });
        }
        where[Op.or] = searchConditions;
      }

      const include = [{ model: Director, attributes: ["id", "name"] }];

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
        limit: parsedLimit,
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
          page: parsedPage,
          totalPages: Math.ceil(count / parsedLimit),
          movies: result,
        },
      };
    } catch (err) {
      console.error("getAllMovies error:", err.message);
      return { status: 500, error: "Failed to fetch movies" };
    }
  },

  async getMovieById(id) {
    if(isNaN(id) || Number(id) <= 0){
      return {status: 400, error: "Invalid id parameter"};
    }
    try {
      const movie = await Movie.findByPk(id, {
        include: defaultIncludes,
      });
      if (!movie) return { status: 404, error: "Movie not found" };
      return { status: 200, data: movie };
    } catch (err) {
      console.error("getMovieById error:", err.message);
      return { status: 500, error: "Failed to fetch movie" };
    }
  },

  async createMovie(data) {
    try {
      const {
        title, overview, year, votes, rating,
        popularity, budget, poster_url,
        directorId, genreIds = [], actorIds = []
      } = data;
  
      if (typeof rating !== "number" || rating < 0 || rating > 10) {
        return { status: 400, error: "Invalid rating" };
      }
  
      if (!Number.isInteger(year) || year < 1800 || year > new Date().getFullYear()) {
        return { status: 400, error: "Invalid year" };
      }
  
      const director = await Director.findByPk(directorId);
      if (!director) {
        return { status: 404, error: "Director not found" };
      }
  
      const movie = await Movie.create({
        title, overview, year, votes, rating,
        popularity, budget, poster_url,
        DirectorId: directorId,
      });

      if (genreIds.length > 0 && genreIds[0]!==0) {
        await movie.setGenres(genreIds);
      }
      if (actorIds.length > 0 && actorIds[0]!==0) {
        await movie.setActors(actorIds);
      }
  
      const fullMovie = await Movie.findByPk(movie.id, {
        include: defaultIncludes,
      });
  
      return { status: 201, data: fullMovie };
    } catch (err) {
      console.error("createMovie error:", err.message);
      return { status: 400, error: "Failed to create movie" };
    }
  },
  
  async updateMovie(id, data) {
    try {
      if (!id || typeof id !== 'number') {
        return { status: 400, error: "Invalid movie ID" };
      }
  
      const movie = await Movie.findByPk(id);
      if (!movie) return { status: 404, error: "Movie not found" };
  
      if (data.rating !== undefined) {
        if (typeof data.rating !== "number" || data.rating < 0 || data.rating > 10) {
          return { status: 400, error: "Invalid rating" };
        }
      }
  
      if (data.year !== undefined) {
        if (!Number.isInteger(data.year) || data.year < 1850 || data.year > new Date().getFullYear()) {
          return { status: 400, error: "Invalid year" };
        }
      }
  
      if (data.DirectorId !== undefined) {
        if (typeof data.DirectorId !== 'number') {
          return { status: 400, error: "Invalid DirectorId" };
        }
        const director = await Director.findByPk(data.DirectorId);
        if (!director) return { status: 404, error: "Director not found" };
      }
  
      const updatableFields = [
        "title", "overview", "year", "votes",
        "rating", "popularity", "budget", "poster_url", "DirectorId"
      ];
  
      const updateData = {};
      updatableFields.forEach(field => {
        if (data[field] !== undefined) updateData[field] = data[field];
      });
  
      await movie.update(updateData);
  
      if (Array.isArray(data.genreIds) && data.genreIds.length > 0) {
        await movie.setGenres(data.genreIds);
      }
      if (Array.isArray(data.actorIds) && data.actorIds.length > 0) {
        await movie.setActors(data.actorIds);
      }
  
      const updatedMovie = await Movie.findByPk(id, {
        include: defaultIncludes,
      });
  
      return { status: 200, data: updatedMovie };
    } catch (err) {
      console.error("updateMovie error:", err.message);
      return { status: 400, error: "Failed to update movie" };
    }
  },

  async deleteMovie(id) {
    try {
      if (!id || typeof id !== 'number') {
        return { status: 400, error: "Invalid movie ID" };
      }
  
      const movie = await Movie.findByPk(id);
      if (!movie) return { status: 404, error: "Movie not found" };
  
      await movie.destroy();
  
      return { status: 204, data: "Movie deleted" };
    } catch (err) {
      console.error("deleteMovie error:", err.message);
      return { status: 500, error: "Failed to delete movie" };
    }
  },
};
