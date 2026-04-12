import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';
import { readMockOrders } from '../../src/lib/mockCheckout';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('Waiting for payment confirmation...');

  useEffect(() => {
    if (router.query.mock === '1') {
      const mockOrders = readMockOrders();
      const matched =
        mockOrders.find((order) => order.orderGroupId === router.query.order) || mockOrders[0];

      setOrders(matched ? [matched] : []);
      setMessage('Demo payment complete. Your mock order is now in the pickup queue.');
      return;
    }

    if (!token) {
      return;
    }

    let attempts = 0;

    const pollOrders = async () => {
      try {
        const response = await apiRequest('/buyers/me/orders', withAuth(token));
        setOrders(response.data.orders);

        if (response.data.orders.length > 0) {
          setMessage('Payment confirmed. Your latest order is ready in the queue.');
          return;
        }
      } catch (error) {
        setMessage(error.message);
        return;
      }

      attempts += 1;

      if (attempts < 6) {
        window.setTimeout(pollOrders, 2500);
      } else {
        setMessage('Payment submitted. If the order list is still empty, refresh in a moment.');
      }
    };

    pollOrders();
  }, [token, router.query.mock, router.query.order]);

  const latestOrder = orders[0];

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        variant="checkout"
        roleLabel="Checkout Success"
        title="Your pickup request is in orbit."
        description="Your checkout completed. In demo mode, the order is stored locally so you can keep testing the buyer flow."
        navItems={[
          { href: '/buyer/orders', label: 'Orders' },
          { href: '/marketplace', label: 'Marketplace' },
        ]}
      >
        <section className="dashboard-panel">
          <p className="eyebrow-gold">Payment Status</p>
          <h2 className="mt-3 font-display text-3xl text-brand-cream">{message}</h2>

          {latestOrder ? (
            <div className="dashboard-summary-card mt-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#d7bc68]">
                {latestOrder.orderNumber}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">{latestOrder.foodBank?.name}</p>
              <p className="mt-2 text-[#f5e6c8]/72">
                Total charged: ${latestOrder.total.toFixed(2)}
              </p>
              <p className="mt-1 text-[#f5e6c8]/72">Status: {latestOrder.status}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/buyer/orders" className="btn-gold">
              View orders
            </Link>
            <Link href="/marketplace" className="btn-orbit">
              Return to marketplace
            </Link>
          </div>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
