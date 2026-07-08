import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, clearUsersError } from '../../store/usersSlice.js';
import UsersItem from './UsersItem.jsx';

export default function UsersList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.users);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const adminCount = items.filter((u) => u.role === 'admin').length;
  const userCount  = items.filter((u) => u.role === 'user').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Total users</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{items.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Admins</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1 tabular-nums">{adminCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Standard</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1 tabular-nums">{userCount}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => dispatch(clearUsersError())} className="text-rose-500 hover:underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading && <p className="p-5 text-sm text-slate-500">Loading users…</p>}
        {!loading && items.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No users found.</p>
        )}
        <ul className="divide-y divide-slate-100">
          {items.map((u) => <UsersItem key={u._id} user={u} />)}
        </ul>
      </div>
    </div>
  );
}
