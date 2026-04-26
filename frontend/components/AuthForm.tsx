'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

type Mode = 'login' | 'register';

export function AuthForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };

      const data = await apiFetch<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
        path,
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      setAuth(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass mx-auto w-full max-w-md rounded-2xl p-6">
      <div className="mb-5 flex rounded-xl bg-mist p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-pine' : 'text-slate/70'}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white text-pine' : 'text-slate/70'}`}
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className="w-full rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm outline-none focus:border-ember"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm outline-none focus:border-ember"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          minLength={8}
          className="w-full rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm outline-none focus:border-ember"
          required
        />

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-pine px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
