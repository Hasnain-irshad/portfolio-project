import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Resume title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    publicId: {
        type: String,
        required: [true, 'Public ID is required']
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure only one resume is active at a time
// Use async pre hook without `next` to avoid "next is not a function" error
resumeSchema.pre('save', async function () {
    if (this.isActive) {
        await mongoose.model('Resume').updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
