import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct } from '../../store/productSlice.js';
import ProductItem from './ProductItem.jsx';

export default function ProductList() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.products);
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin');
  const [form, setForm] = useState({ name: '', category: '', price: '', description: '' });

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addProduct({ ...form, price: Number(form.price) }));
    setForm({ name: '', category: '', price: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {isAdmin ? (
        <form onSubmit={handleAdd} className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Add a new product</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="input" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" placeholder="Category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <input className="input" type="number" step="0.01" placeholder="Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input" placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button type="submit" className="btn-primary">+ Add Product</button>
          </div>
        </form>
      ) : (
        <div className="card p-3 px-4 text-xs text-slate-500 flex items-center gap-2">
          <span>🔒</span> Read-only catalog. Only admins can add or remove products.
        </div>
      )}

      <div className="card overflow-hidden">
        {loading && <p className="p-5 text-sm text-slate-500">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No products yet.</p>
        )}
        <ul className="divide-y divide-slate-100">
          {items.map((p) => <ProductItem key={p._id} product={p} />)}
        </ul>
      </div>
    </div>
  );
}
