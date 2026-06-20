import Project from '../models/Project.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { uploadMultipleImages, deleteFile } from '../utils/cloudinaryUpload.js';
// no local fs needed when using memory uploads

// @desc    Get all visible projects
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ isVisible: true })
            .sort({ order: 1, createdAt: -1 });

        successResponse(res, 200, 'Projects fetched successfully', projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all projects (including hidden) - Admin
// @route   GET /api/projects/admin
// @access  Private (Admin)
export const getAllProjectsAdmin = async (req, res, next) => {
    try {
        const projects = await Project.find()
            .sort({ order: 1, createdAt: -1 });

        successResponse(res, 200, 'Projects fetched successfully', projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        successResponse(res, 200, 'Project fetched successfully', project);
    } catch (error) {
        next(error);
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res, next) => {
    try {
        const projectData = req.body;

        // Parse technologies if it's a string (FormData sends arrays as JSON)
        if (typeof projectData.technologies === 'string') {
            try {
                projectData.technologies = JSON.parse(projectData.technologies);
            } catch (e) {
                projectData.technologies = projectData.technologies
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
            }
        }

        // Older admin form sent `projectUrl`; the schema uses `liveUrl`.
        if (projectData.projectUrl && !projectData.liveUrl) {
            projectData.liveUrl = projectData.projectUrl;
        }
        delete projectData.projectUrl;

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            console.log('Upload request - project images count:', req.files.length);
            req.files.forEach((f, idx) => {
                console.log(`  file[${idx}]`, { originalname: f.originalname, mimetype: f.mimetype, size: f.size });
            });

            const uploadedImages = await uploadMultipleImages(req.files, 'portfolio/projects');
            projectData.images = uploadedImages;
        }

        const project = await Project.create(projectData);

        successResponse(res, 201, 'Project created successfully', project);
    } catch (error) {
        // No local file cleanup required for memory uploads
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        const updateData = req.body;

        // Parse technologies if it's a string (FormData sends arrays as JSON)
        if (typeof updateData.technologies === 'string') {
            try {
                updateData.technologies = JSON.parse(updateData.technologies);
            } catch (e) {
                updateData.technologies = updateData.technologies
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
            }
        }

        // Older admin form sent `projectUrl`; the schema uses `liveUrl`.
        if (updateData.projectUrl && !updateData.liveUrl) {
            updateData.liveUrl = updateData.projectUrl;
        }
        delete updateData.projectUrl;

        // Handle new image uploads — REPLACE existing images, don't append.
        // (Append-on-edit kept the old image at index 0, so the public site
        // never showed the new picture.)
        if (req.files && req.files.length > 0) {
            console.log('Upload request - project images (update) count:', req.files.length);
            req.files.forEach((f, idx) => {
                console.log(`  file[${idx}]`, { originalname: f.originalname, mimetype: f.mimetype, size: f.size });
            });

            const uploadedImages = await uploadMultipleImages(req.files, 'portfolio/projects');

            // Clean up old Cloudinary files (non-fatal — won't block save)
            if (project.images && project.images.length > 0) {
                for (const oldImg of project.images) {
                    if (oldImg?.publicId) {
                        await deleteFile(oldImg.publicId);
                    }
                }
            }

            updateData.images = uploadedImages;
        }

        Object.assign(project, updateData);
        await project.save();

        successResponse(res, 200, 'Project updated successfully', project);
    } catch (error) {
        // No local file cleanup required for memory uploads
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Delete images from Cloudinary
        if (project.images && project.images.length > 0) {
            for (const image of project.images) {
                if (image.publicId) {
                    await deleteFile(image.publicId);
                }
            }
        }

        await project.deleteOne();

        successResponse(res, 200, 'Project deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle project visibility
// @route   PATCH /api/projects/:id/visibility
// @access  Private (Admin)
export const toggleProjectVisibility = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        project.isVisible = !project.isVisible;
        await project.save();

        successResponse(res, 200, 'Project visibility updated', project);
    } catch (error) {
        next(error);
    }
};
