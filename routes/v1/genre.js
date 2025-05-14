const express = require('express');
const router = express.Router();
const GenreController = require('../../controllers/v1/genreController');

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Genre management endpoints
 */

/**
 * @swagger
 * /api/v1/genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       201:
 *         description: Genre created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', GenreController.createGenre);

/**
 * @swagger
 * /api/v1/genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: A list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/', GenreController.getAllGenres);

/**
 * @swagger
 * /api/v1/genres/{id}:
 *   get:
 *     summary: Get a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre found
 *       404:
 *         description: Genre not found
 */
router.get('/:id', GenreController.getGenreById);

/**
 * @swagger
 * /api/v1/genres/{id}:
 *   put:
 *     summary: Update a genre
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Comedy
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 */
router.put('/:id', GenreController.updateGenre);

/**
 * @swagger
 * /api/v1/genres/{id}:
 *   delete:
 *     summary: Delete a genre
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     responses:
 *       204:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 */
router.delete('/:id', GenreController.deleteGenre);

module.exports = router;
