import express from 'express';
import {
    getAllProjects,
    getAllProjectsAdmin,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    toggleProjectVisibility
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllProjectsAdmin);

// Public routes continued
router.get('/:id', getProjectById);
router.post('/', authMiddleware, upload.array('images', 5), createProject);
router.put('/:id', authMiddleware, upload.array('images', 5), updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.patch('/:id/visibility', authMiddleware, toggleProjectVisibility);

export default router;
