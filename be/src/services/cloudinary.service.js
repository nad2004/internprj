// services/cloudinary.service.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const pick = (r) => ({
  public_id: r.public_id,
  url: r.secure_url || r.url,
  width: r.width,
  height: r.height,
  format: r.format,
  bytes: r.bytes,
  folder: r.folder,
  version: r.version,
});

/* ===== Upload bình thường (giữ nguyên để dùng khi cần) ===== */
export function uploadBufferToCloudinary(
  buffer,
  {
    folder = 'library/uploads',
    publicId,
    overwrite = false,
    transform, // ví dụ: { width: 800, height: 800, crop: 'limit' }
  } = {},
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        public_id: publicId,
        overwrite,
        transformation: transform,
      },
      (err, res) => (err ? reject(err) : resolve(pick(res))),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function uploadBase64ToCloudinary(dataUri, opts = {}) {
  const r = await cloudinary.uploader.upload(dataUri, {
    resource_type: 'image',
    folder: opts.folder || 'library/uploads',
    public_id: opts.publicId,
    overwrite: opts.overwrite || false,
    transformation: opts.transform,
  });
  return pick(r);
}

export async function uploadUrlToCloudinary(url, opts = {}) {
  const r = await cloudinary.uploader.upload(url, {
    resource_type: 'image',
    folder: opts.folder || 'library/uploads',
    public_id: opts.publicId,
    overwrite: opts.overwrite || false,
    transformation: opts.transform,
  });
  return pick(r);
}

/* ===== Overwrite: ghi đè đúng public_id, invalidate CDN ===== */
export function overwriteFromBuffer(
  buffer,
  { publicId, folder, transform } = {},
) {
  if (!buffer) throw new Error('Missing file buffer');
  if (!publicId) throw new Error('Missing publicId');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        public_id: publicId,
        overwrite: true,
        invalidate: true,       // xóa cache CDN
        unique_filename: false, // giữ nguyên public_id
        transformation: transform,
      },
      (err, res) => (err ? reject(err) : resolve(pick(res))),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function overwriteFromBase64(dataUri, opts = {}) {
  if (!opts?.publicId) throw new Error('Missing publicId');
  const r = await cloudinary.uploader.upload(dataUri, {
    resource_type: 'image',
    folder: opts.folder,
    public_id: opts.publicId,
    overwrite: true,
    invalidate: true,
    unique_filename: false,
    transformation: opts.transform,
  });
  return pick(r);
}

export async function overwriteFromUrl(url, opts = {}) {
  if (!opts?.publicId) throw new Error('Missing publicId');
  const r = await cloudinary.uploader.upload(url, {
    resource_type: 'image',
    folder: opts.folder,
    public_id: opts.publicId,
    overwrite: true,
    invalidate: true,
    unique_filename: false,
    transformation: opts.transform,
  });
  return pick(r);
}

/* ===== Delete asset ===== */
export async function deleteCloudinaryImage(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
