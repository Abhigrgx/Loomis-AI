import { Conversation } from '../models/Conversation.js';
import { AiOutput } from '../models/AiOutput.js';

export async function getConversationHistory(req, res, next) {
  try {
    const userId = req.auth.sub;
    const conversations = await Conversation.find({ userId })
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();

    return res.json({ conversations });
  } catch (err) {
    return next(err);
  }
}

export async function getOutputs(req, res, next) {
  try {
    const userId = req.auth.sub;
    const outputs = await AiOutput.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({ outputs });
  } catch (err) {
    return next(err);
  }
}
