import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: No token provided" });
  }

  // Remove "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach only the admin id to req.admin as requested
    req.admin = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access: Invalid token" });
  }
};

export default authMiddleware;