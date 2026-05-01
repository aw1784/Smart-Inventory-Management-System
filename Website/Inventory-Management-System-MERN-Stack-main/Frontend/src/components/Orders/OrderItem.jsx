import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeOrderStatus } from '../../store/orderSlice.js';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

const STATUS_BADGE = {
  pending:   'bg-amber-100  text-amber-700',
  paid:      'bg-emerald-100 text-emerald-700',
  shipped:   'bg-blue-100   text-blue-700',
  delivered: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-rose-100   text-rose-700',
};

export default function OrderItem({ order }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin');

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="font-mono text-[11px] text-slate-400">#{order._id}</p>
          <p className="text-xs text-slate-500">
            {order.createdAt && new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${STATUS_BADGE[order.status] || 'bg-slate-100 text-slate-600'}`}>
            {order.status}
          </span>
          <span className="text-lg font-extrabold tabular-nums text-slate-900">
            ${Number(order.totalAmount).toLocaleString()}
          </span>
        </div>
      </div>
      <ul className="text-sm text-slate-600 space-y-1 mb-3">
        {order.items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span>{it.name} <span className="text-slate-400">× {it.quantity}</span></span>
            <span className="tabular-nums">${(it.price * it.quantity).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {isAdmin ? (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <label className="text-xs text-slate-500">Update status:</label>
          <select
            value={order.status}
            onChange={(e) => dispatch(changeOrderStatus({ id: order._id, status: e.target.value }))}
            className="input w-auto py-1.5 text-sm"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ) : (
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          🔒 Only admins can update order status.
        </div>
      )}
    </div>
  );
}
