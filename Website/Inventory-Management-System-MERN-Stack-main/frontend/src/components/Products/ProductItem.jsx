import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '../../store/productSlice.js';

export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin');

  return (
    <li className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/60 transition">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center shrink-0">
          {product.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
          <p className="text-xs text-slate-500">
            <span className="badge bg-slate-100 text-slate-600 mr-2">{product.category}</span>
            {product.description && <span className="truncate">{product.description}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-base font-extrabold text-slate-900 tabular-nums">
          ${Number(product.price).toLocaleString()}
        </span>
        {isAdmin && (
          <button onClick={() => dispatch(removeProduct(product._id))} className="btn-danger">
            Delete
          </button>
        )}
      </div>
    </li>
  );
}
