import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ProtectedPage from '../../../../src/components/ProtectedPage';
import DashboardShell from '../../../../src/components/DashboardShell';
import { useAuth } from '../../../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../../../src/lib/api';
import { withDisplayFoodBank } from '../../../../src/lib/foodBankDisplay';

const DEMO_FOOD_BANK_EMAIL = 'unboxingvidskim@gmail.com';

export default function SellerBatchDetailPage() {
  const router = useRouter();
  const { batchId } = router.query;
  const { token } = useAuth();
  const [batch, setBatch] = useState(null);
  const [message, setMessage] = useState('');
  const [emailMeta, setEmailMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShipping, setIsShipping] = useState(false);

  const loadBatch = async () => {
    if (!token || !batchId) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest(`/sellers/me/batches/${batchId}`, withAuth(token));
      setBatch({
        ...response.data,
        foodBank: withDisplayFoodBank(response.data.foodBank),
      });
      setEmailMeta(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBatch();
  }, [token, batchId]);

  const markShipped = async () => {
    setIsShipping(true);
    setMessage('');

    try {
      const response = await apiRequest(
        `/sellers/me/batches/${batchId}/mark-shipped`,
        withAuth(token, {
          method: 'POST',
        })
      );

      setBatch({
        ...response.data.batch,
        foodBank: withDisplayFoodBank(response.data.batch.foodBank),
      });
      setEmailMeta(response.data.email || null);
      setMessage(
        response.data.email?.usedJsonTransport
          ? `Batch marked shipped. SMTP is not configured on the backend, so use the prefilled email link below to send the manifest to ${response.data.email?.recipient || 'the demo inbox'}.`
          : `Batch marked shipped and manifest email sent to ${response.data.email?.recipient || 'the food bank'}.`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsShipping(false);
    }
  };

  return (
    <ProtectedPage roles={['seller']}>
      <DashboardShell
        variant="seller"
        roleLabel="Batch Detail"
        title="Inspect one shipment manifest."
        description="Review combined produce totals, the household packing breakdown, and send the food bank manifest once the shipment leaves your farm."
        navItems={[
          { href: '/seller/dashboard', label: 'Dashboard' },
          { href: '/seller/orders', label: 'Orders' },
          { href: '/seller/products', label: 'Products' },
        ]}
      >
        {message ? <p className="mb-6 text-sm text-[#d7bc68]">{message}</p> : null}
        {emailMeta?.usedJsonTransport && emailMeta?.manualSendUrl ? (
          <div className="mb-6 flex flex-wrap gap-3">
            <a href={emailMeta.manualSendUrl} className="btn-gold">
              Send manifest with email app
            </a>
            <span className="self-center text-sm text-[#f5e6c8]/72">
              Recipient: {emailMeta.recipient}
            </span>
          </div>
        ) : null}

        {isLoading ? (
          <section className="dashboard-panel">
            <div className="dashboard-empty-state">Loading batch...</div>
          </section>
        ) : !batch ? (
          <section className="dashboard-panel">
            <div className="dashboard-empty-state">This batch could not be loaded.</div>
          </section>
        ) : (
          <>
            <section className="dashboard-hero-card dashboard-hero-card--seller">
              <div className="dashboard-hero-card__copy">
                <p className="eyebrow-gold">{batch.foodBank?.name || 'Food bank'}</p>
                <h2 className="mt-3 font-display text-4xl text-brand-cream sm:text-5xl">
                  Shipment batch {String(batch.id).slice(-6).toUpperCase()}
                </h2>
                <p className="mt-4 max-w-2xl text-[#f5e6c8]/76">
                  Contact {batch.foodBank?.contactName || 'food bank staff'} at {DEMO_FOOD_BANK_EMAIL} once this produce leaves your dock.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {batch.status === 'ready_to_ship' ? (
                    <button type="button" className="btn-gold" onClick={markShipped} disabled={isShipping}>
                      {isShipping ? 'Sending manifest...' : 'Mark shipped'}
                    </button>
                  ) : null}
                  <Link href="/seller/orders" className="btn-orbit">
                    Back to orders
                  </Link>
                </div>
              </div>
              <div className="dashboard-hero-card__stats">
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">Status</span>
                  <strong>{batch.status.replaceAll('_', ' ')}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">Households</span>
                  <strong>{batch.orderCount}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-card__label">Destination</span>
                  <strong>{batch.foodBank?.address?.city || 'Pickup hub'}</strong>
                </div>
              </div>
            </section>

            <div className="dashboard-grid mt-6">
              <section className="dashboard-panel">
                <p className="eyebrow-gold">Combined Shipment</p>
                <div className="mt-4 space-y-3">
                  {batch.aggregatedItems.map((item) => (
                    <div key={`${item.productId}-${item.unit}`} className="dashboard-summary-line">
                      <span className="text-white">{item.productNameSnapshot}</span>
                      <span className="text-[#f5e6c8]/72">
                        {item.totalQuantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dashboard-panel">
                <p className="eyebrow-gold">Food Bank Contact</p>
                <div className="mt-4 text-[#f5e6c8]/76">
                  <p className="text-lg font-semibold text-white">{batch.foodBank?.name}</p>
                  <p className="mt-2">{DEMO_FOOD_BANK_EMAIL}</p>
                  <p className="mt-2">
                    {batch.foodBank?.address?.line1}, {batch.foodBank?.address?.city},{' '}
                    {batch.foodBank?.address?.state} {batch.foodBank?.address?.postalCode}
                  </p>
                </div>
              </section>
            </div>

            <section className="dashboard-panel mt-6">
              <p className="eyebrow-gold">Pack by Buyer</p>
              <h3 className="mt-3 font-display text-3xl text-brand-cream">Household breakdown</h3>

              <div className="mt-6 space-y-4">
                {batch.orders.map((order) => (
                  <article key={order.id} className="dashboard-order-card">
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow-gold">{order.orderNumber || 'Order'}</p>
                      <h4 className="mt-2 text-xl font-semibold text-white">{order.buyerName}</h4>
                      <div className="mt-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.productId}`} className="text-sm text-[#f5e6c8]/74">
                            {item.productNameSnapshot}: {item.quantity} {item.unit}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-brand-cream">${order.buyerTotal.toFixed(2)}</p>
                      <p className="mt-2 text-sm text-[#f5e6c8]/68">{order.status}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </DashboardShell>
    </ProtectedPage>
  );
}
