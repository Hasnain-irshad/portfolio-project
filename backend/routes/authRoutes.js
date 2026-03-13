import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Signup admin
router.post("/signup", validators.register, validate, signup);

// Login admin
router.post("/login", validators.login, validate, login);

// Get current admin info
router.get("/me", authMiddleware, getMe);

export default router;
