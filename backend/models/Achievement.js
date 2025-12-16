import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Achievement title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        enum: ['Award', 'Recognition', 'Milestone', 'Competition', 'Certification', 'Other'],
        default: 'Achievement'
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    icon: {
        type: String,
        default: 'fas fa-star'
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

achievementSchema.index({ date: -1, order: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;