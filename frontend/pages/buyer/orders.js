import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

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
        roleLabel="Buyer Orders"
        title="Track every pickup orbit."
        description="Confirmed checkouts appear here after Stripe completes and the webhook locks the order into the system."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/cart', label: 'Cart' },
          { href: '/checkout', label: 'Checkout' },
        ]}
      >
        {message ? <p className="mb-4 text-sm text-emerald-200">{message}</p> : null}
        <section className="panel-glow">
          <p className="eyebrow">Order History</p>
          <h2 className="mt-2 font-display text-3xl text-white">Recent orders</h2>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <p className="text-slate-300">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-slate-300">
                No orders yet. Once checkout completes, they will appear here automatically.
              </p>
            ) : (
              orders.map((group) => (
                <article key={group.orderGroupId} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-emerald-200">
                        {group.orderNumber}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {group.foodBank?.name || 'Pickup hub pending'}
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {group.foodBank?.address?.line1}, {group.foodBank?.address?.city},{' '}
                        {group.foodBank?.address?.state} {group.foodBank?.address?.postalCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{group.status}</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        ${group.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {group.orders.map((order) => (
                      <div key={order.orderId} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                        {order.items.map((item) => (
                          <div
                            key={`${order.orderId}-${item.productId}`}
                            className="flex items-center justify-between gap-3 py-1 text-sm"
                          >
                            <span className="text-slate-200">
                              {item.quantity} x {item.productName}
                            </span>
                            <span className="text-white">${item.lineTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ))}
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
