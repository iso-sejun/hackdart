import Link from 'next/link';

export default function AppShell({ children, compact = false, variant = 'default' }) {
  const shellClass =
    variant === 'marketplace'
      ? 'bg-space-market'
      : variant === 'login' || variant === 'register'
        ? 'bg-space-login'
        : variant === 'home'
          ? 'bg-space-home'
          : 'bg-space';

  const isGoldNav = ['marketplace', 'login', 'register', 'home'].includes(variant);

  return (
    <main className={`min-h-screen text-white ${shellClass}`}>
      {variant === 'marketplace' ? <div className="marketplace-backdrop-art" aria-hidden="true" /> : null}
      {variant === 'login' || variant === 'register' ? (
        <>
          <div className="login-backdrop-art" aria-hidden="true" />
          <div className="login-backdrop-overlay" />
        </>
      ) : null}
      {variant === 'home' ? <div className="home-stars" aria-hidden="true" /> : null}

      <div className={`mx-auto px-6 py-8 ${compact ? 'max-w-5xl' : 'max-w-7xl'}`}>
        <header
          className={`mb-10 flex flex-wrap items-center justify-between gap-4 ${
            isGoldNav ? 'market-nav-shell' : ''
          }`}
        >
          <Link
            href="/"
            className={`font-display text-2xl tracking-[0.08em] ${
              isGoldNav ? 'text-brand-gold' : 'text-emerald-200'
            }`}
          >
            HACKDART
          </Link>
          <nav
            className={`flex flex-wrap items-center gap-3 text-sm ${
              isGoldNav ? 'text-[#f5e6c8]/80' : 'text-slate-300'
            }`}
          >
            <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/">
              Home
            </Link>
            <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/marketplace">
              Marketplace
            </Link>
            <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/login">
              Login
            </Link>
            <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/register">
              Register
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
