import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import AppShell from '../src/components/AppShell';
import AuthCard from '../src/components/AuthCard';
import { useAuth } from '../src/context/AuthContext';

const roles = [
  { id: 'buyer', label: 'Buyer' },
  { id: 'seller', label: 'Seller' },
];

const buyerInitialState = {
  email: '',
  password: '',
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  pickupRadiusMiles: 5,
};

const sellerInitialState = {
  email: '',
  password: '',
  farmName: '',
  contactName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  foodSafetyAttested: false,
};

export default function RegisterPage() {
  const router = useRouter();
  const { registerBuyer, registerSeller, isAuthenticated, isLoading, user } = useAuth();
  const [role, setRole] = useState('buyer');
  const [buyerForm, setBuyerForm] = useState(buyerInitialState);
  const [sellerForm, setSellerForm] = useState(sellerInitialState);
  const [error, setError] = useState('');

  const helperText = useMemo(
    () =>
      role === 'seller'
        ? 'Create a seller account to list produce and manage future food bank batches.'
        : 'Create a buyer account to access affordable produce pickup routes near you.',
    [role]
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
  }, [isAuthenticated, router, user]);

  const activeForm = role === 'seller' ? sellerForm : buyerForm;

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    if (role === 'seller') {
      setSellerForm((current) => ({ ...current, [name]: nextValue }));
      return;
    }

    setBuyerForm((current) => ({ ...current, [name]: nextValue }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (role === 'seller') {
        const user = await registerSeller({
          email: sellerForm.email,
          password: sellerForm.password,
          farmName: sellerForm.farmName,
          contactName: sellerForm.contactName,
          phone: sellerForm.phone,
          farmAddress: {
            line1: sellerForm.addressLine1,
            line2: '',
            city: sellerForm.city,
            state: sellerForm.state,
            postalCode: sellerForm.postalCode,
            country: sellerForm.country,
          },
          foodSafetyAttested: sellerForm.foodSafetyAttested,
          foodSafetyTermsVersion: 'v1',
        });

        router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
        return;
      }

      const user = await registerBuyer({
        email: buyerForm.email,
        password: buyerForm.password,
        fullName: buyerForm.fullName,
        phone: buyerForm.phone,
        address: {
          line1: buyerForm.addressLine1,
          line2: '',
          city: buyerForm.city,
          state: buyerForm.state,
          postalCode: buyerForm.postalCode,
          country: buyerForm.country,
        },
        pickupRadiusMiles: Number(buyerForm.pickupRadiusMiles),
        eligibilityMode: 'self_attested',
      });

      router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  };

  return (
    <AppShell compact>
      <AuthCard
        eyebrow="Board The Ship"
        title="Create the first account layers for buyers and growers."
        description={helperText}
        footerText="Already have access?"
        footerHref="/login"
        footerLabel="Login"
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
          <div className="grid gap-4 sm:grid-cols-2">
            {role === 'seller' ? (
              <>
                <label className="field sm:col-span-2">
                  <span>Farm name</span>
                  <input name="farmName" value={activeForm.farmName} onChange={updateForm} required />
                </label>
                <label className="field sm:col-span-2">
                  <span>Contact name</span>
                  <input
                    name="contactName"
                    value={activeForm.contactName}
                    onChange={updateForm}
                    required
                  />
                </label>
              </>
            ) : (
              <label className="field sm:col-span-2">
                <span>Full name</span>
                <input name="fullName" value={activeForm.fullName} onChange={updateForm} required />
              </label>
            )}

            <label className="field sm:col-span-2">
              <span>Email</span>
              <input name="email" type="email" value={activeForm.email} onChange={updateForm} required />
            </label>

            <label className="field sm:col-span-2">
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={activeForm.password}
                onChange={updateForm}
                minLength={8}
                required
              />
            </label>

            <label className="field sm:col-span-2">
              <span>Phone</span>
              <input name="phone" value={activeForm.phone} onChange={updateForm} required />
            </label>

            <label className="field sm:col-span-2">
              <span>{role === 'seller' ? 'Farm address' : 'Home address'}</span>
              <input
                name="addressLine1"
                value={activeForm.addressLine1}
                onChange={updateForm}
                required
              />
            </label>

            <label className="field">
              <span>City</span>
              <input name="city" value={activeForm.city} onChange={updateForm} required />
            </label>

            <label className="field">
              <span>State</span>
              <input name="state" value={activeForm.state} onChange={updateForm} required />
            </label>

            <label className="field">
              <span>Postal code</span>
              <input name="postalCode" value={activeForm.postalCode} onChange={updateForm} required />
            </label>

            <label className="field">
              <span>Country</span>
              <input name="country" value={activeForm.country} onChange={updateForm} required />
            </label>

            {role === 'buyer' ? (
              <label className="field sm:col-span-2">
                <span>Pickup radius (miles)</span>
                <input
                  name="pickupRadiusMiles"
                  type="number"
                  min="1"
                  max="25"
                  value={activeForm.pickupRadiusMiles}
                  onChange={updateForm}
                  required
                />
              </label>
            ) : (
              <label className="flex items-start gap-3 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-slate-200 sm:col-span-2">
                <input
                  className="mt-1 h-4 w-4 accent-emerald-300"
                  name="foodSafetyAttested"
                  type="checkbox"
                  checked={activeForm.foodSafetyAttested}
                  onChange={updateForm}
                  required
                />
                <span>
                  I confirm that my farm follows applicable food safety regulations and I agree to
                  the seller terms for this platform.
                </span>
              </label>
            )}
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : `Create ${role} account`}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Public mission pages will plug in next. For now, this foundation focuses on the app
          shell, auth flow, and role-safe routing.
        </p>
        <p className="mt-2 text-center text-sm text-slate-400">
          <Link href="/" className="text-emerald-200 transition hover:text-white">
            Back to home
          </Link>
        </p>
      </AuthCard>
    </AppShell>
  );
}
