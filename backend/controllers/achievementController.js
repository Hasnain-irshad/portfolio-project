import Achievement from '../models/Achievement.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';

// @desc    Get all visible achievements
// @route   GET /api/achievements
// @access  Public
export const getAllAchievements = async (req, res, next) => {
    try {
        const achievements = await Achievement.find({ isVisible: true })
            .sort({ date: -1, order: 1 });

        successResponse(res, 200, 'Achievements fetched successfully', achievements);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all achievements (including hidden) - Admin
// @route   GET /api/achievements/admin/all
// @access  Private (Admin)
export const getAllAchievementsAdmin = async (req, res, next) => {
    try {
        const achievements = await Achievement.find()
            .sort({ date: -1, order: 1 });

        successResponse(res, 200, 'Achievements fetched successfully', achievements);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
export const getAchievementById = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            throw new NotFoundError('Achievement not found');
        }

        successResponse(res, 200, 'Achievement fetched successfully', achievement);
    } catch (error) {
        next(error);
    }
};

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private (Admin)
export const createAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.create(req.body);

        successResponse(res, 201, 'Achievement created successfully', achievement);
    } catch (error) {
        next(error);
    }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private (Admin)
export const updateAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            throw new NotFoundError('Achievement not found');
        }

        Object.assign(achievement, req.body);
        await achievement.save();

        successResponse(res, 200, 'Achievement updated successfully', achievement);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Admin)
export const deleteAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            throw new NotFoundError('Achievement not found');
        }

        await achievement.deleteOne();

        successResponse(res, 200, 'Achievement deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle achievement visibility
// @route   PATCH /api/achievements/:id/visibility
// @access  Private (Admin)
export const toggleAchievementVisibility = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            throw new NotFoundError('Achievement not found');
        }

        achievement.isVisible = !achievement.isVisible;
        await achievement.save();

        successResponse(res, 200, 'Achievement visibility updated', achievement);
    } catch (error) {
        next(error);
    }
};