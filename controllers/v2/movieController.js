const movieService = require("../../services/v2/movieService");
const { Actor } = require("../../models/actor")
const { Genre } = require("../../models/genre")

module.exports = {
  async getAllMovies(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        genreId,
        directorId,
        sort = "createdAt",
        order = "DESC",
        search,
        actorsInclude = "0",  
        genresInclude = "0",  
      } = req.query;

      const result = await movieService.getAllMovies({
        page: parseInt(page),
        limit: parseInt(limit),
        genreId,
        directorId,
        sort,
        order,
        search,
        actorsInclude: parseInt(actorsInclude),  
        genresInclude: parseInt(genresInclude),   
      });
  
      res.status(result.status).json(result.data || { error: result.error });
    } catch (err) {
      console.error("Error in getAllMovies controller:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
,  

  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const result = await movieService.getMovieById(id);

      res.status(result.status).json(result.data || { error: result.error });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createMovie(req, res) {
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
        genreIds,
        actorIds,
      } = req.body;

      const result = await movieService.createMovie({
        title,
        overview,
        year,
        votes,
        rating,
        popularity,
        budget,
        poster_url,
        directorId,
        genreIds,
        actorIds,
      });

      res.status(result.status).json(result.data || { error: result.error });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateMovie(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
      const updateData = req.body;

      const result = await movieService.updateMovie(id, updateData);

      res.status(result.status).json(result.data || { error: result.error });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteMovie(req, res) {
    try {
      const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
      const result = await movieService.deleteMovie(id);

      if (result.status === 204) {
        res.status(204).send();
      } else {
        res.status(result.status).json({ error: result.error });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
