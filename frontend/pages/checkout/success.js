import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

export default function CheckoutSuccessPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('Waiting for payment confirmation...');

  useEffect(() => {
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
  }, [token]);

  const latestOrder = orders[0];

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        roleLabel="Checkout Success"
        title="Your pickup request is in orbit."
        description="Stripe returned successfully. We are waiting for the webhook to stamp the order into your dashboard."
        navItems={[
          { href: '/buyer/orders', label: 'Orders' },
          { href: '/marketplace', label: 'Marketplace' },
        ]}
      >
        <section className="panel-glow">
          <p className="eyebrow">Payment Status</p>
          <h2 className="mt-2 font-display text-3xl text-white">{message}</h2>

          {latestOrder ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">
                {latestOrder.orderNumber}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">{latestOrder.foodBank?.name}</p>
              <p className="mt-2 text-slate-300">
                Total charged: ${latestOrder.total.toFixed(2)}
              </p>
              <p className="mt-1 text-slate-300">Status: {latestOrder.status}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/buyer/orders" className="btn-primary">
              View orders
            </Link>
            <Link href="/marketplace" className="btn-secondary">
              Return to marketplace
            </Link>
          </div>
        </section>
      </DashboardShell>
    </ProtectedPage>
  );
}
