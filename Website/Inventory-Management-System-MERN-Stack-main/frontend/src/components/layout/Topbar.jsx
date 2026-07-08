import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/authSlice.js';

const TITLES = {
  '/statistics': 'Dashboard',
  '/products':   'Products',
  '/orders':     'Orders',
  '/inventory':  'Inventory',
};

export default function Topbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Dashboard';

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-10">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-400">Console</p>
        <h1 className="text-lg font-bold text-slate-900 -mt-0.5">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 pl-1 pr-3 py-1">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center">
            {initial}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-500 leading-tight">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { dispatch(logout()); navigate('/signin'); }}
          className="rounded-xl text-sm font-medium px-3 py-2 text-rose-600 hover:bg-rose-50 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
