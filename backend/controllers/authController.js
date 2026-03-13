import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { successResponse } from '../utils/apiResponse.js';
import { ValidationError, UnauthorizedError } from '../middleware/errorHandler.js';

// @desc    Signup admin
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new ValidationError("Admin already exists");
    }

    const admin = await Admin.create({
      name,
      email,
      password
    });

    successResponse(res, 201, "Admin registered successfully", {
      id: admin._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('DEBUG: Login attempt for email:', email);
    console.log('DEBUG: Password length provided:', password ? password.length : 0);

    const admin = await Admin.findOne({ email });
    console.log('DEBUG: Admin found in DB:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      console.log('DEBUG: Login failed - Admin not found');
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('DEBUG: Login failed - Password mismatch');
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log('DEBUG: Login successful');
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
    const admin = await Admin.findById(req.admin).select('-password');

    if (!admin) {
      throw new UnauthorizedError('Admin not found');
    }

    successResponse(res, 200, 'Admin profile fetched', admin);
  } catch (error) {
    next(error);
  }
};
