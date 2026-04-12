import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import AppShell from '../src/components/AppShell';
import AuthCard from '../src/components/AuthCard';
import { useAuth } from '../src/context/AuthContext';

const roles = [
  {
    id: 'seller',
    label: 'Pilot',
    sublabel: 'Seller',
    title: "I'm a Pilot, seller.",
    description: 'List surplus produce, manage your ship manifest, and route harvests toward local pickup hubs.',
    icon: 'farmer',
  },
  {
    id: 'buyer',
    label: 'Passenger',
    sublabel: 'Buyer',
    title: "I'm a Passenger, buyer.",
    description: 'Browse affordable produce, choose a nearby pickup hub, and track your orders through the route.',
    icon: 'buyer',
  },
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
  const [hasChosenRole, setHasChosenRole] = useState(false);
  const [buyerForm, setBuyerForm] = useState(buyerInitialState);
  const [sellerForm, setSellerForm] = useState(sellerInitialState);
  const [error, setError] = useState('');
  const dashboardHref =
    user?.role === 'seller' ? '/seller/dashboard' : user?.role === 'buyer' ? '/buyer/dashboard' : null;

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
        const nextUser = await registerSeller({
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

        router.replace(nextUser.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
        return;
      }

      const nextUser = await registerBuyer({
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

      router.replace(nextUser.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  };

  return (
    <AppShell compact variant="register" showHeader={false}>
      <header className="market-nav-shell auth-page-header mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl tracking-[0.08em] text-brand-gold">
          HACKDART
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-[#f5e6c8]/80">
          <Link className="nav-link nav-link-gold" href="/">
            Home
          </Link>
          <Link className="nav-link nav-link-gold" href="/marketplace">
            Marketplace
          </Link>
          <Link className="nav-link nav-link-gold" href="/login">
            Login
          </Link>
          <Link className="nav-link nav-link-gold" href="/register">
            Register
          </Link>
          {isAuthenticated && dashboardHref ? (
            <Link className="nav-link nav-link-gold" href={dashboardHref}>
              Dashboard
            </Link>
          ) : null}
        </nav>
      </header>
      <AuthCard
        eyebrow={hasChosenRole ? 'Board The Ship' : 'Choose Your Role'}
        title={
          hasChosenRole ? 'Create the first account layers for buyers and growers.' : 'Join as a Pilot or Passenger'
        }
        description={
          hasChosenRole
            ? helperText
            : 'Choose whether you are joining HackDart as a seller moving harvests through the route or a buyer picking up produce nearby.'
        }
        footerText="Already have access?"
        footerHref="/login"
        footerLabel="Login"
        variant="login"
      >
        {hasChosenRole ? (
          <>
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
                  <label className="flex items-start gap-3 rounded-3xl border border-[#c9a84c]/20 bg-[#c9a84c]/10 p-4 text-sm text-[#f5e6c8] sm:col-span-2">
                    <input
                      className="mt-1 h-4 w-4 accent-[#c9a84c]"
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

              {error ? <p className="text-sm text-[#f7c8c8]">{error}</p> : null}

              <button type="submit" className="btn-gold w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : `Create ${role} account`}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-[#f5e6c8]/60">
              <button
                type="button"
                onClick={() => setHasChosenRole(false)}
                className="text-brand-gold transition hover:text-brand-cream"
              >
                Change role selection
              </button>
            </p>
          </>
        ) : (
          <div className="register-role-step">
            <div className="register-role-grid">
              {roles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`register-role-card ${role === item.id ? 'is-selected' : ''}`}
                >
                  <span className="register-role-card__check" aria-hidden="true" />
                  <span className={`register-role-card__icon register-role-card__icon--${item.icon}`} aria-hidden="true">
                    {item.icon === 'farmer' ? (
                      <svg viewBox="0 0 120 120" role="presentation">
                        <path d="M34 29c5-10 18-16 26-16s21 6 26 16" />
                        <path d="M28 35c8-7 24-11 32-11s24 4 32 11" />
                        <path d="M40 38c4 5 12 8 20 8s16-3 20-8" />
                        <circle cx="60" cy="49" r="11" />
                        <path d="M49 63h22v22H49z" />
                        <path d="M42 100V76c0-13 8-21 18-21s18 8 18 21v24" />
                        <path d="M27 95V79c0-10-6-18-15-22" />
                        <path d="M93 95V79c0-10 6-18 15-22" />
                        <path d="M12 84c10 0 18 8 18 18v5H12z" />
                        <path d="M90 102c0-10 8-18 18-18v23H90z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 120 120" role="presentation">
                        <circle cx="31" cy="27" r="12" />
                        <path d="M39 24c4 0 8 4 8 8s-4 8-8 8" />
                        <path d="M23 41L14 58l14 7 8-15" />
                        <path d="M37 40l12 9 16-2" />
                        <path d="M40 48l-4 23" />
                        <path d="M51 59l7 20" />
                        <path d="M66 45h27l9 10v14H63V55z" />
                        <path d="M71 45v-7M83 45v-7M95 45v-7" />
                        <path d="M63 58h39" />
                        <circle cx="77" cy="78" r="8" />
                        <circle cx="99" cy="78" r="8" />
                      </svg>
                    )}
                  </span>
                  <span className="register-role-card__eyebrow">
                    {item.label} <span>{item.sublabel}</span>
                  </span>
                  <span className="register-role-card__title">{item.title}</span>
                  <span className="register-role-card__body">{item.description}</span>
                </button>
              ))}
            </div>

            <button type="button" className="btn-gold w-full mt-8" onClick={() => setHasChosenRole(true)}>
              Create account
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-[#f5e6c8]/60">
          <Link href="/" className="text-brand-gold transition hover:text-brand-cream">
            Back to home
          </Link>
        </p>
      </AuthCard>
    </AppShell>
  );
}
