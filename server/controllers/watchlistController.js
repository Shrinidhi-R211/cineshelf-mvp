import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Watchlist from "../models/Watchlist.js";

export async function getWatchlist(request, response, next) {
  try {
    const watchlist = await Watchlist.findOne({ user: request.user.id }).populate("movies").lean();
    response.json({ movies: watchlist?.movies ?? [] });
  } catch (error) {
    next(error);
  }
}

export async function addToWatchlist(request, response, next) {
  try {
    const { movieId } = request.params;
    if (!mongoose.isValidObjectId(movieId)) return response.status(400).json({ message: "Invalid movie." });
    if (!(await Movie.exists({ _id: movieId }))) return response.status(404).json({ message: "Movie not found." });
    const watchlist = await Watchlist.findOneAndUpdate(
      { user: request.user.id },
      { $addToSet: { movies: movieId } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).populate("movies");
    response.json({ movies: watchlist.movies });
  } catch (error) {
    next(error);
  }
}

export async function removeFromWatchlist(request, response, next) {
  try {
    const { movieId } = request.params;
    if (!mongoose.isValidObjectId(movieId)) return response.status(400).json({ message: "Invalid movie." });
    const watchlist = await Watchlist.findOneAndUpdate(
      { user: request.user.id },
      { $pull: { movies: movieId } },
      { new: true },
    ).populate("movies");
    response.json({ movies: watchlist?.movies ?? [] });
  } catch (error) {
    next(error);
  }
}
