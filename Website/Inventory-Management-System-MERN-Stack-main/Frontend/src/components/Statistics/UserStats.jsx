import React from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export default function UserStats() {
  const stats = useSelector((s) => s.statistics.userStats);
  const data = Object.entries(stats?.byRole || {}).map(([role, value]) => ({
    name: role, value,
  }));

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900">Users by role</h3>
          <p className="text-xs text-slate-500">
            Total users: <strong>{stats?.total ?? 0}</strong>
          </p>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-slate-400">
          No user data — sign in as admin to load this chart.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
