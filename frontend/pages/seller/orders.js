import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

export default function SellerOrdersPage() {
  const { token } = useAuth();
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadBatches = async () => {
      setIsLoading(true);

      try {
        const response = await apiRequest('/sellers/me/batches', withAuth(token));
        setBatches(response.data.batches);
      } catch (error) {
        setBatches([]);
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBatches();
  }, [token]);

  return (
    <ProtectedPage roles={['seller']}>
      <DashboardShell
        variant="seller"
        roleLabel="Seller Orders"
        title="Batches grouped by food bank."
        description="Confirmed orders are bundled automatically by food bank so you can ship one combined manifest per destination."
        navItems={[
          { href: '/seller/dashboard', label: 'Dashboard' },
          { href: '/seller/products', label: 'Products' },
        ]}
      >
        <section className="dashboard-hero-card dashboard-hero-card--seller">
          <div className="dashboard-hero-card__copy">
            <p className="eyebrow-gold">Fulfillment Queue</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream sm:text-5xl">
              Pack by hub, not by household.
            </h2>
            <p className="mt-4 max-w-2xl text-[#f5e6c8]/76">
              Every confirmed order is grouped by food bank so you can ship one combined produce manifest and let the hub split individual pickups.
            </p>
          </div>
          <div className="dashboard-hero-card__stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Batches</span>
              <strong>{batches.length}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-card__label">Ready to ship</span>
              <strong>{batches.filter((batch) => batch.status === 'ready_to_ship').length}</strong>
            </div>
          </div>
        </section>

        {message ? <p className="mt-6 text-sm text-[#d7bc68]">{message}</p> : null}

        <section className="dashboard-panel mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow-gold">Grouped Orders</p>
              <h3 className="mt-3 font-display text-3xl text-brand-cream">Food bank destinations</h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="dashboard-empty-state">Loading batches...</div>
            ) : batches.length === 0 ? (
              <div className="dashboard-empty-state">
                No fulfillment batches yet. Once buyers complete checkout and orders are confirmed, grouped batches will appear here.
              </div>
            ) : (
              batches.map((batch) => (
                <article key={batch.id} className="dashboard-order-card">
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow-gold">{batch.foodBank?.name || 'Food bank'}</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">{batch.orderCount} household orders</h4>
                    <p className="mt-2 text-sm text-[#f5e6c8]/72">
                      {batch.aggregatedItems
                        .map((item) => `${item.totalQuantity} ${item.unit} ${item.productNameSnapshot}`)
                        .join(' • ')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="market-status-pill">{batch.status.replaceAll('_', ' ')}</span>
                    <Link href={`/seller/orders/batches/${batch.id}`} className="btn-gold">
                      View batch
                    </Link>
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
