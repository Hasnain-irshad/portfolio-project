import Experience from '../models/Experience.js';
import { uploadImage, deleteFile } from '../utils/cloudinaryUpload.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';

// @desc    Get all visible experiences
// @route   GET /api/experience
// @access  Public
export const getAllExperiences = async (req, res, next) => {
    try {
        const experiences = await Experience.find({ isVisible: true })
            .sort({ startDate: -1, order: 1 });

        successResponse(res, 200, 'Experiences fetched successfully', experiences);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all experiences (including hidden) - Admin
// @route   GET /api/experience/admin
// @access  Private (Admin)
export const getAllExperiencesAdmin = async (req, res, next) => {
    try {
        const experiences = await Experience.find()
            .sort({ startDate: -1, order: 1 });

        successResponse(res, 200, 'Experiences fetched successfully', experiences);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single experience
// @route   GET /api/experience/:id
// @access  Public
export const getExperienceById = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            throw new NotFoundError('Experience not found');
        }

        successResponse(res, 200, 'Experience fetched successfully', experience);
    } catch (error) {
        next(error);
    }
};

// @desc    Create experience
// @route   POST /api/experience
// @access  Private (Admin)
export const createExperience = async (req, res, next) => {
    try {
        const experienceData = req.body;

        // Parse achievements if it's a string (from FormData) or handle it as array
        if (experienceData.achievements) {
            if (typeof experienceData.achievements === 'string') {
                try {
                    experienceData.achievements = JSON.parse(experienceData.achievements);
                } catch (e) {
                    // If it's a single string, convert to array
                    experienceData.achievements = experienceData.achievements ? [experienceData.achievements] : [];
                }
            }
        }

        // Convert current (string from FormData) to boolean if needed
        if (typeof experienceData.current === 'string') {
            experienceData.current = experienceData.current === 'true';
        }

        // Handle optional logo upload (supports multer memoryStorage)
        if (req.file) {
            const result = await uploadImage(req.file, 'portfolio/experience');
            experienceData.logo = {
                url: result.url,
                publicId: result.publicId
            };
        }

        const experience = await Experience.create(experienceData);

        successResponse(res, 201, 'Experience created successfully', experience);
    } catch (error) {
        next(error);
    }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private (Admin)
export const updateExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            throw new NotFoundError('Experience not found');
        }

        const updateData = req.body;

        // Parse achievements if it's a string (from FormData) or handle it as array
        if (updateData.achievements) {
            if (typeof updateData.achievements === 'string') {
                try {
                    updateData.achievements = JSON.parse(updateData.achievements);
                } catch (e) {
                    // If it's a single string, convert to array
                    updateData.achievements = updateData.achievements ? [updateData.achievements] : [];
                }
            }
        }

        // Convert current (string from FormData) to boolean if needed
        if (typeof updateData.current === 'string') {
            updateData.current = updateData.current === 'true';
        }

        // Handle optional logo upload on update
        if (req.file) {
            // Delete old logo if exists
            if (experience.logo?.publicId) {
                await deleteFile(experience.logo.publicId);
            }

            const result = await uploadImage(req.file, 'portfolio/experience');
            updateData.logo = {
                url: result.url,
                publicId: result.publicId
            };
        }

        Object.assign(experience, updateData);
        await experience.save();

        successResponse(res, 200, 'Experience updated successfully', experience);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
export const deleteExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            throw new NotFoundError('Experience not found');
        }

        await experience.deleteOne();

        successResponse(res, 200, 'Experience deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle experience visibility
// @route   PATCH /api/experience/:id/visibility
// @access  Private (Admin)
export const toggleExperienceVisibility = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            throw new NotFoundError('Experience not found');
        }

        experience.isVisible = !experience.isVisible;
        await experience.save();

        successResponse(res, 200, 'Experience visibility updated', experience);
    } catch (error) {
        next(error);
    }
};
