import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all dashboard routes
router.use(authMiddleware);

router.get("/", getDashboardStats);

export default router;
