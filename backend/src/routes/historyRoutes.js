import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getConversationHistory, getOutputs } from '../controllers/historyController.js';

const router = Router();

router.get('/conversations', requireAuth, getConversationHistory);
router.get('/outputs', requireAuth, getOutputs);

export default router;
