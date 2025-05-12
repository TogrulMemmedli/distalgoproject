const express = require('express');
const router = express.Router();

const movieRouter = require('./movie.routes');
const genreRouter = require('./genre.routes');

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Endpoints for managing movies
 *   - name: Genres
 *     description: Endpoints for managing genres
 */

router.use('/movies', movieRouter);
router.use('/genres', genreRouter);

module.exports = router;
