import React from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export default function InventoryStats() {
  const stats = useSelector((s) => s.statistics.inventoryStats);
  const data = Object.entries(stats?.byLocation || {}).map(([location, qty]) => ({
    location, qty,
  }));

  return (
    <div className="card p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900">Inventory by location</h3>
          <p className="text-xs text-slate-500">
            {stats?.items ?? 0} SKUs · {stats?.totalStock ?? 0} total units
          </p>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-slate-400">
          No inventory yet — add some on the Inventory page.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"  stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="location" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="qty" fill="url(#invGrad)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
