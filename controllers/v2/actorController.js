const actorService = require("../../services/v2/actorService");

module.exports = {
  async getAllActors(req, res) {
    try {
      const { page, limit, sortBy, sort } = req.query;
      const result = await actorService.getAllActors({ page, limit, sortBy, sort });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getActorById(req, res) {
    try {
      const { id } = req.params;
      const actor = await actorService.getActorById(id);
      res.status(200).json(actor);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async createActor(req, res) {
    try {
      const { name } = req.body;
      const actor = await actorService.createActor({ name });
      res.status(201).json(actor);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateActor(req, res) {
    try {
      const { id } = req.params;
      const actorData = req.body;
      const updatedActor = await actorService.updateActor(id, actorData);
      res.status(200).json(updatedActor);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteActor(req, res) {
    try {
      const { id } = req.params;
      await actorService.deleteActor(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMoviesByActor(req, res) {
    try {
      const { id } = req.params;
      const movies = await actorService.getMoviesByActor(id);
      res.status(200).json(movies);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
};
