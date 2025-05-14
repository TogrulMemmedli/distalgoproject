const directorService = require("../../services/v2/directorService");

module.exports = {
  async getAllDirectors(req, res) {
    try {
      const { page = 1, limit = 20, sortBy = "id", sort = "asc" } = req.query;
      
      const result = await directorService.getAllDirectors({
        page,
        limit,
        sortBy,
        sort
      });
      
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getDirectorById(req, res) {
    try {
      const { id } = req.params;
      const director = await directorService.getDirectorById(id);
      res.status(200).json(director);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async createDirector(req, res) {
    try {
      const { name } = req.body;
      const director = await directorService.createDirector({ name });
      res.status(201).json(director);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateDirector(req, res) {
    try {
      const { id } = req.params;
      const directorData = req.body;
      const updatedDirector = await directorService.updateDirector(id, directorData);
      res.status(200).json(updatedDirector);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteDirector(req, res) {
    try {
      const { id } = req.params;
      await directorService.deleteDirector(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMoviesByDirector(req, res) {
    try {
      const { id } = req.params;
      const movies = await directorService.getMoviesByDirector(id);
      res.status(200).json(movies);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
};
