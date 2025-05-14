const express = require('express');
const router = express.Router();

const movieRouter = require('./movie');
const genreRouter = require('./genre');

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
