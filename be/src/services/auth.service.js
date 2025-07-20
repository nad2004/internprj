// src/services/auth.service.js
import User from '../models/User.js';
import Credential from '../models/Credential.js';
import bcrypt from 'bcryptjs';
import generatedOtp from '../utils/generatedOtp.js';
import { sendMail } from './mail.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export async function registerLocal({ username, password, email }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error(' Email đã được sử dụng');
  }
  const otp = generatedOtp();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'Guest')}&background=random`;
  const user = new User({
    username,
    email,
    otp,
    avartar: avatarUrl,
    otpExpire: Date.now() + 1 * 60 * 1000,
    verified: false,
  });
  await user.save();

  const passwordHash = await bcrypt.hash(password, 10);
  await Credential.create({
    userId: user._id,
    provider: 'local',
    passwordHash,
  });
  await sendMail({
    to: email,
    subject: 'Xác thực email đăng ký',
    name: username,
    otp: otp,
  });
  return { message: 'Vui lòng kiểm tra email để xác thực.' };
}
export async function cancelRegister({ email, otp }) {
  const user = await User.findOneAndDelete({ email, otp, verified: false });
  const cred = await Credential.findOneAndDelete({ userId: user._id, provider: 'local' });
  if (!user) throw new Error('User không tồn tại hoặc đã xác thực!');
  if (!cred) throw new Error('Không tìm thấy credential tương ứng!');
  return { message: 'Đã huỷ đăng ký thành công.' };
}
export async function loginLocal({ email, password }) {
  const user = await User.findOne({ email, verified: true });
  if (!user) {
    // Nên tạo error có status để errorHandler biết (VD 401 Unauthorized)
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const cred = await Credential.findOne({
    userId: user._id,
    provider: 'local',
  });
  if (!cred) {
    const err = new Error('Không có phương thức đăng nhập local');
    err.status = 400;
    throw err;
  }
  const valid = await bcrypt.compare(password, cred.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const payload = { userId: user._id, role: user.role };
  const token = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();
  return { user, token };
}
export async function loginWithGoogle(profile) {
  const { googleId, email, name, picture } = profile;
  let cred = await Credential.findOne({
    provider: 'google',
    providerUserId: googleId,
  });

  let user;
  if (cred) {
    user = await User.findById(cred.userId);
  } else {
    user = await User.findOne({ email });
    if (!user) {
      let base = email.split('@')[0];
      let username = base;
      while (await User.findOne({ username })) {
        username = `${base}`;
      }
      user = await User.create({
        username,
        email,
        name,
        avartar: picture,
        verified: true,
      });
    }
    cred = await Credential.create({
      userId: user._id,
      provider: 'google',
      providerUserId: googleId,
    });
  }
  const payload = { userId: user._id, role: user.role };
  const token = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();

  return { user, token };
}
