const { Genre } = require('../../models');

const createGenre = async (data) => {
    return Genre.create(data);
};

const getGenres = async () => {
    return Genre.findAll();
};

const getGenreById = async (id) => {
    return Genre.findByPk(id);
};

const updateGenre = async (id, data) => {
    const genre = await Genre.findByPk(id);
    if (!genre) throw new Error('Genre not found');
    return genre.update(data);
};

const deleteGenre = async (id) => {
    const genre = await Genre.findByPk(id);
    if (!genre) throw new Error('Genre not found');
    return genre.destroy();
};

module.exports = {
    createGenre,
    getGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
};
