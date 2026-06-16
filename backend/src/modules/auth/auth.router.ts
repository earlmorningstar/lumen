import { Router, type Router as RouterType } from 'express';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import { authenticate } from '../../middleware/auth';
import * as authController from './auth.controller';
import { loginSchema, registerSchema } from './auth.schemas';

const router: RouterType = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;