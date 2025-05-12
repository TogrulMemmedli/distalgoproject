const express = require('express');
const router = express.Router();

const movieRouter = require('./movie.routes');
const genreRouter = require('./genre.routes');


router.use('/movies', movieRouter);
router.use('/genres', genreRouter);

module.exports = router;
