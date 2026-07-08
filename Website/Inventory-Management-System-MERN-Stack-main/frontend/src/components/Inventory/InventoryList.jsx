import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, addInventoryItem } from '../../store/inventorySlice.js';
import { fetchProducts } from '../../store/productSlice.js';
import InventoryItem from './InventoryItem.jsx';

export default function InventoryList() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.inventory);
  const products = useSelector((s) => s.products.items);
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin');
  const [form, setForm] = useState({ productId: '', quantity: '', location: 'main-warehouse' });

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    const product = products.find((p) => p._id === form.productId);
    if (!product) return;
    dispatch(addInventoryItem({
      productId: form.productId,
      productName: product.name,
      quantity: Number(form.quantity),
      location: form.location,
    }));
    setForm({ productId: '', quantity: '', location: 'main-warehouse' });
  };

  return (
    <div className="space-y-6">
      {isAdmin ? (
        <form onSubmit={handleAdd} className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Add inventory record</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select className="input" value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })} required>
              <option value="">Select product…</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input className="input" type="number" min="0" placeholder="Quantity"
              value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            <input className="input" placeholder="Location"
              value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <button className="btn-primary">+ Add Inventory</button>
          </div>
        </form>
      ) : (
        <div className="card p-3 px-4 text-xs text-slate-500 flex items-center gap-2">
          <span>🔒</span> Read-only stock view. Only admins can add or adjust inventory.
        </div>
      )}

      <div className="card overflow-hidden">
        {loading && <p className="p-5 text-sm text-slate-500">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No inventory records.</p>
        )}
        <ul className="divide-y divide-slate-100">
          {items.map((it) => <InventoryItem key={it._id} item={it} />)}
        </ul>
      </div>
    </div>
  );
}
