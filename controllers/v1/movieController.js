const MovieService = require('../../services/v1/movieService');

const createMovie = async (req, res) => {
    try {
        const movie = await MovieService.createMovie(req.body);
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await MovieService.getMovies(req.query);
        res.status(200).json({
            count: movies.count,
            data: movies.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await MovieService.getMovieById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movie = await MovieService.updateMovie(req.params.id, req.body);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        await MovieService.deleteMovie(req.params.id);
        res.status(204).send({ deleted: true});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};
