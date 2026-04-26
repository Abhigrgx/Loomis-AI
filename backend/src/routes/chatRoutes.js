import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { strictAiRateLimiter } from '../middleware/rateLimiter.js';
import { createOrContinueChat, getConversationMessages } from '../controllers/chatController.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  strictAiRateLimiter,
  body('prompt').isString().isLength({ min: 1, max: 10000 }),
  body('conversationId').optional().isString(),
  body('mode').optional().isIn(['chat', 'agent', 'code', 'image', 'video']),
  handleValidation,
  createOrContinueChat
);

router.get(
  '/:conversationId/messages',
  requireAuth,
  param('conversationId').isString(),
  handleValidation,
  getConversationMessages
);

export default router;
