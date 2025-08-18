// controllers/upload.controller.js
import {
  uploadBufferToCloudinary,
  uploadBase64ToCloudinary,
  uploadUrlToCloudinary,
  deleteCloudinaryImage,
  overwriteFromBuffer,
  overwriteFromBase64,
  overwriteFromUrl,
} from '../services/cloudinary.service.js';

/* Upload mới (không bắt buộc overwrite) */
export const uploadSingleImage = async (req, res, next) => {
  try {
    const { folder, publicId, transform, base64, url } = req.body;

    let result;
    if (req.file) {
      result = await uploadBufferToCloudinary(req.file.buffer, { folder, publicId, transform });
    } else if (base64) {
      result = await uploadBase64ToCloudinary(base64, { folder, publicId, transform });
    } else if (url) {
      result = await uploadUrlToCloudinary(url, { folder, publicId, transform });
    } else {
      return res.status(400).json({ success: false, message: 'Thiếu file/base64/url' });
    }

    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/* Overwrite: ghi đè đúng public_id, không chạm các collection khác */
export const overwriteImage = async (req, res, next) => {
  try {
    const { publicId, folder, transform, base64, url } = req.body;
    if (!publicId) return res.status(400).json({ success: false, message: 'Thiếu publicId' });

    let result;
    if (req.file) {
      result = await overwriteFromBuffer(req.file.buffer, { publicId, folder, transform });
    } else if (base64) {
      result = await overwriteFromBase64(base64, { publicId, folder, transform });
    } else if (url) {
      result = await overwriteFromUrl(url, { publicId, folder, transform });
    } else {
      return res.status(400).json({ success: false, message: 'Thiếu file/base64/url' });
    }

    // chỉ trả metadata; KHÔNG cập nhật DB
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ success: false, message: 'Thiếu publicId' });
    const r = await deleteCloudinaryImage(publicId);
    return res.json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
