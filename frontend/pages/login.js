import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import AppShell from '../src/components/AppShell';
import AuthCard from '../src/components/AuthCard';
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
    <AppShell compact>
      <AuthCard
        eyebrow="Launch Login"
        title="Reconnect to the shared greenhouse ship."
        description={helperText}
        footerText="Need a new account?"
        footerHref="/register"
        footerLabel="Create one"
      >
        <div className="mb-6 flex gap-3 rounded-full border border-white/10 bg-slate-900/70 p-1">
          {roles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.id)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                role === item.id
                  ? 'bg-emerald-300 text-slate-950'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
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

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : `Login as ${role}`}
          </button>
        </form>
      </AuthCard>
    </AppShell>
  );
}
