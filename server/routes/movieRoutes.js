import { Router } from "express";
import requireDatabase from "../config/requireDatabase.js";
import { getMovie, listMovies } from "../controllers/movieController.js";

const router = Router();
router.use(requireDatabase);
router.get("/", listMovies);
router.get("/:id", getMovie);

export default router;
