import { registerLocal, loginLocal, loginWithGoogle, cancelRegister } from '../services/auth.service.js';
import { verifyGoogleIdToken } from '../services/googleOAuth.service.js';
import { verifyEmail } from '../services/mail.service.js';
export async function signupLocal(req, res, next) {
  try {
    const user = await registerLocal(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function signinLocal(req, res, next) {
  try {
    const { user, token } = await loginLocal(req.body);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function googleCredentialLogin(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) throw new Error('Thiếu credential');
    const profile = await verifyGoogleIdToken(credential);
    const { user, token } = await loginWithGoogle(profile); // Service tạo/lấy user & sinh JWT
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function cancelRegisterController(req, res, next) {
  try {
    const { email, otp } = req.body;
    const result = await cancelRegister({ email, otp });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
export async function verifyEmailController(req, res, next) {
  try {
    const { email, otp } = req.body;
    const { user, token } = await verifyEmail({ email, otp });
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}
