import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    profileImage: {
        url: String,
        publicId: String
    },
    backgroundImage: {
        url: String,
        publicId: String
    },
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        instagram: String,
        website: String
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
