import express from 'express';
import {
    getAllBlogs,
    getAllBlogsAdmin,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogVisibility
} from '../controllers/blogController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

const blogUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]);

// Public routes
router.get('/', getAllBlogs);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllBlogsAdmin);

// Public routes continued
router.get('/:id', getBlogById);
router.post('/', authMiddleware, blogUpload, validators.blog, validate, createBlog);
router.put('/:id', authMiddleware, blogUpload, validators.blog, validate, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);
router.patch('/:id/visibility', authMiddleware, toggleBlogVisibility);

export default router;
