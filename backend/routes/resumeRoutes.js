import express from 'express';
import {
    getActiveResume,
    getAllResumes,
    uploadResume,
    deleteResume,
    setActiveResume
} from '../controllers/resumeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/', getActiveResume);

// Protected routes (Admin only)
router.get('/all', authMiddleware, getAllResumes);
router.post('/', authMiddleware, upload.single('resume'), uploadResume);
router.delete('/:id', authMiddleware, deleteResume);
router.patch('/:id/activate', authMiddleware, setActiveResume);

export default router;
