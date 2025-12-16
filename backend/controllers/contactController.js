import Contact from '../models/Contact.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { sendContactNotification, sendContactConfirmation } from '../utils/emailSender.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);

        // Send emails asynchronously without blocking response
        (async () => {
            try {
                console.log('📧 Attempting to send emails...');
                await Promise.all([
                    sendContactNotification(process.env.ADMIN_EMAIL || process.env.EMAIL_USER, req.body)
                        .then(() => console.log('✅ Admin notification sent'))
                        .catch(err => console.error('❌ Failed to send admin notification:', err.message)),
                    sendContactConfirmation(req.body.email, req.body.name)
                        .then(() => console.log('✅ User confirmation sent'))
                        .catch(err => console.error('❌ Failed to send user confirmation:', err.message))
                ]);
            } catch (emailErr) {
                console.error('❌ Email sending error:', emailErr.message);
            }
        })();

        successResponse(res, 201, 'Message sent successfully! We will get back to you soon.', contact);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
export const getAllMessages = async (req, res, next) => {
    try {
        const { read } = req.query;

        const query = {};
        if (read !== undefined) {
            query.isRead = read === 'true';
        }

        const messages = await Contact.find(query).sort({ createdAt: -1 });
        const unreadCount = await Contact.countDocuments({ isRead: false });

        successResponse(res, 200, 'Messages fetched successfully', {
            messages,
            unreadCount
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single message
// @route   GET /api/contact/:id
// @access  Private (Admin)
export const getMessageById = async (req, res, next) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (!message) {
            throw new NotFoundError('Message not found');
        }

        successResponse(res, 200, 'Message fetched successfully', message);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark message as read
// @route   PATCH /api/contact/:id/read
// @access  Private (Admin)
export const markAsRead = async (req, res, next) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (!message) {
            throw new NotFoundError('Message not found');
        }

        message.isRead = true;
        await message.save();

        successResponse(res, 200, 'Message marked as read', message);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res, next) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (!message) {
            throw new NotFoundError('Message not found');
        }

        await message.deleteOne();

        successResponse(res, 200, 'Message deleted successfully');
    } catch (error) {
        next(error);
    }
};
