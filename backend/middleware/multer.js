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

export const upload = multer({ storage, fileFilter });

export default upload;