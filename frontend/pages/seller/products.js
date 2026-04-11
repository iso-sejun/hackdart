import { useEffect, useMemo, useState } from 'react';

import ProtectedPage from '../../src/components/ProtectedPage';
import DashboardShell from '../../src/components/DashboardShell';
import { useAuth } from '../../src/context/AuthContext';
import { apiRequest, withAuth } from '../../src/lib/api';

const initialForm = {
  id: null,
  name: '',
  description: '',
  category: 'produce',
  imageUrl: '',
  unit: 'lb',
  price: '',
  quantityAvailable: '',
  minimumOrderQty: 1,
  status: 'active',
};

export default function SellerProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadProducts = async () => {
    setIsLoading(true);

    try {
      const response = await apiRequest('/sellers/me/products', withAuth(token));
      setProducts(response.data.products);
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

    loadProducts();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      images: [form.imageUrl],
      unit: form.unit,
      price: Number(form.price),
      quantityAvailable: Number(form.quantityAvailable),
      minimumOrderQty: Number(form.minimumOrderQty),
      status: form.status,
    };

    try {
      await apiRequest(
        isEditing ? `/sellers/me/products/${form.id}` : '/sellers/me/products',
        withAuth(token, {
          method: isEditing ? 'PATCH' : 'POST',
          body: payload,
        })
      );

      await loadProducts();
      resetForm();
      setMessage(isEditing ? 'Product updated.' : 'Product created.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.images?.[0] || '',
      unit: product.unit,
      price: product.price,
      quantityAvailable: product.quantityAvailable,
      minimumOrderQty: product.minimumOrderQty || 1,
      status: product.status,
    });
    setMessage('');
  };

  const handleDelete = async (productId) => {
    setMessage('');

    try {
      await apiRequest(
        `/sellers/me/products/${productId}`,
        withAuth(token, {
          method: 'DELETE',
        })
      );

      if (form.id === productId) {
        resetForm();
      }

      await loadProducts();
      setMessage('Product removed.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <ProtectedPage roles={['seller']}>
      <DashboardShell
        roleLabel="Seller Products"
        title="Build your produce catalog."
        description="Create, update, and remove marketplace inventory from a single seller workspace."
        navItems={[{ href: '/seller/dashboard', label: 'Dashboard' }]}
      >
        <div className="dashboard-grid">
          <section className="panel-glow">
            <p className="eyebrow">{isEditing ? 'Edit Produce' : 'New Produce'}</p>
            <h2 className="mt-2 font-display text-3xl text-white">
              {isEditing ? 'Update a listing' : 'Create a listing'}
            </h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="field">
                <span>Product name</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-300/10"
                  required
                />
              </label>

              <label className="field">
                <span>Image URL</span>
                <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} required />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field">
                  <span>Category</span>
                  <input name="category" value={form.category} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Unit</span>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-300/10"
                  >
                    <option value="lb">lb</option>
                    <option value="bunch">bunch</option>
                    <option value="item">item</option>
                    <option value="basket">basket</option>
                  </select>
                </label>
                <label className="field">
                  <span>Price</span>
                  <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Quantity available</span>
                  <input
                    name="quantityAvailable"
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantityAvailable}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Minimum order qty</span>
                  <input
                    name="minimumOrderQty"
                    type="number"
                    min="1"
                    step="1"
                    value={form.minimumOrderQty}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-300/10"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="archived">archived</option>
                    <option value="sold_out">sold_out</option>
                  </select>
                </label>
              </div>

              {message ? <p className="text-sm text-emerald-200">{message}</p> : null}

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : isEditing ? 'Update product' : 'Create product'}
                </button>
                {isEditing ? (
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="panel-glow">
            <p className="eyebrow">Catalog</p>
            <h2 className="mt-2 font-display text-3xl text-white">Current listings</h2>
            <p className="mt-3 text-slate-300">
              These records are now marketplace-ready and stored in MongoDB through seller-owned APIs.
            </p>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <p className="text-slate-300">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-slate-300">No products yet. Create your first listing to populate the marketplace.</p>
              ) : (
                products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{product.name}</p>
                        <p className="mt-1 text-sm text-slate-300">{product.description}</p>
                      </div>
                      <span className="rounded-full border border-emerald-300/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                        {product.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                      <p>Price: ${product.price.toFixed(2)}</p>
                      <p>Quantity: {product.quantityAvailable}</p>
                      <p>Unit: {product.unit}</p>
                      <p>Category: {product.category}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button type="button" className="btn-secondary" onClick={() => startEdit(product)}>
                        Edit
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => handleDelete(product.id)}>
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </DashboardShell>
    </ProtectedPage>
  );
}
