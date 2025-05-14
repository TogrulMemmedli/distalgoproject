const { Op } = require('sequelize');
const { Movie, Genre } = require('../../models/');

const createMovie = async (data) => {
    const movie = await Movie.create(data);
    if (data.genreIds) {
        await movie.setGenres(data.genreIds);
    }
    return movie;
};

const getMovies = async (query) => {
    const { title, genre, page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = query;
    const where = {};

    if (title) {
        where.title = {
            [Op.iLike]: `%${title}%`
        };
    }

    const offset = (page - 1) * parseInt(limit);

    let include = [{
        model: Genre,
        through: { attributes: [] } 
    }];

    if (genre) {
        const genreIds = genre.split(',').map(id => parseInt(id));
        include = [{
            model: Genre,
            where: {
                id: {
                    [Op.in]: genreIds
                }
            },
            through: { attributes: [] },
            required: true 
        }];
    }
    return Movie.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        order: [[sort, order.toUpperCase()]],
        include,
        distinct: true 
    });
};

const getMovieById = async (id) => {
    return Movie.findByPk(id, {
        include: Genre,
    });
};

const updateMovie = async (id, data) => {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error('Movie not found');
    return movie.update(data);
};

const deleteMovie = async (id) => {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error('Movie not found');
    return movie.destroy();
};

module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};
