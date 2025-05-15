const express = require('express');
const genreController = require('../../controllers/v2/genreController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: API endpoints for managing genres
 */

/**
 * @swagger
 * /api/v2/genres:
 *   get:
 *     summary: Retrieve all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: A list of all genres
 *       500:
 *         description: Internal server error
 */
router.get('/', genreController.getAllGenres);

/**
 * @swagger
 * /api/v2/genres/{id}:
 *   get:
 *     summary: Get a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Genre found
 *       404:
 *         description: Genre not found
 */
router.get('/:id', genreController.getGenreById);

/**
 * @swagger
 * /api/v2/genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Genre created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', genreController.createGenre);

/**
 * @swagger
 * /api/v2/genres/{id}:
 *   put:
 *     summary: Update a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', genreController.updateGenre);

/**
 * @swagger
 * /api/v2/genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 */
router.delete('/:id', genreController.deleteGenre);

/**
 * @swagger
 * /api/v2/genres/{id}/movies:
 *   get:
 *     summary: Get all movies for a specific genre
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Genre ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movies for the genre retrieved successfully
 *       404:
 *         description: Genre or movies not found
 */
router.get('/:id/movies', genreController.getMoviesByGenre);

module.exports = router;
