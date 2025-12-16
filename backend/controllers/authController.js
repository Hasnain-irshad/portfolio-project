import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse } from '../utils/apiResponse.js';
import { ValidationError, UnauthorizedError } from '../middleware/errorHandler.js';

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public (should be restricted in production)
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new ValidationError("Admin already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    // Don't send password in response
    const adminData = {
      id: admin._id,
      name: admin.name,
      email: admin.email
    };

    successResponse(res, 201, "Admin registered successfully", adminData);
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    successResponse(res, 200, "Login successful", {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    successResponse(res, 200, 'Admin profile fetched', admin);
  } catch (error) {
    next(error);
  }
};
