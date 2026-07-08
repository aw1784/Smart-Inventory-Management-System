import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserRole, removeUser } from '../../store/usersSlice.js';

const ROLE_BADGE = {
  admin: 'bg-indigo-100 text-indigo-700',
  user:  'bg-slate-100 text-slate-600',
};

export default function UsersItem({ user }) {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);
  const isMe = me && (me.id === user._id || me._id === user._id);

  const isAdmin = user.role === 'admin';
  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();

  const handleToggleRole = () => {
    if (isMe) return;
    dispatch(changeUserRole({ id: user._id, role: isAdmin ? 'user' : 'admin' }));
  };

  const handleDelete = () => {
    if (isMe) return;
    if (!window.confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    dispatch(removeUser(user._id));
  };

  return (
    <li className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/60 transition">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
          isAdmin
            ? 'bg-gradient-to-br from-indigo-500 to-violet-500'
            : 'bg-gradient-to-br from-slate-400 to-slate-500'
        }`}>
          {initial}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 truncate">{user.name}</h3>
            {isMe && <span className="badge bg-amber-100 text-amber-700">you</span>}
          </div>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`badge ${ROLE_BADGE[user.role] || ROLE_BADGE.user}`}>
          {user.role}
        </span>
        <button
          onClick={handleToggleRole}
          disabled={isMe}
          title={isMe ? 'You cannot change your own role' : ''}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            isMe
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isAdmin
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
          }`}
        >
          {isAdmin ? 'Demote to User' : 'Promote to Admin'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isMe}
          title={isMe ? 'You cannot delete your own account' : ''}
          className={`btn-danger ${isMe ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
