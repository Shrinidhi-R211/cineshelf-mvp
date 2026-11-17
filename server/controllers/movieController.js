import Movie from "../models/Movie.js";

export async function listMovies(request, response, next) {
  try {
    const filter = {};
    if (request.query.genre) filter.genres = request.query.genre;
    if (request.query.q) filter.title = { $regex: request.query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const movies = await Movie.find(filter).sort({ featured: -1, title: 1 }).lean();
    response.json({ movies });
  } catch (error) {
    next(error);
  }
}

export async function getMovie(request, response, next) {
  try {
    const movie = await Movie.findById(request.params.id).lean();
    if (!movie) return response.status(404).json({ message: "Movie not found." });
    response.json({ movie });
  } catch (error) {
    next(error);
  }
}
