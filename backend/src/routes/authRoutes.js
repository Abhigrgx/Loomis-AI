import { Router } from 'express';
import { body } from 'express-validator';
import { handleValidation } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { login, me, register } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').isLength({ min: 2, max: 80 }),
  handleValidation,
  register
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  handleValidation,
  login
);

router.get('/me', requireAuth, me);

export default router;
