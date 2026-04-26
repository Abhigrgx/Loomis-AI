'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function NavBar() {
  const pathname = usePathname();
  const { user, clearAuth, hydrate, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-pine">
          Loomis AI
        </Link>

        <nav className="flex items-center gap-2 text-sm md:gap-4">
          <Link
            href="/dashboard"
            className={`rounded-full px-3 py-1.5 transition ${pathname === '/dashboard' ? 'bg-pine text-white' : 'text-slate hover:bg-mist'}`}
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className={`rounded-full px-3 py-1.5 transition ${pathname === '/chat' ? 'bg-pine text-white' : 'text-slate hover:bg-mist'}`}
          >
            Chat
          </Link>
          {user ? (
            <button
              type="button"
              onClick={clearAuth}
              className="rounded-full bg-ember px-3 py-1.5 font-medium text-white transition hover:opacity-90"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth" className="rounded-full bg-slate px-3 py-1.5 font-medium text-white transition hover:opacity-90">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
