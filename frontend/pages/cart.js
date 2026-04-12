import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import ProtectedPage from '../src/components/ProtectedPage';
import DashboardShell from '../src/components/DashboardShell';
import { useAuth } from '../src/context/AuthContext';
import { apiRequest, withAuth } from '../src/lib/api';

export default function CartPage() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const itemCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [cart]
  );

  const loadCart = async () => {
    setIsLoading(true);

    try {
      const response = await apiRequest('/cart', withAuth(token));
      setCart(response.data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    loadCart();
  }, [token]);

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      const response = await apiRequest(
        `/cart/items/${cartItemId}`,
        withAuth(token, {
          method: 'PATCH',
          body: { quantity },
        })
      );

      setCart(response.data);
      setMessage('Cart updated.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await apiRequest(
        `/cart/items/${cartItemId}`,
        withAuth(token, {
          method: 'DELETE',
        })
      );

      setCart(response.data);
      setMessage('Item removed from cart.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <ProtectedPage roles={['buyer']}>
      <DashboardShell
        roleLabel="Buyer Cart"
        title="Review your pickup order."
        description="Adjust quantities here, then move into pickup selection at checkout."
        navItems={[
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/buyer/dashboard', label: 'Dashboard' },
        ]}
      >
        {message ? <p className="mb-4 text-sm text-emerald-200">{message}</p> : null}
        <div className="dashboard-grid">
          <section className="panel-glow">
            <p className="eyebrow">Cart Items</p>
            <h2 className="mt-2 font-display text-3xl text-white">{itemCount} items in orbit</h2>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <p className="text-slate-300">Loading cart...</p>
              ) : !cart?.items?.length ? (
                <div className="space-y-4">
                  <p className="text-slate-300">Your cart is empty. Start in the marketplace.</p>
                  <Link href="/marketplace" className="btn-gold">
                    Browse produce
                  </Link>
                </div>
              ) : (
                cart.items.map((item) => (
                  <article
                    key={item.cartItemId}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                          <p className="mt-1 text-sm text-slate-300">
                            ${item.unitPrice.toFixed(2)} per {item.unit}
                          </p>
                        </div>
                      </div>

                      <p className="text-lg font-semibold text-emerald-200">
                        ${item.lineTotal.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => removeItem(item.cartItemId)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="panel-glow">
            <p className="eyebrow">Summary</p>
            <h2 className="mt-2 font-display text-3xl text-white">Ready for pickup selection</h2>
            <p className="mt-4 text-slate-300">
              The next step uses your address and radius to surface nearby food banks.
            </p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="text-white">${(cart?.subtotal || 0).toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-gold mt-6 w-full">
              Select pickup
            </Link>
          </section>
        </div>
      </DashboardShell>
    </ProtectedPage>
  );
}
