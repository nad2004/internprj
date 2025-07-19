import express from 'express';
import { signupLocal, signinLocal, googleCredentialLogin, cancelRegisterController, verifyEmailController } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register', signupLocal);
router.post('/login', signinLocal);
router.post('/google-credential', googleCredentialLogin);
router.post('/cancel-register', cancelRegisterController);
router.post('/verify-email', verifyEmailController);

export default router;
