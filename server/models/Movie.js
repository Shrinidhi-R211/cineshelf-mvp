import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: String, default: "TV-14" },
  duration: { type: String, required: true },
  genres: [{ type: String, required: true }],
  poster: { type: String, required: true },
  backdrop: { type: String, required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
