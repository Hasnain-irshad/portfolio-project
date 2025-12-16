import express from 'express';
import {
    getAllSkills,
    getAllSkillsAdmin,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    toggleSkillVisibility
} from '../controllers/skillController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllSkills);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllSkillsAdmin);

// Public routes continued
router.get('/:id', getSkillById);
router.post('/', authMiddleware, validators.skill, validate, createSkill);
router.put('/:id', authMiddleware, validators.skill, validate, updateSkill);
router.delete('/:id', authMiddleware, deleteSkill);
router.patch('/:id/visibility', authMiddleware, toggleSkillVisibility);

export default router;
