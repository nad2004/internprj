import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET;

// Tạo access token (ngắn hạn, ví dụ 15 phút)
export function generateAccessToken(payload, expiresIn = '15m') {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
}

// Tạo refresh token (dài hạn, ví dụ 30 ngày)
export function generateRefreshToken(payload, expiresIn = '30d') {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
}

// Verify access token
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

// Verify refresh token
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
