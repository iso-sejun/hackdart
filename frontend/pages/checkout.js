import { useEffect, useMemo, useState } from 'react';

import ProtectedPage from '../src/components/ProtectedPage';
import DashboardShell from '../src/components/DashboardShell';
import { useAuth } from '../src/context/AuthContext';
import { apiRequest, withAuth } from '../src/lib/api';

export default function CheckoutPage() {
  const { profile, token } = useAuth();
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  const [radiusMiles, setRadiusMiles] = useState(5);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [selectedFoodBankId, setSelectedFoodBankId] = useState('');
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setAddress({
      line1: profile.defaultAddress?.line1 || '',
      city: profile.defaultAddress?.city || '',
      state: profile.defaultAddress?.state || '',
      postalCode: profile.defaultAddress?.postalCode || '',
      country: profile.defaultAddress?.country || 'US',
    });
    setRadiusMiles(profile.pickupRadiusMiles || 5);
  }, [profile]);

  const selectedPickupOption = useMemo(
    () => pickupOptions.find((option) => option.id === selectedFoodBankId) || null,
    [pickupOptions, selectedFoodBankId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const lookupPickupOptions = async (event) => {
    event.preventDefault();
    setMessage('');
    setSummary(null);
    setIsLookingUp(true);

    try {
      const response = await apiRequest(
        '/pickup/lookup',
        withAuth(token, {
          method: 'POST',
          body: {
            address,
            radiusMiles: Number(radiusMiles),
          },
        })
      );

      setPickupOptions(response.data.pickupOptions);
      setSelectedFoodBankId(response.data.pickupOptions[0]?.id || '');
      setMessage(
        response.data.pickupOptions.length
          ? 'Nearby pickup hubs loaded.'
          : 'No food banks were found in that radius.'
      );
    } catch (error) {
      setPickupOptions([]);
      setSelectedFoodBankId('');
      setMessage(error.message);
    } finally {
      setIsLookingUp(false);
    }
  };

  const validateOrder = async () => {
    if (!selectedFoodBankId) {
      setMessage('Choose a pickup hub before reviewing totals.');
      return;
    }

    setIsValidating(true);
    setMessage('');

    try {
      const response = await apiRequest(
        '/checkout/validate',
        withAuth(token, {
          method: 'POST',
          body: {
            foodBankId: selectedFoodBankId,
            pickupAddress: address,
          },
        })
      );

      setSummary(response.data);
      setMessage('Checkout totals are live and ready for payment.');
    } catch (error) {
      setSummary(null);
      setMessage(error.message);
    } finally {
      setIsValidating(false);
    }
  };

  const startPayment = async () => {
    if (!selectedFoodBankId) {
      setMessage('Choose a pickup hub before continuing to payment.');
      return;
    }

    setIsRedirecting(true);
    setMessage('');

    try {
      const origin = window.location.origin;
      const response = await apiRequest(
        '/checkout/session',
        withAuth(token, {
          method: 'POST',
          body: {
            foodBankId: selectedFoodBankId,
            pickupAddress: address,
            successUrl: `${origin}/checkout/success?session=success`,
            cancelUrl: `${origin}/checkout`,
          },
        })
      );

      window.location.assign(response.data.checkoutUrl);
    } catch (error) {
      setMessage(error.message);
      setIsRedirecting(false);
    }
  };

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        variant="checkout"
        roleLabel="Checkout Setup"
        title="Choose a pickup hub."
        description="Review your address, select a nearby food bank, and lock pricing before launching into Stripe checkout."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
          { href: '/buyer/orders', label: 'Orders' },
        ]}
      >
        <section className="dashboard-hero-card dashboard-hero-card--checkout">
          <div className="dashboard-hero-card__copy">
            <p className="eyebrow-gold">Docking Sequence</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream sm:text-5xl">
              Route every order to the right pickup bay.
            </h2>
            <p className="mt-4 max-w-2xl text-[#f5e6c8]/76">
              First select a nearby food bank, then review live inventory totals before opening Stripe Checkout.
            </p>
          </div>
          <div className="dashboard-hero-card__stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Radius</span>
              <strong>{Number(radiusMiles) || 5} mi</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Pickup hubs</span>
              <strong>{pickupOptions.length}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Order total</span>
              <strong>${summary?.total?.toFixed(2) || '0.00'}</strong>
            </div>
          </div>
        </section>

        <div className="dashboard-grid mt-6">
          <section className="dashboard-panel">
            <p className="eyebrow-gold">Select Pickup</p>
            <h2 className="mt-3 font-display text-3xl text-brand-cream">Search nearby food banks</h2>
            <p className="mt-3 text-[#f5e6c8]/72">
              Demo addresses supported right now: Hanover NH 03755, Lebanon NH 03766, White River
              Junction VT 05001, and Woodstock VT 05091.
            </p>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={lookupPickupOptions}>
              <label className="field sm:col-span-2">
                <span>Address</span>
                <input name="line1" value={address.line1} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>City</span>
                <input name="city" value={address.city} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>State</span>
                <input name="state" value={address.state} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>Postal code</span>
                <input name="postalCode" value={address.postalCode} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>Country</span>
                <input name="country" value={address.country} onChange={handleChange} required />
              </label>
              <label className="field sm:col-span-2">
                <span>Radius (miles)</span>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={radiusMiles}
                  onChange={(event) => setRadiusMiles(event.target.value)}
                  required
                />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-gold" disabled={isLookingUp}>
                  {isLookingUp ? 'Looking up...' : 'Find pickup hubs'}
                </button>
              </div>
            </form>
          </section>

          <section className="dashboard-panel">
            <p className="eyebrow-gold">Nearby Options</p>
            <h2 className="mt-3 font-display text-3xl text-brand-cream">Pickup selector</h2>
            {message ? <p className="mt-4 text-sm text-[#d7bc68]">{message}</p> : null}

            <div className="mt-6 space-y-4">
              {pickupOptions.length === 0 ? (
                <p className="text-[#f5e6c8]/72">
                  Lookup nearby food banks to choose a pickup destination for the order.
                </p>
              ) : (
                pickupOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`dashboard-option-card ${
                      selectedFoodBankId === option.id
                        ? 'dashboard-option-card--active'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="foodBank"
                        className="mt-1 h-4 w-4 accent-[#c9a84c]"
                        checked={selectedFoodBankId === option.id}
                        onChange={() => {
                          setSelectedFoodBankId(option.id);
                          setSummary(null);
                        }}
                      />
                      <div>
                        <p className="text-lg font-semibold text-white">{option.name}</p>
                        <p className="mt-1 text-sm text-[#f5e6c8]/72">
                          {option.address.line1}, {option.address.city}, {option.address.state}{' '}
                          {option.address.postalCode}
                        </p>
                        <p className="mt-2 text-sm text-[#f5e6c8]/72">Hours: {option.hours}</p>
                        <p className="mt-1 text-sm text-[#f5e6c8]/72">Contact: {option.contactName}</p>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </section>

          <section className="dashboard-panel">
            <p className="eyebrow-gold">Review Order</p>
            <h2 className="mt-3 font-display text-3xl text-brand-cream">Live checkout summary</h2>
            <p className="mt-3 text-[#f5e6c8]/72">
              Recalculate with current inventory before starting Stripe Checkout.
            </p>

            {summary ? (
              <div className="mt-6 space-y-4">
                <div className="dashboard-summary-card">
                  <p className="text-sm uppercase tracking-[0.28em] text-[#d7bc68]">
                    Pickup hub
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {selectedPickupOption?.name || summary.foodBank?.name}
                  </p>
                  <p className="mt-1 text-sm text-[#f5e6c8]/72">
                    {selectedPickupOption
                      ? `${selectedPickupOption.address.line1}, ${selectedPickupOption.address.city}, ${selectedPickupOption.address.state} ${selectedPickupOption.address.postalCode}`
                      : ''}
                  </p>
                </div>

                <div className="space-y-3">
                  {summary.items.map((item) => (
                    <div
                      key={item.productId}
                      className="dashboard-summary-line"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-[#f5e6c8]/72">
                          {item.quantity} x ${item.unitPrice.toFixed(2)} per {item.unit}
                        </p>
                      </div>
                      <p className="text-white">${item.lineTotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="dashboard-summary-card">
                  <div className="flex items-center justify-between text-[#f5e6c8]/72">
                    <span>Subtotal</span>
                    <span className="text-white">${summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[#f5e6c8]/72">
                    <span>Fees</span>
                    <span className="text-white">${summary.fees.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold text-white">
                    <span>Total</span>
                    <span>${summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-[#f5e6c8]/72">
                Select a food bank, then review the order to confirm inventory and current pricing.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn-orbit" onClick={validateOrder} disabled={isValidating}>
                {isValidating ? 'Reviewing...' : 'Review totals'}
              </button>
              <button type="button" className="btn-gold" onClick={startPayment} disabled={isRedirecting}>
                {isRedirecting ? 'Redirecting...' : 'Continue to payment'}
              </button>
            </div>
          </section>
        </div>
      </DashboardShell>
    </ProtectedPage>
  );
}
