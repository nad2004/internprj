import express from 'express';
import {
  signupLocal,
  signinLocal,
  googleCredentialLogin,
  cancelRegisterController,
  verifyEmailController,
} from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register-local', signupLocal);
router.post('/login-local', signinLocal);
router.post('/login-google', googleCredentialLogin);
router.post('/cancel-register', cancelRegisterController);
router.post('/verify-email', verifyEmailController);

export default router;
