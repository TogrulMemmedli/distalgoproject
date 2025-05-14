const express = require("express");
const actorController = require("../../controllers/v2/actorController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Actors
 *   description: API endpoints for managing actors
 */

/**
 * @swagger
 * /api/v2/actors:
 *   get:
 *     summary: Retrieve all actors with pagination
 *     tags: [Actors]
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
 *         description: Field to sort by (either 'id' or 'name')
 *         schema:
 *           type: string
 *           default: "id"
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Sorting direction, either 'asc' for ascending or 'desc' for descending
 *         schema:
 *           type: string
 *           default: "asc"
 *     responses:
 *       200:
 *         description: A paginated list of actors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of actors
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 actors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The actor ID
 *                       name:
 *                         type: string
 *                         description: The name of the actor
 *       500:
 *         description: Internal server error
 */
router.get("/", actorController.getAllActors);

/**
 * @swagger
 * /api/v2/actors/{id}:
 *   get:
 *     summary: Get an actor by ID
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Actor ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actor found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The actor ID
 *                 name:
 *                   type: string
 *                   description: The name of the actor
 *       404:
 *         description: Actor not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", actorController.getActorById);

/**
 * @swagger
 * /api/v2/actors:
 *   post:
 *     summary: Create a new actor
 *     tags: [Actors]
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
 *         description: Actor created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", actorController.createActor);

/**
 * @swagger
 * /api/v2/actors/{id}:
 *   put:
 *     summary: Update an actor by ID
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Actor ID
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
 *         description: Actor updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Actor not found
 */
router.put("/:id", actorController.updateActor);

/**
 * @swagger
 * /api/v2/actors/{id}:
 *   delete:
 *     summary: Delete an actor by ID
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Actor ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Actor deleted successfully
 *       404:
 *         description: Actor not found
 */
router.delete("/:id", actorController.deleteActor);

/**
 * @swagger
 * /api/v2/actors/{id}/movies:
 *   get:
 *     summary: Get all movies acted by a specific actor
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Actor ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The movie ID
 *                   title:
 *                     type: string
 *                     description: The movie title
 *       404:
 *         description: Actor or movies not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/movies", actorController.getMoviesByActor);

module.exports = router;
