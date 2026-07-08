import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adjustInventoryItem, removeInventoryItem } from '../../store/inventorySlice.js';

export default function InventoryItem({ item }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin');
  const isLow = item.quantity <= (item.lowStockThreshold ?? 5);

  return (
    <li className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/60 transition">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
          isLow ? 'bg-gradient-to-br from-rose-500 to-orange-500' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
        }`}>
          {item.productName?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{item.productName}</h3>
          <p className="text-xs text-slate-500">
            <span className="badge bg-slate-100 text-slate-600 mr-2">{item.location}</span>
            Qty: <strong className="text-slate-900">{item.quantity}</strong>
            {isLow && <span className="ml-2 badge bg-rose-100 text-rose-700">LOW STOCK</span>}
          </p>
        </div>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => dispatch(adjustInventoryItem({ id: item._id, delta: 1 }))}
            className="rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 text-sm"
          >
            +1
          </button>
          <button
            onClick={() => dispatch(adjustInventoryItem({ id: item._id, delta: -1 }))}
            className="rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold px-3 py-1.5 text-sm"
          >
            −1
          </button>
          <button
            onClick={() => dispatch(removeInventoryItem(item._id))}
            className="btn-danger"
          >
            Remove
          </button>
        </div>
      )}
    </li>
  );
}
