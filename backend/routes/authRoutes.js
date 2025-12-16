import express from "express";
import { registerAdmin, loginAdmin, getMe } from "../controllers/authController.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Register admin (use once, should be protected in production)
router.post("/register", validators.register, validate, registerAdmin);

// Login admin
router.post("/login", validators.login, validate, loginAdmin);

// Get current admin info
router.get("/me", authMiddleware, getMe);

export default router;
