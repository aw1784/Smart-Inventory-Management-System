import React from 'react';
import { useSelector } from 'react-redux';

const KPI_META = {
  products:       { label: 'Products',        icon: '📦', color: 'from-indigo-500 to-violet-500' },
  orders:         { label: 'Orders',          icon: '🧾', color: 'from-amber-500 to-rose-500' },
  revenue:        { label: 'Revenue',         icon: '💰', color: 'from-emerald-500 to-teal-500', money: true },
  users:          { label: 'Users',           icon: '👥', color: 'from-sky-500 to-cyan-500' },
  inventoryItems: { label: 'Inventory Items', icon: '🏷️', color: 'from-fuchsia-500 to-pink-500' },
  totalStock:     { label: 'Total Stock',     icon: '📊', color: 'from-slate-700 to-slate-900' },
};

const ORDER = ['products', 'orders', 'revenue', 'users', 'inventoryItems', 'totalStock'];

export default function StatsSummary() {
  const { summary, loading } = useSelector((s) => s.statistics);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {ORDER.map((key) => {
        const meta = KPI_META[key];
        const value = summary?.[key] ?? 0;
        return (
          <div key={key} className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                {meta.label}
              </span>
              <div className={`kpi-icon bg-gradient-to-br ${meta.color}`}>{meta.icon}</div>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-slate-900 tabular-nums">
              {meta.money ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {loading ? 'Refreshing…' : 'Live from microservices'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
