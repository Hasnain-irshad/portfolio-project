import Resume from '../models/Resume.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { uploadPDF, deleteFile } from '../utils/cloudinaryUpload.js';
// no local fs needed when using memory uploads

// @desc    Get active resume
// @route   GET /api/resume
// @access  Public
export const getActiveResume = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({ isActive: true });

        if (!resume) {
            throw new NotFoundError('No active resume found');
        }

        successResponse(res, 200, 'Resume fetched successfully', resume);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all resumes
// @route   GET /api/resume/all
// @access  Private (Admin)
export const getAllResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find().sort({ uploadedAt: -1 });

        successResponse(res, 200, 'Resumes fetched successfully', resumes);
    } catch (error) {
        next(error);
    }
};

// @desc    Upload resume
// @route   POST /api/resume
// @access  Private (Admin)
export const uploadResume = async (req, res, next) => {
    try {

        if (!req.file) {
            throw new ValidationError('Please upload a PDF file');
        }

        const { title, description } = req.body;

        // Log file info for debugging
        console.log('Upload request - resume:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Upload to Cloudinary (supports multer memory buffer)
        const result = await uploadPDF(req.file, 'portfolio/resumes');

        // Create resume record
        const resume = await Resume.create({
            title: title || 'Resume',
            description: description || '',
            fileUrl: result.url,
            publicId: result.publicId,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            isActive: true
        });

        // No local file to delete when using memoryStorage

        successResponse(res, 201, 'Resume uploaded successfully', resume);
    } catch (error) {
        // No local file cleanup required for memory uploads
        next(error);
    }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private (Admin)
export const deleteResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            throw new NotFoundError('Resume not found');
        }

        // Delete from Cloudinary
        await deleteFile(resume.publicId, 'raw');

        // Delete from database
        await resume.deleteOne();

        successResponse(res, 200, 'Resume deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Set active resume
// @route   PATCH /api/resume/:id/activate
// @access  Private (Admin)
export const setActiveResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            throw new NotFoundError('Resume not found');
        }

        // Deactivate all resumes
        await Resume.updateMany({}, { isActive: false });

        // Activate this resume
        resume.isActive = true;
        await resume.save();

        successResponse(res, 200, 'Resume activated successfully', resume);
    } catch (error) {
        next(error);
    }
};
