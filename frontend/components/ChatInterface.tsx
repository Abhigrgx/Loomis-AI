'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
};

export function ChatInterface({ conversationId, onConversationCreated }: Props) {
  const token = useAuthStore((s) => s.token);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim() || !token) {
      return;
    }

    setLoading(true);
    setError(null);

    const optimisticUser: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt
    };

    setMessages((prev) => [...prev, optimisticUser]);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const data = await apiFetch<{
        conversation: { id: string };
        responseMessage: { id: string; role: 'assistant'; content: string };
      }>(
        '/chat',
        {
          method: 'POST',
          body: JSON.stringify({
            prompt: currentPrompt,
            conversationId,
            mode: 'chat'
          })
        },
        token
      );

      if (!conversationId) {
        onConversationCreated(data.conversation.id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.responseMessage.id,
          role: data.responseMessage.role,
          content: data.responseMessage.content
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass flex h-[72vh] flex-col rounded-2xl p-4">
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-xl bg-white/60 p-3">
        {messages.length === 0 && (
          <p className="text-sm text-slate/70">
            Ask Loomis AI anything about coding, content strategy, workflows, or product decisions.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto bg-pine text-white' : 'bg-white text-slate'}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {error && <p className="mb-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={sendMessage} className="flex items-end gap-2">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Type your prompt..."
          className="min-h-16 flex-1 resize-none rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm outline-none focus:border-ember"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="rounded-xl bg-ember px-4 py-2 text-sm font-semibold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </section>
  );
}
