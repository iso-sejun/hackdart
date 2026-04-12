import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';
import { readMockOrders } from '../../src/lib/mockCheckout';

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
        setOrders([...readMockOrders(), ...response.data.orders]);
      } catch (error) {
        const mockOrders = readMockOrders();
        setOrders(mockOrders);
        setMessage(
          mockOrders.length
            ? `${error.message} Showing locally simulated checkout orders instead.`
            : error.message
        );
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
        description="Live orders appear here from the backend, and demo checkouts are stored locally so the buyer journey stays testable during the hackathon."
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
                      <p className="text-sm uppercase tracking-[0.2em] text-[#f5e6c8]/68">{group.status}</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        ${group.total.toFixed(2)}
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
                </article>
              ))
            )}
          </div>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
