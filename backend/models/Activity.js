import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Activity title is required'],
        trim: true
    },
    role: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    current: {
        type: Boolean,
        default: true
    },
    image: {
        url: String,
        publicId: String
    },
    document: {
        url: String,
        publicId: String,
        originalName: String
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

activitySchema.index({ startDate: -1, order: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
