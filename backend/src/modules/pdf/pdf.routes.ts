import { Router } from 'express';
import multer from 'multer';
import { PdfController } from './pdf.controller';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { error } from '../../utils/apiResponse';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

const router = Router();

// Handle multer error specifically or pass to global handler
router.post(
  '/upload',
  requireAuth,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        res.status(400).json(error(err.message));
        return;
      }
      next();
    });
  },
  asyncHandler(PdfController.upload)
);

router.get('/', asyncHandler(PdfController.listForResource));
router.get('/:id', asyncHandler(PdfController.get));

export default router;
