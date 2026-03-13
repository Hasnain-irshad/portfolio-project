import Blog from '../models/Blog.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { uploadImage, uploadPDF, deleteFile } from '../utils/cloudinaryUpload.js';

// @desc    Get all visible blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ isVisible: true })
            .sort({ publishDate: -1, order: 1 });

        successResponse(res, 200, 'Blogs fetched successfully', blogs);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all blogs (including hidden) - Admin
// @route   GET /api/blogs/admin/all
// @access  Private (Admin)
export const getAllBlogsAdmin = async (req, res, next) => {
    try {
        const blogs = await Blog.find()
            .sort({ publishDate: -1, order: 1 });

        successResponse(res, 200, 'Blogs fetched successfully', blogs);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        successResponse(res, 200, 'Blog fetched successfully', blog);
    } catch (error) {
        next(error);
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private (Admin)
export const createBlog = async (req, res, next) => {
    try {
        const blogData = req.body;

        // Parse tags if string
        if (blogData.tags && typeof blogData.tags === 'string') {
            try {
                blogData.tags = JSON.parse(blogData.tags);
            } catch (e) {
                blogData.tags = blogData.tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        // Handle image upload
        if (req.files && req.files.image && req.files.image[0]) {
            const result = await uploadImage(req.files.image[0], 'portfolio/blogs');
            blogData.image = { url: result.url, publicId: result.publicId };
        }

        // Handle document upload
        if (req.files && req.files.document && req.files.document[0]) {
            const file = req.files.document[0];
            const result = await uploadPDF(file, 'portfolio/blogs/docs');
            blogData.document = {
                url: result.url,
                publicId: result.publicId,
                originalName: file.originalname
            };
        }

        const blog = await Blog.create(blogData);

        successResponse(res, 201, 'Blog created successfully', blog);
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
export const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        const updateData = req.body;

        // Parse tags if string
        if (updateData.tags && typeof updateData.tags === 'string') {
            try {
                updateData.tags = JSON.parse(updateData.tags);
            } catch (e) {
                updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        // Handle new image upload
        if (req.files && req.files.image && req.files.image[0]) {
            if (blog.image?.publicId) {
                await deleteFile(blog.image.publicId);
            }
            const result = await uploadImage(req.files.image[0], 'portfolio/blogs');
            updateData.image = { url: result.url, publicId: result.publicId };
        }

        // Handle new document upload
        if (req.files && req.files.document && req.files.document[0]) {
            if (blog.document?.publicId) {
                await deleteFile(blog.document.publicId, 'raw');
            }
            const file = req.files.document[0];
            const result = await uploadPDF(file, 'portfolio/blogs/docs');
            updateData.document = {
                url: result.url,
                publicId: result.publicId,
                originalName: file.originalname
            };
        }

        Object.assign(blog, updateData);
        await blog.save();

        successResponse(res, 200, 'Blog updated successfully', blog);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        if (blog.image?.publicId) {
            await deleteFile(blog.image.publicId);
        }
        if (blog.document?.publicId) {
            await deleteFile(blog.document.publicId, 'raw');
        }

        await blog.deleteOne();

        successResponse(res, 200, 'Blog deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle blog visibility
// @route   PATCH /api/blogs/:id/visibility
// @access  Private (Admin)
export const toggleBlogVisibility = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            throw new NotFoundError('Blog not found');
        }

        blog.isVisible = !blog.isVisible;
        await blog.save();

        successResponse(res, 200, 'Blog visibility updated', blog);
    } catch (error) {
        next(error);
    }
};
