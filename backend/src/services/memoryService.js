import { Message } from '../models/Message.js';

export async function loadConversationContext(conversationId, limit = 12) {
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse().map((item) => ({
    role: item.role,
    content: item.content
  }));
}
