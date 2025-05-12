const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movie.controller');

router.post('/', MovieController.createMovie);
router.get('/', MovieController.getAllMovies);
router.get('/:id', MovieController.getMovieById);
router.put('/:id', MovieController.updateMovie);
router.delete('/:id', MovieController.deleteMovie);

module.exports = router;
