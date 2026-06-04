import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerValidator, loginValidator } from './auth.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.post('/register', registerValidator, validate, asyncHandler(AuthController.register));
router.post('/login', loginValidator, validate, asyncHandler(AuthController.login));
router.get('/me', requireAuth, asyncHandler(AuthController.me));
router.get('/google', AuthController.getGoogleUrl);
router.get('/google/callback', asyncHandler(AuthController.handleGoogleCallback));

export default router;
