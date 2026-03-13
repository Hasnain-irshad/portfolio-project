import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: [200, 'Excerpt cannot exceed 200 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    image: {
        url: String,
        publicId: String
    },
    document: {
        url: String,
        publicId: String,
        originalName: String
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

blogSchema.index({ publishDate: -1, order: 1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
