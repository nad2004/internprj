import express from 'express';
import * as authController from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register-local', authController.signupLocal);
router.post('/login-local', authController.signinLocal);
router.post('/login-google', authController.googleCredentialLogin);
router.post('/cancel-register', authController.cancelRegisterController);
router.post('/verify-email', authController.verifyEmailController);
router.post('/logout', authController.logoutController);

export default router;
