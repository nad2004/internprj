// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLODINARY_API_SECRET_KEY,
});

export default cloudinary;
