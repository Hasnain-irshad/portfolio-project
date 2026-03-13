import Project from "../models/Project.js";
import Certificate from "../models/Certificate.js";
import Contact from "../models/Contact.js";
import Skill from "../models/Skill.js";
import Blog from "../models/Blog.js";
import { successResponse } from "../utils/apiResponse.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const [projectCount, certificateCount, messageCount, skillCount, blogCount] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Skill.countDocuments(),
      Blog.countDocuments()
    ]);

    successResponse(res, 200, "Dashboard stats fetched successfully", {
      projects: projectCount,
      certificates: certificateCount,
      unreadMessages: messageCount,
      skills: skillCount,
      blogs: blogCount
    });
  } catch (error) {
    next(error);
  }
};
