import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

function formatStatus(status) {
  return status.replaceAll('_', ' ');
}

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

  const totalSpend = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );
  const readyOrders = useMemo(
    () => orders.filter((order) => order.status === 'ready_for_pickup'),
    [orders]
  );

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        variant="buyer"
        roleLabel="Buyer Dashboard"
        title="Your pickup routes start here."
        description="Chart the next pickup, revisit the greenhouse marketplace, and monitor every order from the command bridge."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
          { href: '/checkout', label: 'Checkout' },
          { href: '/buyer/orders', label: 'Orders' },
        ]}
      >
        <section className="dashboard-hero-card dashboard-hero-card--buyer">
          <div className="dashboard-hero-card__copy">
            <p className="eyebrow-gold">Command Overview</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream sm:text-5xl">
              Keep affordable harvests on schedule.
            </h2>
            <p className="mt-4 max-w-2xl text-[#f5e6c8]/76">
              Your bridge view keeps the next pickup radius, live order count, and marketplace route one tap away.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/marketplace" className="btn-gold">
                Browse greenhouse
              </Link>
              <Link href="/buyer/orders" className="btn-orbit">
                View all orders
              </Link>
            </div>
          </div>

          <div className="dashboard-hero-card__stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Pickup radius</span>
              <strong>{profile?.pickupRadiusMiles || 5} mi</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Orders tracked</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Ready now</span>
              <strong>{readyOrders.length}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Recent spend</span>
              <strong>${totalSpend.toFixed(2)}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-panel mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow-gold">Pickup Status</p>
              <h3 className="mt-3 font-display text-3xl text-brand-cream">Food bank handoff tracker</h3>
            </div>
            <Link href="/buyer/orders" className="btn-orbit">
              Open full order view
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="dashboard-summary-card">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d7bc68]">Current state</p>
              {readyOrders.length ? (
                <>
                  <h4 className="mt-3 text-2xl font-semibold text-[#84e3b2]">Ready for pickup</h4>
                  <p className="mt-3 text-[#f5e6c8]/78">
                    Your latest completed batch is waiting at{' '}
                    <span className="text-white">{readyOrders[0].foodBank?.name}</span>.
                  </p>
                  <p className="mt-2 text-sm text-[#f5e6c8]/68">
                    {readyOrders[0].foodBank?.address?.line1}, {readyOrders[0].foodBank?.address?.city},{' '}
                    {readyOrders[0].foodBank?.address?.state} {readyOrders[0].foodBank?.address?.postalCode}
                  </p>
                </>
              ) : (
                <>
                  <h4 className="mt-3 text-2xl font-semibold text-white">Awaiting food bank handoff</h4>
                  <p className="mt-3 text-[#f5e6c8]/78">
                    Orders move from confirmed to shipped, then appear here once the food bank marks them ready.
                  </p>
                </>
              )}
            </div>

            <div className="dashboard-summary-card">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d7bc68]">Status ladder</p>
              <div className="mt-4 space-y-3">
                {[
                  ['confirmed', 'Seller has accepted the order and is preparing the batch.'],
                  ['shipped', 'The batch is on the way to the selected food bank.'],
                  ['ready for pickup', 'The food bank has the order and you can head there.'],
                ].map(([label, body]) => (
                  <div key={label} className="dashboard-summary-line">
                    <div>
                      <p className="font-semibold capitalize text-white">{label}</p>
                      <p className="mt-1 text-sm text-[#f5e6c8]/70">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid mt-6">
          <section className="dashboard-panel">
            <p className="eyebrow-gold">Account</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{profile?.fullName || 'Buyer'}</h3>
            <p className="mt-3 text-[#f5e6c8]/72">
              Default hub radius: <span className="text-[#d7bc68]">{profile?.pickupRadiusMiles || 5} miles</span>
            </p>
            <p className="mt-2 text-[#f5e6c8]/72">
              Eligibility: <span className="text-[#d7bc68]">{profile?.eligibilityStatus || 'approved'}</span>
            </p>
          </section>

          <section className="dashboard-panel">
            <p className="eyebrow-gold">Quick Routes</p>
            <div className="mt-4 grid gap-3">
              <Link href="/checkout" className="dashboard-action-card">
                <span className="dashboard-action-card__title">Choose pickup hub</span>
                <span className="dashboard-action-card__body">Launch the docking flow and lock in a food bank handoff.</span>
              </Link>
              <Link href="/cart" className="dashboard-action-card">
                <span className="dashboard-action-card__title">Review cargo</span>
                <span className="dashboard-action-card__body">Adjust quantities before you move into payment.</span>
              </Link>
            </div>
          </section>
        </div>

        <section className="dashboard-panel mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow-gold">Recent Orders</p>
              <h3 className="mt-3 font-display text-3xl text-brand-cream">Latest pickup orbits</h3>
            </div>
            <Link href="/buyer/orders" className="btn-orbit">
              Full manifest
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {orders.length ? (
              orders.map((order) => (
                <article key={order.orderGroupId} className="dashboard-order-card">
                  <div>
                    <p className="eyebrow-gold">{order.orderNumber}</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">{order.foodBank?.name}</h4>
                    <p className="mt-2 text-sm text-[#f5e6c8]/70">{formatStatus(order.status)}</p>
                    {order.status === 'ready_for_pickup' ? (
                      <p className="mt-2 text-sm text-[#84e3b2]">
                        Ready at {order.foodBank?.address?.line1}, {order.foodBank?.address?.city}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-brand-cream">${order.total.toFixed(2)}</p>
                    <p className="mt-2 text-sm text-[#f5e6c8]/68">
                      {order.foodBank?.address?.city}, {order.foodBank?.address?.state}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="dashboard-empty-state">
                No completed checkouts yet. Once Stripe finishes, your orders will appear here.
              </div>
            )}
          </div>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
