const GenreService = require('../../services/v1/genreService');

const createGenre = async (req, res) => {
    try {
        const genre = await GenreService.createGenre(req.body);
        res.status(201).json(genre);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllGenres = async (req, res) => {
    try {

        const genres = await GenreService.getGenres();
        res.status(200).json(genres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getGenreById = async (req, res) => {
    try {
        const genre = await GenreService.getGenreById(req.params.id);
        if (!genre) return res.status(404).json({ error: 'Genre not found' });
        res.status(200).json(genre);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateGenre = async (req, res) => {
    try {
        const genre = await GenreService.updateGenre(req.params.id, req.body);
        res.status(200).json(genre);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteGenre = async (req, res) => {
    try {
        await GenreService.deleteGenre(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
};
