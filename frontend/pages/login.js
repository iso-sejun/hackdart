import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import AppShell from '../src/components/AppShell';
import AuthCard from '../src/components/AuthCard';
import BrandLockup from '../src/components/BrandLockup';
import { useAuth } from '../src/context/AuthContext';

const roles = [
  { id: 'buyer', label: 'Buyer' },
  { id: 'seller', label: 'Seller' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const accountHref =
    user?.role === 'seller' ? '/seller/dashboard' : user?.role === 'buyer' ? '/buyer/dashboard' : '/login';

  const helperText = useMemo(
    () =>
      role === 'seller'
        ? 'Sign in to manage produce, inventory, and seller operations.'
        : 'Sign in to browse produce and track your pickup orders.',
    [role]
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
  }, [isAuthenticated, router, user]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const user = await login(form);
      router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  };

  return (
    <AppShell compact variant="login" showHeader={false}>
      <header className="market-nav-shell auth-page-header mb-10 flex flex-wrap items-center justify-between gap-4">
        <BrandLockup textClassName="text-brand-gold" />
        <nav className="flex flex-wrap items-center gap-3 text-sm text-[#f5e6c8]/80">
          <Link className="nav-link nav-link-gold" href="/">
            Home
          </Link>
          <Link className="nav-link nav-link-gold" href="/mission">
            Mission
          </Link>
          <Link className="nav-link nav-link-gold" href="/marketplace">
            Marketplace
          </Link>
          {isAuthenticated ? (
            <Link className="nav-link nav-link-gold" href={accountHref}>
              Account
            </Link>
          ) : (
            <>
              <Link className="nav-link nav-link-gold" href="/login">
                Login
              </Link>
              <Link className="nav-link nav-link-gold" href="/register">
                Register
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <Link className="nav-link nav-link-gold" href="/cart">
              Cargo Hold
            </Link>
          ) : null}
        </nav>
      </header>
      <AuthCard
        eyebrow="Launch Login"
        title="Reconnect to the shared greenhouse ship."
        description={helperText}
        footerText="Need a new account?"
        footerHref="/register"
        footerLabel="Create one"
        variant="login"
      >
        <div className="login-role-switch mb-6 flex gap-3 rounded-full p-1">
          {roles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.id)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                role === item.id
                  ? 'bg-[#c9a84c] text-space-navy shadow-[0_10px_30px_rgba(201,168,76,0.22)]'
                  : 'text-[#f5e6c8]/72 hover:bg-white/5 hover:text-[#f5e6c8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </label>

          {error ? <p className="text-sm text-[#f7c8c8]">{error}</p> : null}

          <button type="submit" className="btn-gold w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : `Login as ${role}`}
          </button>
        </form>
      </AuthCard>
    </AppShell>
  );
}
