import React from 'react';

const ROWS = [
  { label: 'View Dashboard',          user: true,  admin: true },
  { label: 'View Products / Inventory', user: true,  admin: true },
  { label: 'Place own Orders',        user: true,  admin: true },
  { label: 'Add / Delete Products',   user: false, admin: true },
  { label: 'Add / Adjust Inventory',  user: false, admin: true },
  { label: 'Update Order status',     user: false, admin: true },
  { label: 'Manage Users (promote / demote / delete)', user: false, admin: true },
];

const Cell = ({ ok }) =>
  ok ? (
    <span className="badge bg-emerald-100 text-emerald-700">✓ Allowed</span>
  ) : (
    <span className="badge bg-slate-100 text-slate-500">— Denied</span>
  );

export default function PermissionsMatrix() {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900">Permissions matrix</h3>
        <p className="text-xs text-slate-500">What each role can do across the console.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-2 pr-3 font-semibold">Capability</th>
              <th className="py-2 px-3 font-semibold">User</th>
              <th className="py-2 px-3 font-semibold">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ROWS.map((r) => (
              <tr key={r.label}>
                <td className="py-2.5 pr-3 text-slate-700">{r.label}</td>
                <td className="py-2.5 px-3"><Cell ok={r.user} /></td>
                <td className="py-2.5 px-3"><Cell ok={r.admin} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
