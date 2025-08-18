// middleware/uploadImage.js
import multer from 'multer';

const storage = multer.memoryStorage();
const MAX_MB = 5;

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//i.test(file.mimetype)) return cb(null, true);
    cb(new Error('Chỉ cho phép file ảnh'));
  },
}).single('file'); // field name = "file"
