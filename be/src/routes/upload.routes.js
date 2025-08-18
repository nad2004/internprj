// routes/upload.routes.js
import { Router } from 'express';
import { uploadImage } from '../middleware/uploadImage.js';
import * as uploadController from '../controllers/upload.controller.js';

const router = Router();

// Upload mới
router.post('/image', uploadImage, uploadController.uploadSingleImage);
router.post('/image/base64', uploadController.uploadSingleImage);
router.post('/image/url', uploadController.uploadSingleImage);

// Overwrite (ghi đè public_id hiện có)
router.post('/image/overwrite', uploadImage, uploadController.overwriteImage);

// Delete
router.delete('/image', uploadController.deleteImage);

export default router;
