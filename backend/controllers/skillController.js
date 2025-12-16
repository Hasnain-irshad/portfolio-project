import Skill from '../models/Skill.js';
import { successResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../middleware/errorHandler.js';

// @desc    Get all visible skills
// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (req, res, next) => {
    try {
        const { category } = req.query;

        const query = { isVisible: true };
        if (category) {
            query.category = category;
        }

        const skills = await Skill.find(query).sort({ category: 1, order: 1 });

        // Group by category
        const groupedSkills = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {});

        successResponse(res, 200, 'Skills fetched successfully', {
            skills,
            grouped: groupedSkills
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all skills (including hidden) - Admin
// @route   GET /api/skills/admin
// @access  Private (Admin)
export const getAllSkillsAdmin = async (req, res, next) => {
    try {
        const skills = await Skill.find().sort({ category: 1, order: 1 });

        successResponse(res, 200, 'Skills fetched successfully', skills);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkillById = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        successResponse(res, 200, 'Skill fetched successfully', skill);
    } catch (error) {
        next(error);
    }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private (Admin)
export const createSkill = async (req, res, next) => {
    try {
        const skill = await Skill.create(req.body);

        successResponse(res, 201, 'Skill created successfully', skill);
    } catch (error) {
        next(error);
    }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        Object.assign(skill, req.body);
        await skill.save();

        successResponse(res, 200, 'Skill updated successfully', skill);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        await skill.deleteOne();

        successResponse(res, 200, 'Skill deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle skill visibility
// @route   PATCH /api/skills/:id/visibility
// @access  Private (Admin)
export const toggleSkillVisibility = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        skill.isVisible = !skill.isVisible;
        await skill.save();

        successResponse(res, 200, 'Skill visibility updated', skill);
    } catch (error) {
        next(error);
    }
};
