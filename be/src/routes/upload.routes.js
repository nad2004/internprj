// routes/upload.routes.js
import { Router } from 'express';
import { uploadImage } from '../middleware/uploadImage.js';
import * as uploadController from '../controllers/upload.controller.js';

const router = Router();

// POST /upload/image  -> dedupe theo nội dung (CÁCH 1)
router.post('/image', uploadImage, uploadController.uploadSingleImage);

// Overwrite (khi đã có publicId)
router.post('/image/overwrite', uploadImage, uploadController.overwriteImage);

// Delete
router.delete('/image', uploadController.deleteImage);

export default router;
