import Link from 'next/link';

import { useAuth } from '../context/AuthContext';

function getRoomMeta(variant) {
  if (variant === 'seller') {
    return {
      label: 'Cargo Hold',
      description: 'Inventory shelves, shipment crates, and fulfillment controls.',
    };
  }

  if (variant === 'checkout') {
    return {
      label: 'Docking Bay',
      description: 'Pickup routing, order review, and payment launch sequence.',
    };
  }

  return {
    label: 'Cockpit',
    description: 'Buyer controls, route summaries, and pickup telemetry.',
  };
}

export default function DashboardShell({
  roleLabel,
  title,
  description,
  children,
  navItems = [],
  variant = 'buyer',
}) {
  const { logout, user } = useAuth();
  const roomMeta = getRoomMeta(variant);

  return (
    <main className={`dashboard-room dashboard-room--${variant}`}>
      <div className={`dashboard-room-art dashboard-room-art--${variant}`} aria-hidden="true" />
      <div className="dashboard-room-overlay" aria-hidden="true" />

      <div className="relative z-[1] mx-auto max-w-7xl px-6 py-8">
        <header className="market-nav-shell dashboard-shell-header">
          <div className="min-w-0">
            <p className="eyebrow-gold">{roleLabel}</p>
            <h1 className="mt-3 font-display text-4xl text-brand-cream sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-[#f5e6c8]/78">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#f5e6c8]/80">
            <Link href="/" className="nav-link nav-link-gold">
              Home
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link nav-link-gold">
                {item.label}
              </Link>
            ))}
            <button type="button" className="btn-orbit" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-room-strip">
          <div className="dashboard-room-strip__lights" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className="dashboard-room-strip__content">
            <div>
              <p className="eyebrow-gold">{roomMeta.label}</p>
              <p className="mt-2 text-sm leading-6 text-[#f5e6c8]/74">{roomMeta.description}</p>
            </div>

            <div className="dashboard-user-badge">
              <span>Signed in as {user?.email}</span>
              <span className="dashboard-user-badge__role">{user?.role}</span>
            </div>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
