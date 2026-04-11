import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

export default function SellerDashboardPage() {
  const { profile, token, refreshSession } = useAuth();
  const [form, setForm] = useState({
    farmName: '',
    contactName: '',
    phone: '',
    email: '',
    description: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!profile) {
      return;
    }

    setForm({
      farmName: profile.farmName || '',
      contactName: profile.contactName || '',
      phone: profile.phone || '',
      email: profile.email || '',
      description: profile.description || '',
      line1: profile.farmAddress?.line1 || '',
      city: profile.farmAddress?.city || '',
      state: profile.farmAddress?.state || '',
      postalCode: profile.farmAddress?.postalCode || '',
      country: profile.farmAddress?.country || 'US',
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    try {
      await apiRequest(
        '/sellers/me',
        withAuth(token, {
          method: 'PATCH',
          body: {
            farmName: form.farmName,
            contactName: form.contactName,
            phone: form.phone,
            email: form.email,
            description: form.description,
            farmAddress: {
              line1: form.line1,
              line2: '',
              city: form.city,
              state: form.state,
              postalCode: form.postalCode,
              country: form.country,
            },
          },
        })
      );

      await refreshSession(token);
      setMessage('Seller profile updated.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedPage roles={['seller']}>
      <DashboardShell
        roleLabel="Seller Dashboard"
        title="Your farm command deck is online."
        description="Complete your seller profile here, then move into products to publish marketplace-ready produce."
        navItems={[{ href: '/seller/products', label: 'Products' }]}
      >
        <div className="dashboard-grid">
          <section className="panel-glow">
            <p className="eyebrow">Farm</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{profile?.farmName || 'Seller'}</h3>
            <p className="mt-3 text-slate-300">
              Stripe onboarding status:{' '}
              <span className="text-emerald-200">{profile?.stripeOnboardingStatus || 'not_started'}</span>
            </p>
            <p className="mt-3 text-slate-300">
              Food safety attested:{' '}
              <span className="text-emerald-200">
                {profile?.foodSafetyAttested ? 'Yes' : 'No'}
              </span>
            </p>
          </section>

          <section className="panel-glow">
            <p className="eyebrow">Inventory</p>
            <p className="mt-3 text-slate-300">
              Start your marketplace catalog and keep produce current from one dedicated workspace.
            </p>
            <Link href="/seller/products" className="btn-primary mt-6">
              Open products
            </Link>
          </section>
        </div>

        <section className="panel-glow mt-6">
          <p className="eyebrow">Profile Completion</p>
          <h2 className="mt-2 font-display text-3xl text-white">Keep your farm details marketplace-ready.</h2>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="field sm:col-span-2">
              <span>Farm name</span>
              <input name="farmName" value={form.farmName} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Contact name</span>
              <input name="contactName" value={form.contactName} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label className="field sm:col-span-2">
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label className="field sm:col-span-2">
              <span>Farm address</span>
              <input name="line1" value={form.line1} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>City</span>
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>State</span>
              <input name="state" value={form.state} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Postal code</span>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Country</span>
              <input name="country" value={form.country} onChange={handleChange} required />
            </label>
            <label className="field sm:col-span-2">
              <span>Farm description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-300/10"
              />
            </label>
            {message ? <p className="sm:col-span-2 text-sm text-emerald-200">{message}</p> : null}
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving profile...' : 'Save seller profile'}
              </button>
            </div>
          </form>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
