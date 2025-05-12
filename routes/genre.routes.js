const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/genre.controller');

router.post('/', GenreController.createGenre);
router.get('/', GenreController.getAllGenres);
router.get('/:id', GenreController.getGenreById);
router.put('/:id', GenreController.updateGenre);
router.delete('/:id', GenreController.deleteGenre);

module.exports = router;
