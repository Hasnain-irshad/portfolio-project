import Activity from '../models/Activity.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { uploadImage, uploadPDF, deleteFile } from '../utils/cloudinaryUpload.js';

// @desc    Get all visible activities
// @route   GET /api/activities
// @access  Public
export const getAllActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({ isVisible: true })
            .sort({ startDate: -1, order: 1 });

        successResponse(res, 200, 'Activities fetched successfully', activities);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all activities (including hidden) - Admin
// @route   GET /api/activities/admin/all
// @access  Private (Admin)
export const getAllActivitiesAdmin = async (req, res, next) => {
    try {
        const activities = await Activity.find()
            .sort({ startDate: -1, order: 1 });

        successResponse(res, 200, 'Activities fetched successfully', activities);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
export const getActivityById = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            throw new NotFoundError('Activity not found');
        }

        successResponse(res, 200, 'Activity fetched successfully', activity);
    } catch (error) {
        next(error);
    }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private (Admin)
export const createActivity = async (req, res, next) => {
    try {
        const activityData = req.body;

        // Convert current (string from FormData) to boolean if needed
        if (typeof activityData.current === 'string') {
            activityData.current = activityData.current === 'true';
        }

        // Handle image upload
        if (req.files && req.files.image && req.files.image[0]) {
            const result = await uploadImage(req.files.image[0], 'portfolio/activities');
            activityData.image = { url: result.url, publicId: result.publicId };
        }

        // Handle document upload
        if (req.files && req.files.document && req.files.document[0]) {
            const file = req.files.document[0];
            const result = await uploadPDF(file, 'portfolio/activities/docs');
            activityData.document = {
                url: result.url,
                publicId: result.publicId,
                originalName: file.originalname
            };
        }

        const activity = await Activity.create(activityData);

        successResponse(res, 201, 'Activity created successfully', activity);
    } catch (error) {
        next(error);
    }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Admin)
export const updateActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            throw new NotFoundError('Activity not found');
        }

        const updateData = req.body;

        // Convert current (string from FormData) to boolean if needed
        if (typeof updateData.current === 'string') {
            updateData.current = updateData.current === 'true';
        }

        // Handle new image upload
        if (req.files && req.files.image && req.files.image[0]) {
            if (activity.image?.publicId) {
                await deleteFile(activity.image.publicId);
            }
            const result = await uploadImage(req.files.image[0], 'portfolio/activities');
            updateData.image = { url: result.url, publicId: result.publicId };
        }

        // Handle new document upload
        if (req.files && req.files.document && req.files.document[0]) {
            if (activity.document?.publicId) {
                await deleteFile(activity.document.publicId, 'raw');
            }
            const file = req.files.document[0];
            const result = await uploadPDF(file, 'portfolio/activities/docs');
            updateData.document = {
                url: result.url,
                publicId: result.publicId,
                originalName: file.originalname
            };
        }

        Object.assign(activity, updateData);
        await activity.save();

        successResponse(res, 200, 'Activity updated successfully', activity);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Admin)
export const deleteActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            throw new NotFoundError('Activity not found');
        }

        if (activity.image?.publicId) {
            await deleteFile(activity.image.publicId);
        }
        if (activity.document?.publicId) {
            await deleteFile(activity.document.publicId, 'raw');
        }

        await activity.deleteOne();

        successResponse(res, 200, 'Activity deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle activity visibility
// @route   PATCH /api/activities/:id/visibility
// @access  Private (Admin)
export const toggleActivityVisibility = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            throw new NotFoundError('Activity not found');
        }

        activity.isVisible = !activity.isVisible;
        await activity.save();

        successResponse(res, 200, 'Activity visibility updated', activity);
    } catch (error) {
        next(error);
    }
};
