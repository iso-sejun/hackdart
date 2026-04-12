import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import AppShell from '../src/components/AppShell';
import { useAuth } from '../src/context/AuthContext';
import { apiRequest, withAuth } from '../src/lib/api';

export default function MarketplacePage() {
  const { isAuthenticated, token, user } = useAuth();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const cartHref = useMemo(
    () => (isAuthenticated && user?.role === 'buyer' ? '/cart' : '/login'),
    [isAuthenticated, user]
  );
  const categories = useMemo(() => {
    const labels = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ).slice(0, 6);

    return labels.length ? labels : ['Organic Fruit', 'Leafy Greens', 'Herbs', 'Root Vegetables'];
  }, [products]);

  const loadProducts = async (nextQuery = '') => {
    setIsLoading(true);

    try {
      const suffix = nextQuery ? `?search=${encodeURIComponent(nextQuery)}` : '';
      const response = await apiRequest(`/products${suffix}`);
      setProducts(response.data.products);
      setHasLoadError(false);
    } catch (error) {
      setMessage(error.message);
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(query);
  }, [query]);

  const submitSearch = (event) => {
    event.preventDefault();
    setQuery(search.trim());
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated || user?.role !== 'buyer') {
      setMessage('Login as a buyer to add items to your cart.');
      return;
    }

    try {
      await apiRequest(
        '/cart/items',
        withAuth(token, {
          method: 'POST',
          body: {
            productId,
            quantity: 1,
          },
        })
      );

      setMessage('Added to cart.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <AppShell variant="marketplace">
      <section className="space-y-8 pb-10">
        <div className="market-header-row flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow-gold">Rocket &gt; Greenhouse</p>
            <h1 className="market-title mt-2 font-display">Marketplace</h1>
            <p className="mt-3 max-w-2xl text-[#f5e6c8]/72">
              Browse hydroponic produce from orbit, compare inventory, and send affordable harvests
              into your pickup route.
            </p>
          </div>
          <Link href={cartHref} className="btn-orbit">
            {isAuthenticated && user?.role === 'buyer' ? 'Open cart' : 'Buyer login'}
          </Link>
        </div>

        <section className="greenhouse-hero">
          <div className="greenhouse-hero__lights" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="greenhouse-hero__window" />
          <div className="greenhouse-hero__copy">
            <p className="eyebrow-gold">Welcome</p>
            <h2 className="font-display text-4xl text-brand-gold sm:text-5xl">
              Welcome to the Green House!
            </h2>
            <p className="mt-3 max-w-xl text-[#f5e6c8]/78">
              Explore produce pods, organic bays, and crop decks lit by warm grow rails and a starfield viewport.
            </p>
          </div>
          <div className="greenhouse-hero__plants greenhouse-hero__plants--left" />
          <div className="greenhouse-hero__plants greenhouse-hero__plants--right" />
        </section>

        <form className="market-search-shell flex flex-col gap-4 md:flex-row" onSubmit={submitSearch}>
          <div className="market-search-input">
            <span className="market-search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Search apples, carrots, greens..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button type="submit" className="btn-gold md:min-w-[180px]">
            Search produce
          </button>
        </form>

        <section className="market-category-row" aria-label="Produce categories">
          {categories.map((category, index) => (
            <div key={category} className="market-category-pill">
              <div className="market-category-pill__icon" aria-hidden="true">
                {['🍅', '🥬', '🌿', '🥕', '🍄', '🪴'][index % 6]}
              </div>
              <span>{category}</span>
            </div>
          ))}
        </section>

        {message ? <p className="text-sm text-[#f5e6c8]/88">{message}</p> : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            <div className="market-empty sm:col-span-2 xl:col-span-4">Loading marketplace...</div>
          ) : hasLoadError ? (
            <div className="market-empty sm:col-span-2 xl:col-span-4">
              The marketplace could not load because the API is unavailable.
            </div>
          ) : products.length === 0 ? (
            <div className="market-empty sm:col-span-2 xl:col-span-4">
              No products matched this search yet.
            </div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="market-product-card flex h-full flex-col">
                <div className="aspect-[4/3] overflow-hidden rounded-[0.8rem] border border-[#c9a84c]/60 bg-[#182758]">
                  <img
                    src={product.images?.[0] || 'https://placehold.co/800x600?text=Produce'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-[1.4rem] leading-tight text-brand-cream">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[#c9a84c]/90">
                        {product.category}
                      </p>
                    </div>
                    <span className="market-status-pill">
                      {product.status}
                    </span>
                  </div>

                  <p className="mt-2 text-[0.75rem] text-[#f5e6c8]/60">Astro-grown farms</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#f5e6c8]/76">
                    {product.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-[0.76rem] text-[#f5e6c8]/68">
                    <p>Unit: {product.unit}</p>
                    <p>Stock: {product.quantityAvailable}</p>
                    <p>Minimum: {product.minimumOrderQty}</p>
                    <p>Category: {product.category}</p>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[1.15rem] font-semibold text-brand-cream">
                        ${product.price.toFixed(2)}
                        <span className="ml-1 text-[0.76rem] font-normal text-[#f5e6c8]/58">
                          / {product.unit}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-market-ghost"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </AppShell>
  );
}
