import multer from 'multer';
import { ValidationError } from '../middleware/errorHandler.js';

// Use memory storage so serverless environments can handle uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedPdfTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (allowedImageTypes.includes(file.mimetype) || allowedPdfTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Invalid file type. Only images and PDF/DOC/DOCX files are allowed.'), false);
  }
};

// Limit file size to 10 MB — matches Cloudinary's free-tier per-asset cap and
// keeps memory use bounded on Render's free dyno.
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

export default upload;