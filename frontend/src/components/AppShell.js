import Link from 'next/link';

export default function AppShell({ children, compact = false }) {
  return (
    <main className="min-h-screen bg-space text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.14),transparent_30%),linear-gradient(180deg,#06111f_0%,#081223_38%,#03060e_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:90px_90px] opacity-20" />

      <div className={`mx-auto px-6 py-8 ${compact ? 'max-w-5xl' : 'max-w-7xl'}`}>
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-display text-2xl tracking-[0.22em] text-emerald-200">
            HACKDART
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/marketplace">
              Marketplace
            </Link>
            <Link className="nav-link" href="/login">
              Login
            </Link>
            <Link className="nav-link" href="/register">
              Register
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
