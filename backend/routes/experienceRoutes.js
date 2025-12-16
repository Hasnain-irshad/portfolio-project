import express from 'express';
import {
    getAllExperiences,
    getAllExperiencesAdmin,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    toggleExperienceVisibility
} from '../controllers/experienceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllExperiences);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllExperiencesAdmin);

// Public routes continued
router.get('/:id', getExperienceById);
// Allow optional company logo upload (frontend may send a file named 'logo')
router.post('/', authMiddleware, upload.single('logo'), validators.experience, validate, createExperience);
router.put('/:id', authMiddleware, upload.single('logo'), validators.experience, validate, updateExperience);
router.delete('/:id', authMiddleware, deleteExperience);
router.patch('/:id/visibility', authMiddleware, toggleExperienceVisibility);

export default router;
