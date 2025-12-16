import express from 'express';
import {
    getAllEducation,
    getAllEducationAdmin,
    getEducationById,
    createEducation,
    updateEducation,
    deleteEducation,
    toggleEducationVisibility
} from '../controllers/educationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllEducation);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllEducationAdmin);

// Public routes continued
router.get('/:id', getEducationById);
router.post('/', authMiddleware, validators.education, validate, createEducation);
router.put('/:id', authMiddleware, validators.education, validate, updateEducation);
router.delete('/:id', authMiddleware, deleteEducation);
router.patch('/:id/visibility', authMiddleware, toggleEducationVisibility);

export default router;