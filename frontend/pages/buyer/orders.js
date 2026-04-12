import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

function formatStatus(status) {
  return status.replaceAll('_', ' ');
}

function getStatusCopy(group) {
  if (group.status === 'ready_for_pickup') {
    return `Ready for pickup at ${group.foodBank?.name || 'your selected food bank'}.`;
  }

  if (group.status === 'shipped') {
    return `Shipped to ${group.foodBank?.name || 'the pickup hub'}. The food bank can now mark it ready.`;
  }

  return 'Confirmed and queued for shipment to your selected pickup hub.';
}

export default function BuyerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);

      try {
        const response = await apiRequest('/buyers/me/orders', withAuth(token));
        setOrders(response.data.orders);
      } catch (error) {
        setOrders([]);
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        variant="buyer"
        roleLabel="Buyer Orders"
        title="Track every pickup orbit."
        description="Orders shown here come directly from the shared backend so buyer and seller views stay in sync."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
          { href: '/checkout', label: 'Checkout' },
        ]}
      >
        {message ? <p className="mb-4 text-sm text-[#d7bc68]">{message}</p> : null}
        <section className="dashboard-panel">
          <p className="eyebrow-gold">Order History</p>
          <h2 className="mt-3 font-display text-3xl text-brand-cream">Recent orders</h2>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <p className="text-[#f5e6c8]/72">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-[#f5e6c8]/72">
                No orders yet. Once checkout completes, they will appear here automatically.
              </p>
            ) : (
              orders.map((group) => (
                <article key={group.orderGroupId} className="dashboard-order-card">
                  <div className="w-full">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.26em] text-[#d7bc68]">
                          {group.orderNumber}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                          {group.foodBank?.name || 'Pickup hub pending'}
                        </h3>
                        <p className="mt-1 text-sm text-[#f5e6c8]/72">
                          {group.foodBank?.address?.line1}, {group.foodBank?.address?.city},{' '}
                          {group.foodBank?.address?.state} {group.foodBank?.address?.postalCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#f5e6c8]/68">
                          {formatStatus(group.status)}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          ${group.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-5 rounded-[1.2rem] border px-4 py-3 text-sm ${
                        group.status === 'ready_for_pickup'
                          ? 'border-[#84e3b2]/35 bg-[#84e3b2]/10 text-[#d9ffe8]'
                          : group.status === 'shipped'
                            ? 'border-[#d7bc68]/30 bg-[#d7bc68]/10 text-[#f5e6c8]'
                            : 'border-white/10 bg-white/5 text-[#f5e6c8]/78'
                      }`}
                    >
                      <p className="font-semibold uppercase tracking-[0.22em] text-[#d7bc68]">
                        {group.status === 'ready_for_pickup'
                          ? 'Pickup Ready'
                          : group.status === 'shipped'
                            ? 'In Transit'
                            : 'Confirmed'}
                      </p>
                      <p className="mt-2 leading-7">{getStatusCopy(group)}</p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="dashboard-summary-card">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#d7bc68]">Confirmed</p>
                        <p className={`mt-2 ${group.status ? 'text-white' : 'text-[#f5e6c8]/45'}`}>
                          {group.createdAt ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                      <div className="dashboard-summary-card">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#d7bc68]">Shipped</p>
                        <p
                          className={`mt-2 ${
                            ['shipped', 'ready_for_pickup', 'picked_up'].includes(group.status)
                              ? 'text-white'
                              : 'text-[#f5e6c8]/45'
                          }`}
                        >
                          {['shipped', 'ready_for_pickup', 'picked_up'].includes(group.status)
                            ? 'Completed'
                            : 'Awaiting seller'}
                        </p>
                      </div>
                      <div className="dashboard-summary-card">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#d7bc68]">Ready for pickup</p>
                        <p
                          className={`mt-2 ${
                            group.status === 'ready_for_pickup' || group.status === 'picked_up'
                              ? 'text-[#84e3b2]'
                              : 'text-[#f5e6c8]/45'
                          }`}
                        >
                          {group.status === 'ready_for_pickup' || group.status === 'picked_up'
                            ? group.foodBank?.name || 'Ready'
                            : 'Not yet'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {group.orders.map((order) => (
                        <div key={order.orderId} className="dashboard-summary-card">
                          {order.items.map((item) => (
                            <div
                              key={`${order.orderId}-${item.productId}`}
                              className="flex items-center justify-between gap-3 py-1 text-sm"
                            >
                              <span className="text-[#f5e6c8]/82">
                                {item.quantity} x {item.productName}
                              </span>
                              <span className="text-white">${item.lineTotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
