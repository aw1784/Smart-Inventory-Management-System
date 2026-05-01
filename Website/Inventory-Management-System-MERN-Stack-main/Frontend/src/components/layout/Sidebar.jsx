import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NAV = [
  { to: '/statistics', label: 'Dashboard', icon: '📊', adminOnly: false },
  { to: '/products',   label: 'Products',  icon: '📦', adminOnly: false },
  { to: '/orders',     label: 'Orders',    icon: '🧾', adminOnly: false },
  { to: '/inventory',  label: 'Inventory', icon: '🏷️', adminOnly: false },
  { to: '/users',      label: 'Users',     icon: '👥', adminOnly: true  },
];

export default function Sidebar() {
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'admin';
  const items = NAV.filter((n) => !n.adminOnly || isAdmin);

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-900 text-slate-200">
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-extrabold text-white shadow">
          IMS
        </div>
        <div>
          <p className="font-bold tracking-tight text-white">Inventory MERN</p>
          <p className="text-[11px] text-slate-400">Microservices Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white border border-indigo-400/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </span>
            {item.adminOnly && (
              <span className="text-[10px] uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded">
                admin
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 text-[11px] text-slate-400">
        <p className="text-slate-300 font-medium truncate">{user?.name}</p>
        <p className="truncate">Role: <span className="text-slate-200">{user?.role || 'user'}</span></p>
      </div>
    </aside>
  );
}
