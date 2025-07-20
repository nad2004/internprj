// src/config/cookieOptions.js

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'development' ? false : true,
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 phút
  path: '/',
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'development' ? false : true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  path: '/',
};
