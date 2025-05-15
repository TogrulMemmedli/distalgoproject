const movieService = require("../services/v2/movieService");
const { Movie, Director, Genre, Actor } = require("../models");

jest.mock("../models");

describe("Movie Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMovies", () => {
    it("should return movies successfully with valid pagination", async () => {
      Movie.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            toJSON: () => ({
              id: 1,
              title: "Test Movie",
              Genres: [{ id: 1, name: "Action" }],
              Actors: [{ id: 1, name: "John Doe" }],
            }),
          },
        ],
      });

      const result = await movieService.getAllMovies({ page: 1, limit: 10 });

      expect(result.status).toBe(200);
      expect(result.data.movies.length).toBe(1);
      expect(Movie.findAndCountAll).toHaveBeenCalled();
    });

    it("should return 400 error when pagination parameters are not numbers", async () => {
      const result = await movieService.getAllMovies({ page: "a", limit: "b" });
      expect(result.status).toBe(400);
    });

    it("should return 400 error when pagination limit is zero or negative", async () => {
      const result1 = await movieService.getAllMovies({ page: 1, limit: 0 });
      const result2 = await movieService.getAllMovies({ page: 1, limit: -5 });
      expect(result1.status).toBe(400);
      expect(result2.status).toBe(400);
    });

    it("should return 400 error when pagination page is zero or negative", async () => {
      const result1 = await movieService.getAllMovies({ page: 0, limit: 10 });
      const result2 = await movieService.getAllMovies({ page: -1, limit: 10 });
      expect(result1.status).toBe(400);
      expect(result2.status).toBe(400);
    });

    it("should return 500 error when database query fails", async () => {
      Movie.findAndCountAll.mockRejectedValue(new Error("DB Error"));
      const result = await movieService.getAllMovies({ page: 1, limit: 10 });
      expect(result.status).toBe(500);
    });

    it("should return empty movie list and total 0 when no movies found", async () => {
      Movie.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });
      const result = await movieService.getAllMovies({ page: 1, limit: 10 });
      expect(result.status).toBe(200);
      expect(result.data.movies).toEqual([]);
      expect(result.data.total).toBe(0);
    });
  });

  describe("getMovieById", () => {
    it("should return movie details with status 200 when movie exists", async () => {
      Movie.findByPk.mockResolvedValue({ id: 1, title: "Test" });
      const result = await movieService.getMovieById(1);
      expect(result.status).toBe(200);
      expect(result.data.title).toBe("Test");
    });

    it("should return 404 status when movie is not found by ID", async () => {
      Movie.findByPk.mockResolvedValue(null);
      const result = await movieService.getMovieById(9999);
      expect(result.status).toBe(404);
    });

    it("should return 400 status when the provided movie ID is invalid (not a number)", async () => {
      const result = await movieService.getMovieById("abc");
      expect(result.status).toBe(400);
    });

    it("should return 500 status when database query throws an error", async () => {
      Movie.findByPk.mockRejectedValue(new Error("DB Error"));
      const result = await movieService.getMovieById(1);
      expect(result.status).toBe(500);
    });
  });

  describe("createMovie", () => {
    it("should create a new movie successfully and associate genres and actors", async () => {
      const mockMovie = {
        id: 1,
        setGenres: jest.fn(),
        setActors: jest.fn(),
      };

      Movie.create.mockResolvedValue(mockMovie);
      Movie.findByPk.mockResolvedValue({ id: 1, title: "Created Movie" });

      const result = await movieService.createMovie({
        title: "New Movie",
        overview: "desc",
        year: 2025,
        votes: 1000,
        rating: 9,
        popularity: 100,
        budget: 50000,
        poster_url: "url",
        directorId: 1,
        genreIds: [1],
        actorIds: [1],
      });

      expect(result.status).toBe(201);
      expect(Movie.create).toHaveBeenCalled();
      expect(mockMovie.setGenres).toHaveBeenCalledWith([1]);
      expect(mockMovie.setActors).toHaveBeenCalledWith([1]);
    });

    it("should return 400 error when creating movie with invalid or missing data", async () => {
      Movie.create.mockRejectedValue(new Error("Validation error"));
      const result = await movieService.createMovie({ title: "Invalid" });
      expect(result.status).toBe(400);
    });

    it("should skip associating genres and actors when empty arrays are provided", async () => {
      const mockMovie = {
        id: 2,
        setGenres: jest.fn(),
        setActors: jest.fn(),
      };
      Movie.create.mockResolvedValue(mockMovie);
      Movie.findByPk.mockResolvedValue({ id: 2, title: "Test Movie 2" });

      const result = await movieService.createMovie({
        title: "Movie 2",
        overview: "desc",
        year: 2025,
        votes: 500,
        rating: 7,
        popularity: 80,
        budget: 30000,
        poster_url: "url2",
        directorId: 1,
        genreIds: [],
        actorIds: [],
      });

      expect(result.status).toBe(201);
      expect(mockMovie.setGenres).not.toHaveBeenCalled();
      expect(mockMovie.setActors).not.toHaveBeenCalled();
    });

    it("should return 404 error when provided directorId does not exist", async () => {
      Director.findByPk = jest.fn().mockResolvedValue(null);

      const result = await movieService.createMovie({
        title: "Movie With Invalid Director",
        directorId: 9999,
        rating: 5,
        year: 2000,
        genreIds: [1],
        actorIds: [1],
      });

      expect(Director.findByPk).toHaveBeenCalledWith(9999);
      expect(result.status).toBe(404);
    });

    it("should return 400 error when rating is outside allowed range", async () => {
      const result = await movieService.createMovie({
        title: "Invalid Rating",
        rating: 11,
        genreIds: [1],
        actorIds: [1],
      });
      expect(result.status).toBe(400);
    });

    it("should return 400 error when year is not a valid number", async () => {
      const result = await movieService.createMovie({
        title: "Invalid Year",
        year: "not a number",
        genreIds: [1],
        actorIds: [1],
      });
      expect(result.status).toBe(400);
    });
  });

  describe("updateMovie", () => {
    it("should update movie fields and associations successfully", async () => {
      const mockMovie = {
        update: jest.fn(),
        setGenres: jest.fn(),
        setActors: jest.fn(),
      };
  
      Movie.findByPk.mockResolvedValueOnce(mockMovie);
      Movie.findByPk.mockResolvedValueOnce({ id: 1, title: "Updated" });
  
      const result = await movieService.updateMovie(1, {
        title: "Updated",
        genreIds: [2],
        actorIds: [3],
      });
  
      expect(result.status).toBe(200);
      expect(mockMovie.update).toHaveBeenCalledWith({ title: "Updated" });
      expect(mockMovie.setGenres).toHaveBeenCalledWith([2]);
      expect(mockMovie.setActors).toHaveBeenCalledWith([3]);
    });

    it("should not update genre or actor associations when empty arrays are passed", async () => {
      const mockMovie = {
        update: jest.fn(),
        setGenres: jest.fn(),
        setActors: jest.fn(),
      };

      Movie.findByPk.mockResolvedValueOnce(mockMovie);
      Movie.findByPk.mockResolvedValueOnce({ id: 1, title: "Updated" });

      const result = await movieService.updateMovie(1, {
        title: "Updated Again",
        genreIds: [],
        actorIds: [],
      });

      expect(result.status).toBe(200);
      expect(mockMovie.setGenres).not.toHaveBeenCalled();
      expect(mockMovie.setActors).not.toHaveBeenCalled();
    });

    it("should return 404 status when movie to update does not exist", async () => {
      Movie.findByPk.mockResolvedValue(null);
      const result = await movieService.updateMovie(1, { title: "x" });
      expect(result.status).toBe(404);
    });

    it("should return 400 status when update operation throws an error", async () => {
      Movie.findByPk.mockRejectedValue(new Error("Update error"));
      const result = await movieService.updateMovie(1, { title: "x" });
      expect(result.status).toBe(400);
    });

    it("should return 400 status when provided ID for update is invalid", async () => {
      const result = await movieService.updateMovie("abc", { title: "x" });
      expect(result.status).toBe(400);
    });
  });

  describe("deleteMovie", () => {
    it("should delete movie and return 204 status on success", async () => {
      const mockMovie = { destroy: jest.fn() };
      Movie.findByPk.mockResolvedValue(mockMovie);
      const result = await movieService.deleteMovie(1);
      expect(result.status).toBe(204);
      expect(mockMovie.destroy).toHaveBeenCalled();
    });

    it("should return 404 status when trying to delete a non-existing movie", async () => {
      Movie.findByPk.mockResolvedValue(null);
      const result = await movieService.deleteMovie(1);
      expect(result.status).toBe(404);
    });

    it("should return 500 status when deletion fails due to database error", async () => {
      Movie.findByPk.mockRejectedValue(new Error("Delete error"));
      const result = await movieService.deleteMovie(1);
      expect(result.status).toBe(500);
    });

    it("should return 400 status when provided ID for deletion is invalid", async () => {
      const result = await movieService.deleteMovie("abc");
      expect(result.status).toBe(400);
    });
  });
});
