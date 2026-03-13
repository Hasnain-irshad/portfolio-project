import { body, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Validation result checker
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new ValidationError(errorMessages);
    }
    next();
};

// Reusable validation chains
export const validators = {
    // Profile validations
    profile: [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('bio').trim().notEmpty().withMessage('Bio is required')
            .isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
    ],

    // Achievement validations
    achievement: [
        body('title').trim().notEmpty().withMessage('Achievement title is required'),
        body('description').trim().notEmpty().withMessage('Description is required')
            .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
        body('category').isIn(['Award', 'Recognition', 'Milestone', 'Competition', 'Certification', 'Other'])
            .withMessage('Invalid category'),
        body('date').isISO8601().withMessage('Valid date is required'),
    ],

    // Education validations
    education: [
        body('school').trim().notEmpty().withMessage('School/University name is required'),
        body('degree').trim().notEmpty().withMessage('Degree is required'),
        body('field').trim().notEmpty().withMessage('Field of study is required'),
        body('startDate').isISO8601().withMessage('Valid start date is required'),
    ],

    // Project validations
    project: [
        body('title').trim().notEmpty().withMessage('Project title is required'),
        body('description').trim().notEmpty().withMessage('Description is required')
            .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
        body('technologies').optional().isArray().withMessage('Technologies must be an array'),
    ],

    // Skill validations
    skill: [
        body('name').trim().notEmpty().withMessage('Skill name is required'),
        body('category').isIn(['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Design', 'Other'])
            .withMessage('Invalid category'),
        body('proficiency').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
            .withMessage('Invalid proficiency level'),
    ],

    // Experience validations
    experience: [
        body('company').trim().notEmpty().withMessage('Company name is required'),
        body('position').trim().notEmpty().withMessage('Position is required'),
        body('startDate').isISO8601().withMessage('Valid start date is required'),
        body('description').trim().notEmpty().withMessage('Description is required')
            .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    ],

    // Certificate validations
    certificate: [
        body('title').trim().notEmpty().withMessage('Certificate title is required'),
        body('issuer').trim().notEmpty().withMessage('Issuer is required'),
        body('issueDate').isISO8601().withMessage('Valid issue date is required'),
    ],

    // Contact validations
    contact: [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('subject').trim().notEmpty().withMessage('Subject is required'),
        body('message').trim().notEmpty().withMessage('Message is required')
            .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
    ],

    // Blog validations
    blog: [
        body('title').trim().notEmpty().withMessage('Blog title is required'),
        body('content').trim().notEmpty().withMessage('Blog content is required')
            .isLength({ max: 5000 }).withMessage('Content cannot exceed 5000 characters'),
    ],

    // Publication validations
    publication: [
        body('title').trim().notEmpty().withMessage('Publication title is required'),
        body('abstract').trim().notEmpty().withMessage('Abstract is required')
            .isLength({ max: 5000 }).withMessage('Abstract cannot exceed 5000 characters'),
        body('year').notEmpty().withMessage('Publication year is required'),
    ],

    // Activity validations
    activity: [
        body('title').trim().notEmpty().withMessage('Activity title is required'),
    ],

    // Auth validations
    login: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],

    register: [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ]
};
