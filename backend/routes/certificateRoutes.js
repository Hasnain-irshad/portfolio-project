import express from 'express';
import {
    getAllCertificates,
    getAllCertificatesAdmin,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    toggleCertificateVisibility
} from '../controllers/certificateController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { validators, validate } from '../middleware/validation.js';

// Normalize frontend field names to backend expected names
const normalizeCertificateFields = (req, res, next) => {
    // Frontend uses `name` and `issuingOrganization`; backend expects `title` and `issuer`.
    if (req.body) {
        if (req.body.name && !req.body.title) req.body.title = req.body.name;
        if (req.body.issuingOrganization && !req.body.issuer) req.body.issuer = req.body.issuingOrganization;
    }
    next();
};

const router = express.Router();

// Public routes
router.get('/', getAllCertificates);

// Protected routes (Admin only) - Must come before /:id
router.get('/admin/all', authMiddleware, getAllCertificatesAdmin);

// Public routes continued
router.get('/:id', getCertificateById);
router.post('/', authMiddleware, upload.single('image'), normalizeCertificateFields, validators.certificate, validate, createCertificate);
router.put('/:id', authMiddleware, upload.single('image'), normalizeCertificateFields, validators.certificate, validate, updateCertificate);
router.delete('/:id', authMiddleware, deleteCertificate);
router.patch('/:id/visibility', authMiddleware, toggleCertificateVisibility);

export default router;
