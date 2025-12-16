import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middleware/errorHandler.js';
import { Readable } from 'stream';

/**
 * Upload image to Cloudinary
 * @param {String} filePath - Path to file
 * @param {String} folder - Cloudinary folder name
 * @returns {Object} - { url, publicId }
 */
const uploadBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
};

/**
 * Upload image to Cloudinary
 * Accepts either a file path string or a Buffer / file object with `.buffer`.
 * @param {String|Buffer|Object} input - Path to file OR Buffer OR multer `file` object
 * @param {String} folder - Cloudinary folder name
 * @returns {Object} - { url, publicId }
 */
export const uploadImage = async (input, folder = 'portfolio') => {
    try {
        // If input is a Buffer or a multer file object, upload via stream
        if (Buffer.isBuffer(input) || (input && input.buffer && Buffer.isBuffer(input.buffer))) {
            const buffer = Buffer.isBuffer(input) ? input : input.buffer;
            const result = await uploadBuffer(buffer, {
                folder,
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
            });

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        // Otherwise assume input is a path or data URI string
        const result = await cloudinary.uploader.upload(input, {
            folder: folder,
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new AppError('Failed to upload image', 500);
    }
};

/**
 * Upload PDF to Cloudinary
 * @param {String} filePath - Path to PDF file
 * @param {String} folder - Cloudinary folder name
 * @returns {Object} - { url, publicId }
 */
export const uploadPDF = async (input, folder = 'portfolio/resumes') => {
    try {

        if (Buffer.isBuffer(input) || (input && input.buffer && Buffer.isBuffer(input.buffer))) {
            const buffer = Buffer.isBuffer(input) ? input : input.buffer;
            // Preserve original filename/extension when uploading raw files so
            // Cloudinary serves them with correct Content-Type and extension.
            const uploadOptions = {
                folder,
                resource_type: 'raw',
                use_filename: true,
                unique_filename: false
            };

            const result = await uploadBuffer(buffer, uploadOptions);

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        // When uploading from a path/string, also tell Cloudinary to preserve
        // the original filename where possible so the served URL includes
        // the file extension and the browser can handle it correctly.
        const result = await cloudinary.uploader.upload(input, {
            folder: folder,
            resource_type: 'raw',
            use_filename: true,
            unique_filename: false
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary PDF upload error:', error);
        throw new AppError('Failed to upload PDF', 500);
    }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - 'image' or 'raw'
 * @returns {Boolean} - Success status
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new AppError('Failed to delete file', 500);
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file paths
 * @param {String} folder - Cloudinary folder name
 * @returns {Array} - Array of { url, publicId }
 */
export const uploadMultipleImages = async (files, folder = 'portfolio') => {
    try {
        // files may be multer file objects or paths
        const uploadPromises = files.map(file => {
            if (file && file.buffer) return uploadImage(file, folder);
            if (file && file.path) return uploadImage(file.path, folder);
            return Promise.reject(new Error('Invalid file provided'));
        });
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Multiple upload error:', error);
        throw new AppError('Failed to upload images', 500);
    }
};
