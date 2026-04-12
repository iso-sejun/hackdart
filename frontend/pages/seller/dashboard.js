import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';
import { withDisplayFoodBank } from '../../src/lib/foodBankDisplay';

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
  const [batches, setBatches] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');

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

    const loadAnalytics = async () => {
      setIsAnalyticsLoading(true);
      setAnalyticsError('');

      try {
        const [batchResponse, productResponse] = await Promise.all([
          apiRequest('/sellers/me/batches', withAuth(token)),
          apiRequest('/sellers/me/products', withAuth(token)),
        ]);

        const nextBatches =
          (batchResponse.data.batches || []).map((batch) => ({
            ...batch,
            foodBank: withDisplayFoodBank(batch.foodBank),
          })) || [];
        setBatches(nextBatches);
        setBatchCount(nextBatches.length);
        setProductCount((productResponse.data.products || []).length);
      } catch (error) {
        setBatchCount(0);
        setBatches([]);
        setProductCount(0);
        setAnalyticsError(error.message || 'Could not load seller analytics.');
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, [token]);

  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalOrders = batches.reduce((sum, batch) => sum + (batch.orderCount || 0), 0);
    const currentMonthEarnings = batches.reduce((sum, batch) => {
      const batchOrders = batch.orders || [];

      return (
        sum +
        batchOrders.reduce((innerSum, order) => {
          const createdAt = order.createdAt ? new Date(order.createdAt) : null;

          if (
            !createdAt ||
            createdAt.getMonth() !== currentMonth ||
            createdAt.getFullYear() !== currentYear
          ) {
            return innerSum;
          }

          return innerSum + (order.buyerTotal || 0);
        }, 0)
      );
    }, 0);

    const topLocationEntries = Object.values(
      batches.reduce((accumulator, batch) => {
        const key = batch.foodBank?.id || batch.foodBank?.name || 'unknown';

        if (!accumulator[key]) {
          accumulator[key] = {
            key,
            name: batch.foodBank?.name || 'Pickup hub',
            city: batch.foodBank?.address?.city || '',
            count: 0,
          };
        }

        accumulator[key].count += batch.orderCount || 0;
        return accumulator;
      }, {})
    )
      .sort((left, right) => right.count - left.count)
      .slice(0, 3);

    return {
      totalOrders,
      currentMonthEarnings,
      topLocationEntries,
    };
  }, [batches]);

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

        <section className="dashboard-panel mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow-gold">Seller Analytics</p>
              <h2 className="mt-3 font-display text-3xl text-brand-cream">
                Judge-ready ops snapshot
              </h2>
            </div>
            <Link href="/seller/orders" className="btn-orbit">
              Open fulfillment queue
            </Link>
          </div>

          {analyticsError ? <p className="mt-4 text-sm text-[#d7bc68]">{analyticsError}</p> : null}

          {isAnalyticsLoading ? (
            <div className="dashboard-empty-state mt-6">Loading analytics...</div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">Total orders</span>
                  <strong>{analytics.totalOrders}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">This month</span>
                  <strong>${analytics.currentMonthEarnings.toFixed(2)}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">Top hub</span>
                  <strong>{analytics.topLocationEntries[0]?.name || 'No hub yet'}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">Listings live</span>
                  <strong>{productCount}</strong>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="dashboard-summary-card">
                  <p className="eyebrow-gold">Top pickup locations</p>
                  <div className="mt-4 space-y-3">
                    {analytics.topLocationEntries.length ? (
                      analytics.topLocationEntries.map((location, index) => (
                        <div key={location.key} className="dashboard-summary-line">
                          <div>
                            <p className="font-semibold text-white">
                              {index + 1}. {location.name}
                            </p>
                            <p className="mt-1 text-sm text-[#f5e6c8]/70">{location.city || 'Local hub'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-brand-cream">{location.count}</p>
                            <p className="text-xs uppercase tracking-[0.22em] text-[#d7bc68]">orders</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="dashboard-empty-state">
                        No destination analytics yet. Once buyers place orders, top hubs will appear here.
                      </div>
                    )}
                  </div>
                </div>

                <div className="dashboard-summary-card">
                  <p className="eyebrow-gold">Current month earnings</p>
                  <div className="seller-earnings-meter mt-4">
                    <div
                      className="seller-earnings-meter__fill"
                      style={{
                        width: `${Math.min(
                          100,
                          analytics.currentMonthEarnings > 0
                            ? 22 + analytics.currentMonthEarnings * 4
                            : 8
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-4 text-4xl font-display text-brand-cream">
                    ${analytics.currentMonthEarnings.toFixed(2)}
                  </p>
                  <p className="mt-3 text-[#f5e6c8]/74">
                    This lightweight metric uses the current month&apos;s grouped buyer order totals so judges can see revenue movement at a glance.
                  </p>
                </div>
              </div>
            </>
          )}
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
