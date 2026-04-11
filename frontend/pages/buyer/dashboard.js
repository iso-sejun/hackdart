import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';

export default function BuyerDashboardPage() {
  const { profile } = useAuth();

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        roleLabel="Buyer Dashboard"
        title="Your pickup routes start here."
        description="This Phase 1 shell confirms buyers can authenticate, stay in session, and land on the correct side of the app."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
          { href: '/checkout', label: 'Checkout' },
        ]}
      >
        <div className="dashboard-grid">
          <section className="panel-glow">
            <p className="eyebrow">Account</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{profile?.fullName || 'Buyer'}</h3>
            <p className="mt-3 text-slate-300">
              Pickup radius: <span className="text-emerald-200">{profile?.pickupRadiusMiles || 5} miles</span>
            </p>
          </section>

          <section className="panel-glow">
            <p className="eyebrow">Shopping Flow</p>
            <p className="mt-3 text-slate-300">
              Browse produce, build a cart, and choose a nearby pickup hub.
            </p>
          </section>
        </div>
      </DashboardShell>
    </ProtectedPage>
  );
}
