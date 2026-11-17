import { Router } from "express";
import requireDatabase from "../config/requireDatabase.js";
import { currentUser, login, register } from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();
router.use(requireDatabase);
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, currentUser);

export default router;
