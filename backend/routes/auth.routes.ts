import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-register', authController.verifyOtpAndRegister);
router.post('/update-profile', authController.updateProfile);

export default router;
