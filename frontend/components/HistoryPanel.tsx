'use client';

type Conversation = {
  _id?: string;
  id?: string;
  title: string;
  mode: string;
  lastMessageAt: string;
};

type Props = {
  loading: boolean;
  error: string | null;
  conversations: Conversation[];
  onOpen: (id: string) => void;
};

export function HistoryPanel({ loading, error, conversations, onOpen }: Props) {
  return (
    <aside className="glass h-full rounded-2xl p-4">
      <h2 className="mb-3 text-lg font-semibold text-pine">History</h2>

      {loading && <p className="text-sm text-slate/70">Loading conversation history...</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!loading && !error && conversations.length === 0 && (
        <p className="text-sm text-slate/70">No conversations yet. Start your first prompt.</p>
      )}

      <div className="mt-2 space-y-2">
        {conversations.map((conversation) => {
          const id = conversation.id || conversation._id || '';
          return (
            <button
              key={id}
              type="button"
              onClick={() => id && onOpen(id)}
              className="w-full rounded-xl border border-slate/10 bg-white p-3 text-left transition hover:border-pine/40"
            >
              <p className="truncate text-sm font-semibold text-slate">{conversation.title}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-pine/80">{conversation.mode}</p>
              <p className="mt-1 text-xs text-slate/60">{new Date(conversation.lastMessageAt).toLocaleString()}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
