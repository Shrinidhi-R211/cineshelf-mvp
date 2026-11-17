import "dotenv/config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import connectDatabase from "./config/connectDatabase.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", async (_request, response) => {
  try {
    await connectDatabase();
  } catch {
    // Keep the API health endpoint available so setup problems are easy to inspect.
  }
  response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected", app: "CineShelf API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({ message: error.message || "Something went wrong." });
});

if (process.env.MONGO_URI) {
  connectDatabase()
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error(`MongoDB is not connected: ${error.message}`));
}

const isDirectExecution = process.argv[1]
  && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isDirectExecution) app.listen(port, () => console.log(`CineShelf API listening on http://localhost:${port}`));

export default app;
