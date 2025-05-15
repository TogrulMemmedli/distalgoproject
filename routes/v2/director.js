const express = require('express');
const directorController = require('../../controllers/v2/directorController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Directors
 *   description: API endpoints for managing directors
 */

/**
 * @swagger
 * /api/v2/directors:
 *   get:
 *     summary: Retrieve all directors
 *     tags: [Directors]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Field to sort by (id or name)
 *         schema:
 *           type: string
 *           enum: [id, name]
 *           default: id
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Sort direction (asc or desc)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: A list of all directors
 *       500:
 *         description: Internal server error
 */
router.get('/', directorController.getAllDirectors);

/**
 * @swagger
 * /api/v2/directors/{id}:
 *   get:
 *     summary: Get a director by ID
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Director ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Director found
 *       404:
 *         description: Director not found
 */
router.get('/:id', directorController.getDirectorById);

/**
 * @swagger
 * /api/v2/directors:
 *   post:
 *     summary: Create a new director
 *     tags: [Directors]
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
 *         description: Director created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', directorController.createDirector);

/**
 * @swagger
 * /api/v2/directors/{id}:
 *   put:
 *     summary: Update a director by ID
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Director ID
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
 *         description: Director updated successfully
 *       404:
 *         description: Director not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', directorController.updateDirector);

/**
 * @swagger
 * /api/v2/directors/{id}:
 *   delete:
 *     summary: Delete a director by ID
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Director ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Director deleted successfully
 *       404:
 *         description: Director not found
 */
router.delete('/:id', directorController.deleteDirector);

/**
 * @swagger
 * /api/v2/directors/{id}/movies:
 *   get:
 *     summary: Get all movies directed by a specific director
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Director ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movies for the director retrieved successfully
 *       404:
 *         description: Director or movies not found
 */
router.get('/:id/movies', directorController.getMoviesByDirector);

module.exports = router;
