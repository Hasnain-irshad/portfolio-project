import Education from '../models/Education.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { uploadImage, uploadPDF, deleteFile } from '../utils/cloudinaryUpload.js';

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_PDF_MIMES = ['application/pdf'];

const uploadTranscriptFile = async (file) => {
    const isImage = ALLOWED_IMAGE_MIMES.includes(file.mimetype);
    const isPdf = ALLOWED_PDF_MIMES.includes(file.mimetype);

    if (!isImage && !isPdf) {
        throw new ValidationError('Transcript must be an image (JPG/PNG/WEBP/GIF) or a PDF.');
    }

    const result = isImage
        ? await uploadImage(file, 'portfolio/education')
        : await uploadPDF(file, 'portfolio/education');

    return {
        url: result.url,
        publicId: result.publicId,
        originalName: file.originalname,
        fileType: isImage ? 'image' : 'pdf'
    };
};

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
                    educationData.activities = educationData.activities ? [educationData.activities] : [];
                }
            }
        }

        // Convert current (string from FormData) to boolean if needed
        if (typeof educationData.current === 'string') {
            educationData.current = educationData.current === 'true';
        }

        // Handle transcript upload (image or PDF)
        if (req.file) {
            educationData.transcript = await uploadTranscriptFile(req.file);
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
                    updateData.activities = updateData.activities ? [updateData.activities] : [];
                }
            }
        }

        // Convert current (string from FormData) to boolean if needed
        if (typeof updateData.current === 'string') {
            updateData.current = updateData.current === 'true';
        }

        // Handle new transcript upload — delete the old one first (non-fatal)
        if (req.file) {
            if (education.transcript?.publicId) {
                const resourceType = education.transcript.fileType === 'pdf' ? 'raw' : 'image';
                await deleteFile(education.transcript.publicId, resourceType);
            }
            updateData.transcript = await uploadTranscriptFile(req.file);
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

        // Remove transcript from Cloudinary if present (non-fatal — won't block DB delete)
        if (education.transcript?.publicId) {
            const resourceType = education.transcript.fileType === 'pdf' ? 'raw' : 'image';
            await deleteFile(education.transcript.publicId, resourceType);
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
