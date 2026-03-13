import express from 'express';
import {
    getProfile,
    updateProfile,
    uploadProfileImage,
    uploadBackgroundImage,
    toggleVisibility
} from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getProfile);

// Protected routes (Admin only)
router.put('/', authMiddleware, validators.profile, validate, updateProfile);
router.post('/image', authMiddleware, upload.single('image'), uploadProfileImage);
router.post('/background', authMiddleware, upload.single('image'), uploadBackgroundImage);
router.patch('/visibility', authMiddleware, toggleVisibility);

export default router;
