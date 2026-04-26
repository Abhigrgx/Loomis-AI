'use client';

import { useEffect, useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { HistoryPanel } from '@/components/HistoryPanel';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

type Conversation = {
  _id?: string;
  id?: string;
  title: string;
  mode: string;
  lastMessageAt: string;
};

export default function ChatPage() {
  const { token, hydrate, isHydrated } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
      return;
    }

    if (!token) {
      setHistoryLoading(false);
      return;
    }

    apiFetch<{ conversations: Conversation[] }>('/history/conversations', {}, token)
      .then((data) => setConversations(data.conversations))
      .catch((err) => setHistoryError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setHistoryLoading(false));
  }, [token, hydrate, isHydrated]);

  function handleConversationCreated(id: string) {
    setConversationId(id);
    setHistoryLoading(true);

    if (!token) {
      return;
    }

    apiFetch<{ conversations: Conversation[] }>('/history/conversations', {}, token)
      .then((data) => setConversations(data.conversations))
      .catch((err) => setHistoryError(err instanceof Error ? err.message : 'Failed to refresh history'))
      .finally(() => setHistoryLoading(false));
  }

  return (
    <section className="grid gap-4 md:grid-cols-[300px_1fr]">
      <HistoryPanel
        loading={historyLoading}
        error={historyError}
        conversations={conversations}
        onOpen={(id) => setConversationId(id)}
      />
      <ChatInterface conversationId={conversationId} onConversationCreated={handleConversationCreated} />
    </section>
  );
}
