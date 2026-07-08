import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, placeNewOrder } from '../../store/orderSlice.js';
import { fetchProducts } from '../../store/productSlice.js';
import OrderItem from './OrderItem.jsx';

export default function OrderList() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.orders);
  const products = useSelector((s) => s.products.items);
  const user = useSelector((s) => s.auth.user);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const total = Object.entries(selected).reduce((sum, [id, qty]) => {
    const p = products.find((pr) => pr._id === id);
    return sum + (p ? p.price * Number(qty || 0) : 0);
  }, 0);

  const handlePlace = (e) => {
    e.preventDefault();
    const orderItems = Object.entries(selected)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const p = products.find((pr) => pr._id === productId);
        return { productId, name: p.name, quantity: Number(quantity), price: p.price };
      });
    if (orderItems.length === 0) return;
    dispatch(placeNewOrder({ userId: user?.id || user?._id, items: orderItems }));
    setSelected({});
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handlePlace} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Place an order</h3>
          <span className="text-sm text-slate-500">
            Cart total: <strong className="text-slate-900">${total.toLocaleString()}</strong>
          </span>
        </div>
        {products.length === 0 && <p className="text-sm text-slate-500">Add products first.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-sm font-bold flex items-center justify-center">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                <p className="text-xs text-slate-500">${Number(p.price).toLocaleString()}</p>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0"
                className="input w-20 text-center"
                value={selected[p._id] || ''}
                onChange={(e) => setSelected({ ...selected, [p._id]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn-primary mt-4" type="submit">Place Order</button>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && items.length === 0 && (
          <div className="card p-8 text-center text-sm text-slate-400">No orders yet.</div>
        )}
        {items.map((o) => <OrderItem key={o._id} order={o} />)}
      </div>
    </div>
  );
}
