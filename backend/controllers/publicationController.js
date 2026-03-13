import Publication from '../models/Publication.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { uploadImage, uploadPDF, deleteFile } from '../utils/cloudinaryUpload.js';

// @desc    Get all visible publications
// @route   GET /api/publications
// @access  Public
export const getAllPublications = async (req, res, next) => {
    try {
        const filter = { isVisible: true };

        // Optional query filters
        if (req.query.year) {
            filter.year = parseInt(req.query.year);
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }

        const publications = await Publication.find(filter)
            .sort({ year: -1, order: 1 });

        successResponse(res, 200, 'Publications fetched successfully', publications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all publications (including hidden) - Admin
// @route   GET /api/publications/admin/all
// @access  Private (Admin)
export const getAllPublicationsAdmin = async (req, res, next) => {
    try {
        const publications = await Publication.find()
            .sort({ year: -1, order: 1 });

        successResponse(res, 200, 'Publications fetched successfully', publications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single publication
// @route   GET /api/publications/:id
// @access  Public
export const getPublicationById = async (req, res, next) => {
    try {
        const publication = await Publication.findById(req.params.id);

        if (!publication) {
            throw new NotFoundError('Publication not found');
        }

        successResponse(res, 200, 'Publication fetched successfully', publication);
    } catch (error) {
        next(error);
    }
};

// @desc    Create publication
// @route   POST /api/publications
// @access  Private (Admin)
export const createPublication = async (req, res, next) => {
    try {
        const pubData = req.body;

        // Parse authors if string
        if (pubData.authors && typeof pubData.authors === 'string') {
            try {
                pubData.authors = JSON.parse(pubData.authors);
            } catch (e) {
                pubData.authors = pubData.authors.split(',').map(a => a.trim()).filter(Boolean);
            }
        }

        // Parse year if string
        if (typeof pubData.year === 'string') {
            pubData.year = parseInt(pubData.year);
        }

        // Handle image upload
        if (req.files && req.files.image && req.files.image[0]) {
            const result = await uploadImage(req.files.image[0], 'portfolio/publications');
            pubData.image = { url: result.url, publicId: result.publicId };
        }

        // Handle document upload
        if (req.files && req.files.document && req.files.document[0]) {
            const file = req.files.document[0];
            const result = await uploadPDF(file, 'portfolio/publications/docs');
            pubData.document = {
                url: result.url,
                publicId: result.publicId,
                originalName: file.originalname
            };
        }

        const publication = await Publication.create(pubData);

        successResponse(res, 201, 'Publication created successfully', publication);
    } catch (error) {
        next(error);
    }
};

// @desc    Update publication
// @route   PUT /api/publications/:id
// @access  Private (Admin)
export const updatePublication = async (req, res, next) => {
    try {
        const publication = await Publication.findById(req.params.id);

        if (!publication) {
            throw new NotFoundError('Publication not found');
        }

        const updateData = req.body;

        // Parse authors if string
        if (updateData.authors && typeof updateData.authors === 'string') {
            try {
                updateData.authors = JSON.parse(updateData.authors);
            } catch (e) {
                updateData.authors = updateData.authors.split(',').map(a => a.trim()).filter(Boolean);
            }
        }

        // Parse year if string
        if (typeof updateData.year === 'string') {
            updateData.year = parseInt(updateData.year);
        }

        // Handle new image upload
        if (req.files && req.files.image && req.files.image[0]) {
            if (publication.image?.publicId) {
                await deleteFile(publication.image.publicId);
            }
            const result = await uploadImage(req.files.image[0], 'portfolio/publications');
            updateData.image = { url: result.url, publicId: result.publicId };
        }

        // Handle new document upload
        if (req.files && req.files.document && req.files.document[0]) {
            if (publication.document?.publicId) {
                await deleteFile(publication.document.publicId, 'raw');
            }
            const file = req.files.document[0];
            const result = await uploadPDF(file, 'portfolio/publications/docs');
            updateData.document = {
                url: result.url,
                publicId: result.publicId,
                originalName: file.originalname
            };
        }

        Object.assign(publication, updateData);
        await publication.save();

        successResponse(res, 200, 'Publication updated successfully', publication);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete publication
// @route   DELETE /api/publications/:id
// @access  Private (Admin)
export const deletePublication = async (req, res, next) => {
    try {
        const publication = await Publication.findById(req.params.id);

        if (!publication) {
            throw new NotFoundError('Publication not found');
        }

        if (publication.image?.publicId) {
            await deleteFile(publication.image.publicId);
        }
        if (publication.document?.publicId) {
            await deleteFile(publication.document.publicId, 'raw');
        }

        await publication.deleteOne();

        successResponse(res, 200, 'Publication deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle publication visibility
// @route   PATCH /api/publications/:id/visibility
// @access  Private (Admin)
export const togglePublicationVisibility = async (req, res, next) => {
    try {
        const publication = await Publication.findById(req.params.id);

        if (!publication) {
            throw new NotFoundError('Publication not found');
        }

        publication.isVisible = !publication.isVisible;
        await publication.save();

        successResponse(res, 200, 'Publication visibility updated', publication);
    } catch (error) {
        next(error);
    }
};
