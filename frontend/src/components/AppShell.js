import Link from 'next/link';

import { useAuth } from '../context/AuthContext';

export default function AppShell({
  children,
  compact = false,
  variant = 'default',
  showHeader = true,
}) {
  const { isAuthenticated, logout, user } = useAuth();
  const shellClass =
    variant === 'marketplace'
      ? 'bg-space-market'
      : variant === 'login' || variant === 'register'
        ? 'bg-space-login'
        : variant === 'home'
          ? 'bg-space-home'
          : variant === 'mission' || variant === 'why-us'
            ? 'bg-space-story'
          : 'bg-space';

  const isGoldNav = ['marketplace', 'login', 'register', 'home', 'mission', 'why-us'].includes(variant);
  const isAuthVariant = ['login', 'register'].includes(variant);
  const dashboardHref =
    user?.role === 'seller' ? '/seller/dashboard' : user?.role === 'buyer' ? '/buyer/dashboard' : null;

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
      {variant === 'mission' || variant === 'why-us' ? (
        <div className={`story-backdrop story-backdrop--${variant}`} aria-hidden="true" />
      ) : null}

      <div className={`relative z-[1] mx-auto px-6 py-8 ${compact ? 'max-w-5xl' : 'max-w-7xl'}`}>
        {showHeader ? (
          <header
            className={`mb-10 flex flex-wrap items-center justify-between gap-4 ${
              isGoldNav ? 'market-nav-shell' : ''
            } ${isAuthVariant ? 'auth-shell-header' : ''}`}
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
              {isAuthenticated ? (
                <>
                  {dashboardHref ? (
                    <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href={dashboardHref}>
                      Dashboard
                    </Link>
                  ) : null}
                  <span
                    className={`rounded-full border px-4 py-3 text-xs uppercase tracking-[0.2em] ${
                      isGoldNav
                        ? 'border-[#c9a84c]/25 bg-[#0f1b3d]/35 text-[#d7bc68]'
                        : 'border-white/10 bg-white/5 text-white/70'
                    }`}
                  >
                    {user?.role || 'signed in'}
                  </span>
                  <button
                    type="button"
                    className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </nav>
          </header>
        ) : null}
        {children}
      </div>
    </main>
  );
}
