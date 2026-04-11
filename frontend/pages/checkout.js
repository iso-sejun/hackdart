import { useEffect, useState } from 'react';

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
  const [message, setMessage] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const lookupPickupOptions = async (event) => {
    event.preventDefault();
    setMessage('');
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

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        roleLabel="Checkout Setup"
        title="Choose a pickup hub."
        description="Enter your address and preferred radius to find nearby food banks for the order handoff."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
        ]}
      >
        <div className="dashboard-grid">
          <section className="panel-glow">
            <p className="eyebrow">Select Pickup</p>
            <h2 className="mt-2 font-display text-3xl text-white">Search nearby food banks</h2>
            <p className="mt-3 text-slate-300">
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
                <button type="submit" className="btn-primary" disabled={isLookingUp}>
                  {isLookingUp ? 'Looking up...' : 'Find pickup hubs'}
                </button>
              </div>
            </form>
          </section>

          <section className="panel-glow">
            <p className="eyebrow">Nearby Options</p>
            <h2 className="mt-2 font-display text-3xl text-white">Pickup selector</h2>
            {message ? <p className="mt-4 text-sm text-emerald-200">{message}</p> : null}

            <div className="mt-6 space-y-4">
              {pickupOptions.length === 0 ? (
                <p className="text-slate-300">
                  Lookup nearby food banks to choose a pickup destination for the order.
                </p>
              ) : (
                pickupOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`block rounded-3xl border p-4 transition ${
                      selectedFoodBankId === option.id
                        ? 'border-emerald-300/45 bg-emerald-300/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="foodBank"
                        className="mt-1 h-4 w-4 accent-emerald-300"
                        checked={selectedFoodBankId === option.id}
                        onChange={() => setSelectedFoodBankId(option.id)}
                      />
                      <div>
                        <p className="text-lg font-semibold text-white">{option.name}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {option.address.line1}, {option.address.city}, {option.address.state}{' '}
                          {option.address.postalCode}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">Hours: {option.hours}</p>
                        <p className="mt-1 text-sm text-slate-300">Contact: {option.contactName}</p>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </section>
        </div>
      </DashboardShell>
    </ProtectedPage>
  );
}
