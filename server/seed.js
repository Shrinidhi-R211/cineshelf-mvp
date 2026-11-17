import "dotenv/config";
import mongoose from "mongoose";
import Movie from "./models/Movie.js";

const movies = [
  {
    title: "The Last Horizon", slug: "the-last-horizon", year: 2025, rating: "TV-14", duration: "2h 08m",
    genres: ["Adventure", "Sci-Fi"], featured: true,
    description: "When a signal arrives from beyond the solar system, a small crew sets out to find the last place anyone expected to find hope.",
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Blue Summer", slug: "blue-summer", year: 2024, rating: "TV-14", duration: "1h 52m",
    genres: ["Drama", "Romance"], featured: false,
    description: "A quiet seaside town, an unexpected reunion, and one summer that changes the way two old friends see home.",
    poster: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Midnight Signal", slug: "midnight-signal", year: 2025, rating: "TV-MA", duration: "1h 46m",
    genres: ["Thriller", "Mystery"], featured: true,
    description: "A late-night radio host receives a call that predicts the next day's events, then hears her own voice on the line.",
    poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Wildwood", slug: "wildwood", year: 2023, rating: "PG", duration: "1h 58m",
    genres: ["Adventure", "Family"], featured: false,
    description: "Two siblings follow a hidden trail into an old forest and discover a world that needs their help getting home.",
    poster: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "The Long Way Home", slug: "the-long-way-home", year: 2024, rating: "PG-13", duration: "2h 01m",
    genres: ["Drama", "Adventure"], featured: false,
    description: "After a missed train, a stranger's road trip becomes a moving journey through the people and places that shaped him.",
    poster: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Orbit Nine", slug: "orbit-nine", year: 2025, rating: "TV-14", duration: "1h 54m",
    genres: ["Sci-Fi", "Thriller"], featured: true,
    description: "Alone on a damaged research station, an engineer must decide whether the voice in the ship's computer can be trusted.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Second Take", slug: "second-take", year: 2023, rating: "PG-13", duration: "1h 39m",
    genres: ["Comedy", "Romance"], featured: false,
    description: "A struggling filmmaker and a skeptical critic keep crossing paths while making very different movies about the same city.",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Golden Hour", slug: "golden-hour", year: 2024, rating: "TV-14", duration: "1h 48m",
    genres: ["Drama", "Family"], featured: false,
    description: "Three generations return to the family farm to decide what comes next, finding more than one reason to stay.",
    poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80",
    backdrop: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
  },
];

if (!process.env.MONGO_URI) {
  console.error("Add MONGO_URI to server/.env before seeding the catalog.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  await Promise.all(movies.map((movie) => Movie.updateOne({ slug: movie.slug }, { $set: movie }, { upsert: true })));
  console.log(`Seeded ${movies.length} movies into the catalog.`);
} catch (error) {
  console.error(`Could not seed the catalog: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
