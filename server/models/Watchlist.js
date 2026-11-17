import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
}, { timestamps: true });

export default mongoose.model("Watchlist", watchlistSchema);
