import express from 'express';
import {
    getAllPublications,
    getAllPublicationsAdmin,
    getPublicationById,
    createPublication,
    updatePublication,
    deletePublication,
    togglePublicationVisibility
} from '../controllers/publicationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

const publicationUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]);

// Public routes
router.get('/', getAllPublications);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllPublicationsAdmin);

// Public routes continued
router.get('/:id', getPublicationById);
router.post('/', authMiddleware, publicationUpload, validators.publication, validate, createPublication);
router.put('/:id', authMiddleware, publicationUpload, validators.publication, validate, updatePublication);
router.delete('/:id', authMiddleware, deletePublication);
router.patch('/:id/visibility', authMiddleware, togglePublicationVisibility);

export default router;
