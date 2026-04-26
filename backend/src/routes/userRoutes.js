import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { getSettings, updateSettings } from '../controllers/userController.js';

const router = Router();

router.get('/settings', requireAuth, getSettings);
router.patch(
  '/settings',
  requireAuth,
  body('preferredModel').optional().isString().isLength({ min: 2, max: 120 }),
  body('temperature').optional().isFloat({ min: 0, max: 2 }),
  body('maxTokens').optional().isInt({ min: 128, max: 4096 }),
  body('voiceEnabled').optional().isBoolean(),
  handleValidation,
  updateSettings
);

export default router;
