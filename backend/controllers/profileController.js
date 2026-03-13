import Profile from '../models/Profile.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { uploadImage, deleteFile } from '../utils/cloudinaryUpload.js';
// no local fs needed when using memory uploads

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ isVisible: true });

        if (!profile) {
            // Return empty profile if none exists
            profile = {};
        }

        successResponse(res, 200, 'Profile fetched successfully', profile);
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private (Admin)
export const updateProfile = async (req, res, next) => {
    try {
        const profileData = req.body;

        let profile = await Profile.findOne();

        if (profile) {
            // Update existing profile
            Object.assign(profile, profileData);
            await profile.save();
        } else {
            // Create new profile
            profile = await Profile.create(profileData);
        }

        successResponse(res, 200, 'Profile updated successfully', profile);
    } catch (error) {
        next(error);
    }
};

// @desc    Upload profile image
// @route   POST /api/profile/image
// @access  Private (Admin)
export const uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ValidationError('Please upload an image');
        }

        // Log file info for debugging
        console.log('Upload request - profile image:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Upload to Cloudinary (supports multer memory buffer)
        const result = await uploadImage(req.file, 'portfolio/profile');

        // Delete old image if exists
        let profile = await Profile.findOne();
        if (profile && profile.profileImage?.publicId) {
            await deleteFile(profile.profileImage.publicId);
        }

        // Update or create profile with new image
        if (profile) {
            profile.profileImage = {
                url: result.url,
                publicId: result.publicId
            };
            await profile.save();
        } else {
            profile = await Profile.create({
                profileImage: {
                    url: result.url,
                    publicId: result.publicId
                }
            });
        }

        // No local file to delete when using memoryStorage

        successResponse(res, 200, 'Profile image uploaded successfully', {
            profileImage: profile.profileImage
        });
    } catch (error) {
        // No local file cleanup required for memory uploads
        next(error);
    }
};

// @desc    Upload background image
// @route   POST /api/profile/background
// @access  Private (Admin)
export const uploadBackgroundImage = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ValidationError('Please upload an image');
        }

        console.log('Upload request - background image:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Upload to Cloudinary
        const result = await uploadImage(req.file, 'portfolio/background');

        // Delete old background if exists
        let profile = await Profile.findOne();
        if (profile && profile.backgroundImage?.publicId) {
            await deleteFile(profile.backgroundImage.publicId);
        }

        // Update or create profile with new background
        if (profile) {
            profile.backgroundImage = {
                url: result.url,
                publicId: result.publicId
            };
            await profile.save();
        } else {
            profile = await Profile.create({
                backgroundImage: {
                    url: result.url,
                    publicId: result.publicId
                }
            });
        }

        successResponse(res, 200, 'Background image uploaded successfully', {
            backgroundImage: profile.backgroundImage
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle profile visibility
// @route   PATCH /api/profile/visibility
// @access  Private (Admin)
export const toggleVisibility = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();

        if (!profile) {
            throw new NotFoundError('Profile not found');
        }

        profile.isVisible = !profile.isVisible;
        await profile.save();

        successResponse(res, 200, 'Profile visibility updated', profile);
    } catch (error) {
        next(error);
    }
};
