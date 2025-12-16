import Certificate from '../models/Certificate.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { uploadImage, deleteFile } from '../utils/cloudinaryUpload.js';
// no local fs needed when using memory uploads

// @desc    Get all visible certificates
// @route   GET /api/certificates
// @access  Public
export const getAllCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find({ isVisible: true })
            .sort({ issueDate: -1, order: 1 });

        successResponse(res, 200, 'Certificates fetched successfully', certificates);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all certificates (including hidden) - Admin
// @route   GET /api/certificates/admin
// @access  Private (Admin)
export const getAllCertificatesAdmin = async (req, res, next) => {
    try {
        const certificates = await Certificate.find()
            .sort({ issueDate: -1, order: 1 });

        successResponse(res, 200, 'Certificates fetched successfully', certificates);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificateById = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            throw new NotFoundError('Certificate not found');
        }

        successResponse(res, 200, 'Certificate fetched successfully', certificate);
    } catch (error) {
        next(error);
    }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private (Admin)
export const createCertificate = async (req, res, next) => {
    try {
        const certificateData = req.body;

        // Handle image upload
        if (req.file) {
            console.log('Upload request - certificate image:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            const result = await uploadImage(req.file, 'portfolio/certificates');
            certificateData.image = {
                url: result.url,
                publicId: result.publicId
            };
        }

        const certificate = await Certificate.create(certificateData);

        successResponse(res, 201, 'Certificate created successfully', certificate);
    } catch (error) {
        // No local file cleanup needed for memory uploads
        next(error);
    }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private (Admin)
export const updateCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            throw new NotFoundError('Certificate not found');
        }

        const updateData = req.body;

        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            if (certificate.image?.publicId) {
                await deleteFile(certificate.image.publicId);
            }

            console.log('Upload request - certificate image (update):', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            const result = await uploadImage(req.file, 'portfolio/certificates');
            updateData.image = {
                url: result.url,
                publicId: result.publicId
            };
        }

        Object.assign(certificate, updateData);
        await certificate.save();

        successResponse(res, 200, 'Certificate updated successfully', certificate);
    } catch (error) {
        // No local file cleanup needed with memory uploads
        next(error);
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Admin)
export const deleteCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            throw new NotFoundError('Certificate not found');
        }

        // Delete image from Cloudinary
        if (certificate.image?.publicId) {
            await deleteFile(certificate.image.publicId);
        }

        await certificate.deleteOne();

        successResponse(res, 200, 'Certificate deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle certificate visibility
// @route   PATCH /api/certificates/:id/visibility
// @access  Private (Admin)
export const toggleCertificateVisibility = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            throw new NotFoundError('Certificate not found');
        }

        certificate.isVisible = !certificate.isVisible;
        await certificate.save();

        successResponse(res, 200, 'Certificate visibility updated', certificate);
    } catch (error) {
        next(error);
    }
};
