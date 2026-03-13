import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Publication title is required'],
        trim: true
    },
    abstract: {
        type: String,
        required: [true, 'Abstract is required'],
        trim: true,
        maxlength: [5000, 'Abstract cannot exceed 5000 characters']
    },
    authors: [{
        type: String,
        trim: true
    }],
    type: {
        type: String,
        enum: ['Journal', 'Conference', 'Thesis', 'Book', 'Preprint', 'Other'],
        default: 'Other'
    },
    year: {
        type: Number,
        required: [true, 'Publication year is required']
    },
    publisher: {
        type: String,
        trim: true
    },
    doi: {
        type: String,
        trim: true
    },
    externalUrl: {
        type: String,
        trim: true
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

publicationSchema.index({ year: -1, order: 1 });

const Publication = mongoose.model('Publication', publicationSchema);

export default Publication;
