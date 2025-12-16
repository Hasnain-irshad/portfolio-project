import express from 'express';
import {
    getAllAchievements,
    getAllAchievementsAdmin,
    getAchievementById,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    toggleAchievementVisibility
} from '../controllers/achievementController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllAchievements);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllAchievementsAdmin);

// Public routes continued
router.get('/:id', getAchievementById);
router.post('/', authMiddleware, validators.achievement, validate, createAchievement);
router.put('/:id', authMiddleware, validators.achievement, validate, updateAchievement);
router.delete('/:id', authMiddleware, deleteAchievement);
router.patch('/:id/visibility', authMiddleware, toggleAchievementVisibility);

export default router;