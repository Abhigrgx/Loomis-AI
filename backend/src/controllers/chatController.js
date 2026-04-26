import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { AiOutput } from '../models/AiOutput.js';
import { Setting } from '../models/Setting.js';
import { buildSystemPrompt } from '../services/templates/chatSystemPrompt.js';
import { loadConversationContext } from '../services/memoryService.js';
import { runChatCompletion } from '../services/aiService.js';

function buildTitleFromPrompt(prompt) {
  const cleaned = prompt.trim().replace(/\s+/g, ' ');
  return cleaned.slice(0, 70) || 'New Conversation';
}

export async function createOrContinueChat(req, res, next) {
  try {
    const { prompt, conversationId, mode = 'chat' } = req.body;
    const userId = req.auth.sub;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        mode,
        title: buildTitleFromPrompt(prompt)
      });
    }

    const userMessage = await Message.create({
      conversationId: conversation._id,
      userId,
      role: 'user',
      content: prompt
    });

    const settings = await Setting.findOne({ userId }).lean();
    const contextMessages = await loadConversationContext(conversation._id);

    const systemMessage = {
      role: 'system',
      content: buildSystemPrompt(mode)
    };

    const start = Date.now();
    const aiResult = await runChatCompletion({
      model: settings?.preferredModel || 'gpt-4o-mini',
      temperature: settings?.temperature ?? 0.3,
      maxTokens: settings?.maxTokens ?? 1024,
      messages: [systemMessage, ...contextMessages]
    });

    const latencyMs = Date.now() - start;

    const assistantMessage = await Message.create({
      conversationId: conversation._id,
      userId,
      role: 'assistant',
      content: aiResult.content,
      metadata: {
        inputTokens: aiResult.usage.inputTokens,
        outputTokens: aiResult.usage.outputTokens,
        model: aiResult.model,
        latencyMs
      }
    });

    await Conversation.updateOne(
      { _id: conversation._id },
      {
        $set: {
          lastMessageAt: new Date(),
          mode
        }
      }
    );

    const output = await AiOutput.create({
      userId,
      conversationId: conversation._id,
      outputType: 'text',
      content: aiResult.content,
      exportFormat: 'md'
    });

    return res.status(201).json({
      conversation: {
        id: conversation._id,
        title: conversation.title,
        mode: conversation.mode,
        lastMessageAt: conversation.lastMessageAt
      },
      requestMessage: {
        id: userMessage._id,
        role: userMessage.role,
        content: userMessage.content
      },
      responseMessage: {
        id: assistantMessage._id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        metadata: assistantMessage.metadata
      },
      output: {
        id: output._id,
        exportFormat: output.exportFormat
      }
    });
  } catch (err) {
    return next(err);
  }
}

export async function getConversationMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const userId = req.auth.sub;

    const conversation = await Conversation.findOne({ _id: conversationId, userId }).lean();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId, userId }).sort({ createdAt: 1 }).lean();

    return res.json({ conversation, messages });
  } catch (err) {
    return next(err);
  }
}
