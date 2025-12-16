import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Design', 'Other'],
        default: 'Other'
    },
    proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
    },
    proficiencyLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    icon: {
        type: String,
        trim: true
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

// Index for sorting and filtering
skillSchema.index({ category: 1, order: 1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
