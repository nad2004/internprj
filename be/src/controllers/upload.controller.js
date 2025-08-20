// controllers/upload.controller.js
import {
  uploadOrReuseByHashFromBuffer,
  uploadOrReuseByHashFromBase64,
  overwriteFromBuffer,
  overwriteFromBase64,
  overwriteFromUrl,
  deleteCloudinaryImage,
} from '../services/cloudinary.service.js';

/**
 * POST /upload/image
 * - Không truyền publicId -> DEDUPE theo nội dung (CÁCH 1)
 * - Hỗ trợ: multipart (file) hoặc base64
 * - Trả: { success, data:{ url, public_id, existed? } }
 */
export const uploadSingleImage = async (req, res, next) => {
  try {
    const { folder, transform, base64 } = req.body;
    let result;
    if (req.file) {
      result = await uploadOrReuseByHashFromBuffer(req.file.buffer, { folder, transform });
    } else if (base64) {
      result = await uploadOrReuseByHashFromBase64(base64, { folder, transform });
    } else {
      return res.status(400).json({ success: false, message: 'Thiếu file/base64' });
    }

    // existed: true -> 200, else 201
    const code = result.existed ? 200 : 201;
    return res.status(code).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /upload/image/overwrite
 * - Ghi đè đúng public_id (khi bạn đã lưu public_id và muốn thay thế)
 */
export const overwriteImage = async (req, res, next) => {
  try {
    const { publicId, folder, transform, base64, url } = req.body;
    if (!publicId) return res.status(400).json({ success: false, message: 'Thiếu publicId' });

    let result;
    if (req.file)       result = await overwriteFromBuffer(req.file.buffer, { publicId, folder, transform });
    else if (base64)    result = await overwriteFromBase64(base64, { publicId, folder, transform });
    else if (url)       result = await overwriteFromUrl(url, { publicId, folder, transform });
    else                return res.status(400).json({ success: false, message: 'Thiếu file/base64/url' });

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
