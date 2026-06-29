import React from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';

const STATUS_COLORS = {
  pending:   '#f59e0b',
  paid:      '#10b981',
  shipped:   '#3b82f6',
  delivered: '#6366f1',
  cancelled: '#ef4444',
  unknown:   '#94a3b8',
};

export default function OrderStats() {
  const stats = useSelector((s) => s.statistics.orderStats);
  const data = Object.entries(stats?.byStatus || {}).map(([status, count]) => ({
    status, count,
  }));

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900">Orders by status</h3>
          <p className="text-xs text-slate-500">
            Total: <strong>{stats?.total ?? 0}</strong> · Revenue:{' '}
            <strong>${Number(stats?.totalRevenue ?? 0).toLocaleString()}</strong>
          </p>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-slate-400">
          No orders yet — place one to see the chart.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((d) => (
                  <Cell key={d.status} fill={STATUS_COLORS[d.status] || STATUS_COLORS.unknown} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
