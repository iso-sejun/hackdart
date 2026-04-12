import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

export default function BuyerDashboardPage() {
  const { profile, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await apiRequest('/buyers/me/orders', withAuth(token));
        setOrders(response.data.orders.slice(0, 3));
      } catch (_error) {
        setOrders([]);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        roleLabel="Buyer Dashboard"
        title="Your pickup routes start here."
        description="Track live checkout progress, revisit the marketplace, and keep every pickup route in one cockpit."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
          { href: '/checkout', label: 'Checkout' },
          { href: '/buyer/orders', label: 'Orders' },
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
            <p className="eyebrow">Recent Orders</p>
            <p className="mt-3 text-slate-300">
              {orders.length
                ? 'Your most recent checkout groups are ready to track.'
                : 'No completed checkouts yet. Once Stripe finishes, your orders will appear here.'}
            </p>
            <div className="mt-5 space-y-3">
              {orders.map((order) => (
                <div key={order.orderGroupId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">
                    {order.orderNumber}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="text-white">{order.foodBank?.name}</span>
                    <span className="text-slate-300">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DashboardShell>
    </ProtectedPage>
  );
}
