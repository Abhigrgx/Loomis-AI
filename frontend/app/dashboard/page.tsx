'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

type Conversation = {
  _id?: string;
  title: string;
  mode: string;
  lastMessageAt: string;
};

export default function DashboardPage() {
  const { user, token, hydrate, isHydrated } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch<{ conversations: Conversation[] }>('/history/conversations', {}, token)
      .then((data) => setConversations(data.conversations))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [token, hydrate, isHydrated]);

  if (!token && isHydrated) {
    return (
      <section className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-slate">Dashboard</h1>
        <p className="mt-2 text-sm text-slate/75">Please sign in to view your conversations and outputs.</p>
        <Link href="/auth" className="mt-4 inline-flex rounded-xl bg-pine px-4 py-2 text-sm font-semibold text-white">
          Go to Auth
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-slate">Welcome back{user ? `, ${user.name}` : ''}</h1>
        <p className="mt-2 text-sm text-slate/75">
          Your workspace for AI chat, generated outputs, and automation workflows.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/chat" className="rounded-xl bg-ember px-4 py-2 text-sm font-semibold text-white shadow-glow">
            Open Chat Workspace
          </Link>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-pine">Recent Conversations</h2>
        {loading && <p className="mt-2 text-sm text-slate/70">Loading...</p>}
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        {!loading && !error && conversations.length === 0 && (
          <p className="mt-2 text-sm text-slate/70">No history yet. Start from the chat page.</p>
        )}
        <div className="mt-3 space-y-2">
          {conversations.slice(0, 10).map((conversation, index) => (
            <div key={`${conversation.title}-${index}`} className="rounded-xl border border-slate/10 bg-white p-3">
              <p className="text-sm font-semibold text-slate">{conversation.title}</p>
              <p className="text-xs uppercase text-pine/75">{conversation.mode}</p>
              <p className="text-xs text-slate/60">{new Date(conversation.lastMessageAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
