import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import AppShell from '../src/components/AppShell';
import { useAuth } from '../src/context/AuthContext';
import { apiRequest, withAuth } from '../src/lib/api';

const DEMO_PRODUCTS = [
  {
    id: 'demo-cosmic-cherry-tomatoes',
    name: 'Cosmic Cherry Tomatoes',
    category: 'Organic Fruit',
    description: 'Sweet, juicy tomatoes grown under warm orbital rails and packed for food bank pickup.',
    images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    quantityAvailable: 28,
    minimumOrderQty: 1,
    price: 4.99,
    status: 'demo',
    farmName: 'Astro-Grown Farms',
    isDemo: true,
  },
  {
    id: 'demo-leafy-greens',
    name: 'Leafy Greens',
    category: 'Leafy Greens',
    description: 'Tender lettuce bundles and salad-ready greens from a low-waste hydroponic bay.',
    images: ['https://images.unsplash.com/photo-1515356956468-8733193425c6?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    quantityAvailable: 19,
    minimumOrderQty: 1,
    price: 4.99,
    status: 'demo',
    farmName: 'Orbit Leaf Collective',
    isDemo: true,
  },
  {
    id: 'demo-herb-mix',
    name: 'Herbs & Microgreens',
    category: 'Herbs',
    description: 'Bright basil, parsley, and microgreens for quick meals and pantry refreshes.',
    images: ['https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    quantityAvailable: 14,
    minimumOrderQty: 1,
    price: 4.99,
    status: 'demo',
    farmName: 'Comet Patch Farm',
    isDemo: true,
  },
  {
    id: 'demo-root-mix',
    name: 'Root Vegetable Mix',
    category: 'Root Vegetables',
    description: 'Carrots, radishes, and roots packed together for affordable family pickups.',
    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    quantityAvailable: 16,
    minimumOrderQty: 1,
    price: 5.49,
    status: 'demo',
    farmName: 'Harvest Dock Produce',
    isDemo: true,
  },
];

function filterDemoProducts(nextQuery = '') {
  const normalizedQuery = nextQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return DEMO_PRODUCTS;
  }

  return DEMO_PRODUCTS.filter((product) =>
    [product.name, product.category, product.description, product.farmName]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  );
}

function renderProduceGlyph(product) {
  const label = `${product.name} illustration`;
  const category = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (category.includes('herb') || name.includes('basil') || name.includes('sage')) {
    return (
      <svg viewBox="0 0 120 120" aria-label={label} role="img">
        <path d="M59 90V38" />
        <path d="M58 56c-16 0-26-8-26-20 14 1 24 7 26 20Z" />
        <path d="M59 70c17 0 27-8 27-22-15 2-24 9-27 22Z" />
        <path d="M59 80c-15 0-24-7-24-19 13 1 22 7 24 19Z" />
        <path d="M60 90c18 0 28-9 28-24-15 2-25 10-28 24Z" />
      </svg>
    );
  }

  if (category.includes('root') || name.includes('carrot') || name.includes('radish')) {
    return (
      <svg viewBox="0 0 120 120" aria-label={label} role="img">
        <path d="M67 28c8-4 16-4 24 1M59 28c-5-7-12-10-20-10M53 33c5-7 13-10 22-10" />
        <path d="M62 37c17 9 22 31 9 51-9 14-24 18-33 8-10-11-7-28 24-59Z" />
      </svg>
    );
  }

  if (category.includes('leaf') || name.includes('spinach') || name.includes('collard') || name.includes('lettuce') || name.includes('kale')) {
    return (
      <svg viewBox="0 0 120 120" aria-label={label} role="img">
        <path d="M60 90c-24-6-39-27-34-54 27 0 47 16 51 45" />
        <path d="M60 90c21-11 31-31 26-58-26 2-41 19-43 48" />
        <path d="M60 90V45" />
      </svg>
    );
  }

  if (category.includes('fruit') || name.includes('tomato')) {
    return (
      <svg viewBox="0 0 120 120" aria-label={label} role="img">
        <path d="M60 35c20 0 34 13 34 30S81 95 60 95 26 81 26 65s13-30 34-30Z" />
        <path d="M60 35c0-8 4-13 11-15M60 35c-6-7-13-10-22-8M60 35c8-5 17-6 26-1" />
        <path d="M60 48V82" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" aria-label={label} role="img">
      <path d="M37 83c0-26 15-47 23-47s23 21 23 47" />
      <path d="M28 83h64" />
      <path d="M60 36V20" />
    </svg>
  );
}

function getCategoryIcon(category) {
  const normalized = (category || '').toLowerCase();

  if (normalized === 'all') {
    return '✦';
  }

  if (normalized.includes('fruit') || normalized.includes('tomato')) {
    return '🍅';
  }

  if (normalized.includes('leaf')) {
    return '🥬';
  }

  if (normalized.includes('herb')) {
    return '🌿';
  }

  if (normalized.includes('root')) {
    return '🥕';
  }

  return '🧺';
}

export default function MarketplacePage() {
  const { isAuthenticated, token, user } = useAuth();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
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

    const resolved = labels.length ? labels : ['Organic Fruit', 'Leafy Greens', 'Herbs', 'Root Vegetables'];
    return ['All', ...resolved];
  }, [products]);

  const farms = useMemo(() => {
    const grouped = new Map();

    products.forEach((product) => {
      const farmName = product.farmName || 'HackDart Growers';
      const current = grouped.get(farmName) || {
        name: farmName,
        items: 0,
        category: product.category || 'Fresh produce',
      };

      current.items += 1;
      grouped.set(farmName, current);
    });

    return Array.from(grouped.values()).slice(0, 4);
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products;
    }

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  const loadProducts = async (nextQuery = '') => {
    setIsLoading(true);

    try {
      const suffix = nextQuery ? `?search=${encodeURIComponent(nextQuery)}` : '';
      const response = await apiRequest(`/products${suffix}`);
      const liveProducts = response.data.products || [];

      if (liveProducts.length === 0) {
        setProducts(filterDemoProducts(nextQuery));
        setMessage('Showing demo harvests while live seller inventory syncs.');
      } else {
        setProducts(liveProducts);
        setMessage('');
      }

      setHasLoadError(false);
    } catch (error) {
      setProducts(filterDemoProducts(nextQuery));
      setMessage(`${error.message} Showing demo harvests instead.`);
      setHasLoadError(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(query);
  }, [query]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [activeCategory, categories]);

  const submitSearch = (event) => {
    event.preventDefault();
    setQuery(search.trim());
  };

  const addToCart = async (productId) => {
    if (`${productId}`.startsWith('demo-')) {
      setMessage('These are demo harvests for the deployed preview. Add live products after a seller publishes inventory.');
      return;
    }

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

        <section className="market-orbit-frame">
          <div className="market-orbit-frame__stars" aria-hidden="true" />
          <div className="market-orbit-arches" aria-hidden="true" />

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

          <section className="market-chip-row" aria-label="Produce categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`market-chip ${activeCategory === category ? 'is-active' : ''}`}
              >
                <span className="market-chip__icon" aria-hidden="true">
                  {getCategoryIcon(category)}
                </span>
                <span>{category}</span>
              </button>
            ))}
          </section>

          {message ? (
            <p className="market-inline-message text-sm text-[#f5e6c8]/88">{message}</p>
          ) : null}

          <section className="market-console">
            <aside className="market-farm-rail">
              <div className="market-farm-rail__header">
                <div>
                  <p className="eyebrow-gold">Meet the farms</p>
                  <h2>{visibleProducts.length} items</h2>
                </div>
                <button type="button" className="market-clear-link" onClick={() => setActiveCategory('All')}>
                  Clear all
                </button>
              </div>

              <div className="market-farm-list">
                {farms.map((farm, index) => (
                  <article key={farm.name} className="market-farm-card">
                    <div className={`market-farm-card__art market-farm-card__art--${index % 4}`} aria-hidden="true" />
                    <div className="market-farm-card__body">
                      <h3>{farm.name}</h3>
                      <p>{farm.category}</p>
                      <span>{farm.items} listing{farm.items === 1 ? '' : 's'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>

            <div className="market-products-pane">
              {isLoading ? (
                <div className="market-empty">Loading marketplace...</div>
              ) : hasLoadError ? null : visibleProducts.length === 0 ? (
                <div className="market-empty">No products matched this search yet.</div>
              ) : (
                <div className="market-product-grid">
                  {visibleProducts.map((product) => (
                    <article key={product.id} className="market-product-card">
                      <div className="market-product-card__copy">
                        <div className="market-product-card__head">
                          <div>
                            <h2>{product.name}</h2>
                            <p>{product.farmName || 'HackDart Growers'}</p>
                          </div>
                          <span className="market-status-pill">{product.status}</span>
                        </div>

                        <div className="market-product-card__meta">
                          <span>{product.minimumOrderQty} {product.unit}</span>
                          <span>{product.category}</span>
                        </div>

                        <div className="market-product-card__price">
                          <strong>${product.price.toFixed(2)}</strong>
                          <span>${(product.price * 1.35).toFixed(2)} wash</span>
                        </div>

                        <p className="market-product-card__description">{product.description}</p>

                        <div className="market-product-card__footer">
                          <button
                            type="button"
                            className="btn-market-ghost"
                            onClick={() => addToCart(product.id)}
                          >
                            Add to cart
                          </button>
                          <span className="market-product-card__stock">
                            {product.quantityAvailable} in bay
                          </span>
                        </div>
                      </div>

                      <div className="market-product-card__art">
                        <div className="market-product-card__art-photo">
                          <img
                            src={product.images?.[0] || 'https://placehold.co/800x600?text=Produce'}
                            alt=""
                          />
                        </div>
                        <div className="market-product-card__glyph" aria-hidden="true">
                          {renderProduceGlyph(product)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </section>
    </AppShell>
  );
}
