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
  const accountHref =
    user?.role === 'seller' ? '/seller/dashboard' : user?.role === 'buyer' ? '/buyer/dashboard' : '/login';
  const cartLabel = isAuthenticated ? 'Cargo Hold' : null;

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
              <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/why-us">
                Why Us
              </Link>
              <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/marketplace">
                Marketplace
              </Link>
              {isAuthenticated ? (
                <>
                  <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href={accountHref}>
                    Account
                  </Link>
                  {cartLabel ? (
                    <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/cart">
                      {cartLabel}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/login">
                    Login
                  </Link>
                  <Link className={`nav-link ${isGoldNav ? 'nav-link-gold' : ''}`} href="/register">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </header>
        ) : null}
        {children}
      </div>
    </main>
  );
}
