import express from 'express';
import {
    getAllActivities,
    getAllActivitiesAdmin,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityVisibility
} from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

const activityUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]);

// Public routes
router.get('/', getAllActivities);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllActivitiesAdmin);

// Public routes continued
router.get('/:id', getActivityById);
router.post('/', authMiddleware, activityUpload, validators.activity, validate, createActivity);
router.put('/:id', authMiddleware, activityUpload, validators.activity, validate, updateActivity);
router.delete('/:id', authMiddleware, deleteActivity);
router.patch('/:id/visibility', authMiddleware, toggleActivityVisibility);

export default router;
