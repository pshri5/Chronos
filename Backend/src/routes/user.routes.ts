import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, updateUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secure routes (require authentication)
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/update").patch(verifyJWT, updateUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;