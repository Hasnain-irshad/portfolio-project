import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    achievements: [{
        type: String,
        trim: true
    }],
    logo: {
        url: String,
        publicId: String
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

// Index for sorting by date
experienceSchema.index({ startDate: -1, order: 1 });

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
