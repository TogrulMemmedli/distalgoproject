const express = require("express");

const movieRoutes = require("./movie");
const actorRoutes = require("./actor");
const directorRoutes = require("./director");
const genreRoutes = require("./genre");

const router = express.Router();

router.use("/movies", movieRoutes);
router.use("/actors", actorRoutes);
router.use("/directors", directorRoutes);
router.use("/genres", genreRoutes);

module.exports = router;
