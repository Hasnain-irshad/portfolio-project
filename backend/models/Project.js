import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    longDescription: {
        type: String,
        maxlength: [2000, 'Long description cannot exceed 2000 characters']
    },
    images: [{
        url: String,
        publicId: String
    }],
    technologies: [{
        type: String,
        trim: true
    }],
    liveUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for sorting
projectSchema.index({ order: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
