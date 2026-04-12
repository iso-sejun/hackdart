import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';
import { readMockSellerBatches } from '../../src/lib/mockCheckout';

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
  const [batchCount, setBatchCount] = useState(0);

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

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadBatchCount = async () => {
      try {
        const response = await apiRequest('/sellers/me/batches', withAuth(token));
        setBatchCount((response.data.batches || []).length + readMockSellerBatches().length);
      } catch (_error) {
        setBatchCount(readMockSellerBatches().length);
      }
    };

    loadBatchCount();
  }, [token]);

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
        variant="seller"
        roleLabel="Seller Dashboard"
        title="Your farm command deck is online."
        description="Manage your catalog from the cargo hold, keep compliance details up to date, and prep the next harvest for the marketplace."
        navItems={[
          { href: '/seller/products', label: 'Products' },
          { href: '/seller/orders', label: 'Orders' },
        ]}
      >
        <section className="dashboard-hero-card dashboard-hero-card--seller">
          <div className="dashboard-hero-card__copy">
            <p className="eyebrow-gold">Cargo Overview</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream sm:text-5xl">
              Turn surplus harvest into live marketplace inventory.
            </h2>
            <p className="mt-4 max-w-2xl text-[#f5e6c8]/76">
              Your cargo hold keeps listings, food-safety attestation, and outbound order prep in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/seller/products" className="btn-gold">
                Open products
              </Link>
              <Link href="/seller/orders" className="btn-orbit">
                View orders
              </Link>
              <Link href="/marketplace" className="btn-orbit">
                Preview marketplace
              </Link>
            </div>
          </div>

          <div className="dashboard-hero-card__stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Stripe status</span>
              <strong>{profile?.stripeOnboardingStatus || 'not_started'}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Food safety</span>
              <strong>{profile?.foodSafetyAttested ? 'Attested' : 'Missing'}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Farm base</span>
              <strong>{profile?.farmAddress?.city || 'Set city'}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Batches queued</span>
              <strong>{batchCount}</strong>
            </div>
          </div>
        </section>

        <div className="dashboard-grid mt-6">
          <section className="dashboard-panel">
            <p className="eyebrow-gold">Farm</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{profile?.farmName || 'Seller'}</h3>
            <p className="mt-3 text-[#f5e6c8]/72">
              Contact: <span className="text-[#d7bc68]">{profile?.contactName || 'Set contact'}</span>
            </p>
            <p className="mt-2 text-[#f5e6c8]/72">
              Base: <span className="text-[#d7bc68]">{profile?.farmAddress?.city || 'Set city'}, {profile?.farmAddress?.state || 'State'}</span>
            </p>
          </section>

          <section className="dashboard-panel">
            <p className="eyebrow-gold">Quick Actions</p>
            <div className="mt-4 grid gap-3">
              <Link href="/seller/products" className="dashboard-action-card">
                <span className="dashboard-action-card__title">Publish inventory</span>
                <span className="dashboard-action-card__body">Add or edit listings with live price, quantity, and unit data.</span>
              </Link>
              <Link href="/marketplace" className="dashboard-action-card">
                <span className="dashboard-action-card__title">See storefront</span>
                <span className="dashboard-action-card__body">Preview how buyers experience your current produce layout.</span>
              </Link>
            </div>
          </section>
        </div>

        <section className="dashboard-panel mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow-gold">Profile Completion</p>
              <h2 className="mt-3 font-display text-3xl text-brand-cream">
                Keep your farm details marketplace-ready.
              </h2>
            </div>
          </div>

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
                className="themed-textarea"
              />
            </label>
            {message ? <p className="sm:col-span-2 text-sm text-[#d7bc68]">{message}</p> : null}
            <div className="sm:col-span-2">
              <button type="submit" className="btn-gold" disabled={isSaving}>
                {isSaving ? 'Saving profile...' : 'Save seller profile'}
              </button>
            </div>
          </form>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
