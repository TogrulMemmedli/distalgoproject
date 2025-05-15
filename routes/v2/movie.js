const express = require('express');
const movieController = require('../../controllers/v2/movieController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API endpoints for managing movies
 */

/**
 * @swagger
 * /api/v2/movies:
 *   get:
 *     summary: Retrieve all movies
 *     description: >
 *       Fetch a list of movies with support for pagination, filtering by genre and director,
 *       sorting, searching by title/overview/year, and optionally including related actors and genres.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination (default is 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of movies per page (default is 10)
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: genreId
 *         description: Filter movies by genre ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: directorId
 *         description: Filter movies by director ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         description: Field to sort by (e.g., "createdAt", "title")
 *         schema:
 *           type: string
 *           default: "createdAt"
 *       - in: query
 *         name: order
 *         description: Sort order (ASC or DESC)
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: "DESC"
 *       - in: query
 *         name: search
 *         description: >
 *           Search term to filter movies by title, overview, or year (supports partial matching)
 *         schema:
 *           type: string
 *       - in: query
 *         name: actorsInclude
 *         description: Whether to include actor information (1 = include, 0 = exclude)
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *           default: 0
 *       - in: query
 *         name: genresInclude
 *         description: Whether to include genre information (1 = include, 0 = exclude)
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *           default: 0
 *     responses:
 *       200:
 *         description: List of movies based on the query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of movies available
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages based on the limit
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       overview:
 *                         type: string
 *                       year:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       director:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       genres:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                       actors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *       400:
 *         description: Bad request, invalid query parameters
 *       404:
 *         description: No movies found for the given criteria
 *       500:
 *         description: Internal server error
 */
router.get('/', movieController.getAllMovies);


/**
 * @swagger
 * /api/v2/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 */
router.get('/:id', movieController.getMovieById);

/**
 * @swagger
 * /api/v2/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               year:
 *                 type: integer
 *               votes:
 *                 type: integer
 *               rating:
 *                 type: number
 *               popularity:
 *                 type: number
 *               budget:
 *                 type: number
 *               poster_url:
 *                 type: string
 *               directorId:
 *                 type: integer
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               actorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', movieController.createMovie);

/**
 * @swagger
 * /api/v2/movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               year:
 *                 type: integer
 *               votes:
 *                 type: integer
 *               rating:
 *                 type: number
 *               popularity:
 *                 type: number
 *               budget:
 *                 type: number
 *               poster_url:
 *                 type: string
 *               directorId:
 *                 type: integer
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               actorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', movieController.updateMovie);

/**
 * @swagger
 * /api/v2/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
