import * as authService from '../services/auth.service.js';
import { verifyGoogleIdToken } from '../services/googleOAuth.service.js';
import { verifyEmail } from '../services/mail.service.js';
import { accessTokenCookieOptions } from '../config/cookieOptions.js';
import { respondSuccess } from '../utils/respond.js';

export async function signupLocal(req, res, next) {
  try {
    const message = await authService.registerLocal(req.body);
    respondSuccess(res, { message });
  } catch (err) {
    next(err);
  }
}

export async function signinLocal(req, res, next) {
  try {
    const { user, token } = await authService.loginLocal(req.body);
    res.cookie('accessToken', token, accessTokenCookieOptions);
    respondSuccess(res, { data: user });
  } catch (err) {
    next(err);
  }
}

export async function googleCredentialLogin(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) throw new Error('Thiếu credential');
    const profile = await verifyGoogleIdToken(credential);
    const { user, token } = await authService.loginWithGoogle(profile);
    res.cookie('accessToken', token, accessTokenCookieOptions);
    respondSuccess(res, { data: user });
  } catch (err) {
    next(err);
  }
}

export async function cancelRegisterController(req, res, next) {
  try {
    const { email, otp } = req.body;
    const result = await authService.cancelRegister({ email, otp });
    respondSuccess(res, { message: result.message });
  } catch (err) {
    next(err);
  }
}
export async function verifyEmailController(req, res, next) {
  try {
    const { email, otp } = req.body;
    const { message, success } = await verifyEmail({ email, otp });
    respondSuccess(res, { message, success });
  } catch (err) {
    next(err);
  }
}
export async function refreshTokenController(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new Error('No refresh token provided');
    const { user, token: newToken } = await authService.refreshToken(token);
    res.cookie('accessToken', newToken, accessTokenCookieOptions);
    respondSuccess(res, { data: user });
  } catch (err) {
    next(err);
  }
}
export async function logoutController(req, res, next) {
  try {
    res.clearCookie('accessToken', accessTokenCookieOptions);
    await authService.logout(req.body._id);
    respondSuccess(res, { message: 'Đăng xuất thành công' });
  } catch (err) {
    next(err);
  }
}
