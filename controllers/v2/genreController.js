const genreService = require("../../services/v2/genreService");

module.exports = {
  async getAllGenres(req, res) {
    try {
      const result = await genreService.getAllGenres();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getGenreById(req, res) {
    try {
      const { id } = req.params;
      const genre = await genreService.getGenreById(id);
      if (genre.status === 404) {
        return res.status(genre.status).json({ error: genre.error });
      }
      res.status(200).json(genre.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createGenre(req, res) {
    try {
      const { name } = req.body;
      const genre = await genreService.createGenre({ name });
      res.status(201).json(genre.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateGenre(req, res) {
    try {
      const { id } = req.params;
      const genreData = req.body;
      const updatedGenre = await genreService.updateGenre(id, genreData);
      if (updatedGenre.status === 404) {
        return res.status(updatedGenre.status).json({ error: updatedGenre.error });
      }
      res.status(200).json(updatedGenre.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteGenre(req, res) {
    try {
      const { id } = req.params;
      const result = await genreService.deleteGenre(id);
      if (result.status === 404) {
        return res.status(result.status).json({ error: result.error });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMoviesByGenre(req, res) {
    try {
      const { id } = req.params;
      const movies = await genreService.getMoviesByGenre(id);
      if (movies.status === 404) {
        return res.status(movies.status).json({ error: movies.error });
      }
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
