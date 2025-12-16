import express from 'express';
import {
    submitContact,
    getAllMessages,
    getMessageById,
    markAsRead,
    deleteMessage
} from '../controllers/contactController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validators, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/', validators.contact, validate, submitContact);

// Protected routes (Admin only)
router.get('/', authMiddleware, getAllMessages);
router.get('/:id', authMiddleware, getMessageById);
router.patch('/:id/read', authMiddleware, markAsRead);
router.delete('/:id', authMiddleware, deleteMessage);

export default router;
