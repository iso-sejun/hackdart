import Link from 'next/link';

import { useAuth } from '../context/AuthContext';

export default function DashboardShell({ roleLabel, title, description, children, navItems = [] }) {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen bg-space text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_30%),linear-gradient(180deg,#07121d_0%,#050910_100%)]" />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{roleLabel}</p>
            <h1 className="mt-2 font-display text-4xl text-white">{title}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="nav-link">
              Home
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <button type="button" className="btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <div className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
          <span>Signed in as {user?.email}</span>
          <span className="rounded-full border border-emerald-300/30 px-3 py-1 uppercase tracking-[0.2em] text-emerald-200">
            {user?.role}
          </span>
        </div>

        {children}
      </div>
    </main>
  );
}
