import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        required: [true, 'School/University name is required'],
        trim: true
    },
    degree: {
        type: String,
        required: [true, 'Degree is required'],
        trim: true
    },
    field: {
        type: String,
        required: [true, 'Field of study is required'],
        trim: true
    },
    location: {
        type: String,
        trim: true
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
    grade: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    activities: [{
        type: String,
        trim: true
    }],
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

educationSchema.index({ startDate: -1, order: 1 });

const Education = mongoose.model('Education', educationSchema);

export default Education;