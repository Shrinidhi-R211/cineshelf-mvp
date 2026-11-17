import { Router } from "express";
import requireDatabase from "../config/requireDatabase.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();
router.use(requireDatabase, authenticate);
router.get("/", getWatchlist);
router.post("/:movieId", addToWatchlist);
router.delete("/:movieId", removeFromWatchlist);

export default router;
