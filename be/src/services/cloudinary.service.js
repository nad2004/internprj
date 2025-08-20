// services/cloudinary.service.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import crypto from 'crypto';

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

/* -------------------- helpers core -------------------- */
function uploadBuffer(buffer, { folder, publicId, overwrite = false, transform } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        public_id: publicId,
        overwrite,
        unique_filename: false, // dùng đúng public_id truyền vào
        transformation: transform,
      },
      (err, res) => (err ? reject(err) : resolve(pick(res)))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function findImageByPublicId(publicId) {
  try {
    const r = await cloudinary.api.resource(publicId, { resource_type: 'image' });
    return pick(r);
  } catch (e) {
    // Cloudinary SDK có nhiều dạng error khác nhau:
    const code =
      e?.http_code ??
      e?.status ??
      e?.response?.status ??
      e?.error?.http_code;

    const msg = (e?.message || e?.error?.message || '').toLowerCase();

    // 404 -> coi như "chưa có", trả null để tiếp tục upload
    if (code === 404 || msg.includes('not found')) {
      return null;
    }

    // các lỗi khác mới ném ra
    throw e;
  }
}

function dataUriToBuffer(dataUri) {
  const m = String(dataUri).match(/^data:(.+?);base64,(.+)$/);
  if (!m) throw new Error('Invalid base64 data URI');
  return Buffer.from(m[2], 'base64');
}

/* -------------------- CÁCH 1: DEDUPE THEO NỘI DUNG -------------------- */
// File/buffer
export async function uploadOrReuseByHashFromBuffer(
  buffer,
  { folder = 'library/uploads', transform } = {}
) {
  if (!buffer) throw new Error('Missing file buffer');

  const hash = crypto.createHash('sha1').update(buffer).digest('hex');
  const publicId = folder ? `${folder}/${hash}` : hash;

  let existed = null;
  try {
    existed = await findImageByPublicId(publicId);
  } catch (err) {
    // log để debug nếu có lỗi lạ (401/403/5xx)
    console.error('[CLD resource check error]', {
      code: err?.http_code || err?.status || err?.error?.http_code,
      msg: err?.message || err?.error?.message,
    });
    throw err; // chỉ throw khi không phải 404
  }

  if (existed) return { ...existed, existed: true };

  // upload mới
  const r = await uploadBuffer(buffer, { folder, publicId, overwrite: false, transform });
  return { ...r, existed: false };
}

// Base64
export async function uploadOrReuseByHashFromBase64(dataUri, opts = {}) {
  const buffer = dataUriToBuffer(dataUri);
  return uploadOrReuseByHashFromBuffer(buffer, opts);
}

/* -------------------- Overwrite (giữ cho endpoint riêng khi cần) -------------------- */
export function overwriteFromBuffer(buffer, { publicId, folder, transform } = {}) {
  if (!buffer) throw new Error('Missing file buffer');
  if (!publicId) throw new Error('Missing publicId');
  return uploadBuffer(buffer, {
    folder,
    publicId,
    overwrite: true,
    transform,
  });
}

export async function overwriteFromBase64(dataUri, opts = {}) {
  if (!opts?.publicId) throw new Error('Missing publicId');
  const buffer = dataUriToBuffer(dataUri);
  return overwriteFromBuffer(buffer, opts);
}

export async function overwriteFromUrl(url, opts = {}) {
  if (!opts?.publicId) throw new Error('Missing publicId');
  const r = await cloudinary.uploader.upload(url, {
    resource_type: 'image',
    folder: opts.folder,
    public_id: opts.publicId,
    overwrite: true,
    unique_filename: false,
    transformation: opts.transform,
  });
  return pick(r);
}

/* -------------------- Delete asset -------------------- */
export async function deleteCloudinaryImage(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
