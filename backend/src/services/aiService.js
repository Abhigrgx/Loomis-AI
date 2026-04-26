import OpenAI from 'openai';
import { env } from '../config/env.js';

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

export async function runChatCompletion({ model, temperature, maxTokens, messages }) {
  if (!client) {
    return {
      content: 'OPENAI_API_KEY is not configured. This is a safe fallback response from Loomis AI backend.',
      usage: {
        inputTokens: 0,
        outputTokens: 0
      },
      model: 'fallback-local'
    };
  }

  try {
    const response = await client.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages
    });

    const choice = response.choices?.[0]?.message?.content || '';

    return {
      content: choice,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0
      },
      model: response.model
    };
  } catch (err) {
    // Gracefully fall back when the OpenAI key is invalid, over-quota, or the
    // service is temporarily unavailable so the rest of the app keeps working.
    const status = err?.status ?? err?.response?.status;
    if (status === 401 || status === 429 || (status >= 500 && status < 600)) {
      return {
        content: `OpenAI unavailable (${status}). This is a safe fallback response from Loomis AI backend.`,
        usage: { inputTokens: 0, outputTokens: 0 },
        model: 'fallback-local'
      };
    }
    throw err;
  }
}
