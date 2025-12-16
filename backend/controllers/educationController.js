import Education from '../models/Education.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';

// @desc    Get all visible education records
// @route   GET /api/education
// @access  Public
export const getAllEducation = async (req, res, next) => {
    try {
        const education = await Education.find({ isVisible: true })
            .sort({ startDate: -1, order: 1 });

        successResponse(res, 200, 'Education records fetched successfully', education);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all education records (including hidden) - Admin
// @route   GET /api/education/admin/all
// @access  Private (Admin)
export const getAllEducationAdmin = async (req, res, next) => {
    try {
        const education = await Education.find()
            .sort({ startDate: -1, order: 1 });

        successResponse(res, 200, 'Education records fetched successfully', education);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single education record
// @route   GET /api/education/:id
// @access  Public
export const getEducationById = async (req, res, next) => {
    try {
        const education = await Education.findById(req.params.id);

        if (!education) {
            throw new NotFoundError('Education record not found');
        }

        successResponse(res, 200, 'Education record fetched successfully', education);
    } catch (error) {
        next(error);
    }
};

// @desc    Create education record
// @route   POST /api/education
// @access  Private (Admin)
export const createEducation = async (req, res, next) => {
    try {
        const educationData = req.body;

        // Parse activities if it's a string (from FormData) or handle it as array
        if (educationData.activities) {
            if (typeof educationData.activities === 'string') {
                try {
                    educationData.activities = JSON.parse(educationData.activities);
                } catch (e) {
                    // If it's a single string, convert to array
                    educationData.activities = educationData.activities ? [educationData.activities] : [];
                }
            }
        }

        // Convert current (string from FormData) to boolean if needed
        if (typeof educationData.current === 'string') {
            educationData.current = educationData.current === 'true';
        }

        const education = await Education.create(educationData);

        successResponse(res, 201, 'Education record created successfully', education);
    } catch (error) {
        next(error);
    }
};

// @desc    Update education record
// @route   PUT /api/education/:id
// @access  Private (Admin)
export const updateEducation = async (req, res, next) => {
    try {
        const education = await Education.findById(req.params.id);

        if (!education) {
            throw new NotFoundError('Education record not found');
        }

        const updateData = req.body;

        // Parse activities if it's a string (from FormData) or handle it as array
        if (updateData.activities) {
            if (typeof updateData.activities === 'string') {
                try {
                    updateData.activities = JSON.parse(updateData.activities);
                } catch (e) {
                    // If it's a single string, convert to array
                    updateData.activities = updateData.activities ? [updateData.activities] : [];
                }
            }
        }

        // Convert current (string from FormData) to boolean if needed
        if (typeof updateData.current === 'string') {
            updateData.current = updateData.current === 'true';
        }

        Object.assign(education, updateData);
        await education.save();

        successResponse(res, 200, 'Education record updated successfully', education);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete education record
// @route   DELETE /api/education/:id
// @access  Private (Admin)
export const deleteEducation = async (req, res, next) => {
    try {
        const education = await Education.findById(req.params.id);

        if (!education) {
            throw new NotFoundError('Education record not found');
        }

        await education.deleteOne();

        successResponse(res, 200, 'Education record deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle education visibility
// @route   PATCH /api/education/:id/visibility
// @access  Private (Admin)
export const toggleEducationVisibility = async (req, res, next) => {
    try {
        const education = await Education.findById(req.params.id);

        if (!education) {
            throw new NotFoundError('Education record not found');
        }

        education.isVisible = !education.isVisible;
        await education.save();

        successResponse(res, 200, 'Education visibility updated', education);
    } catch (error) {
        next(error);
    }
};