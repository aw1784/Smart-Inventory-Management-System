import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser } from '../../store/authSlice.js';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signInUser(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/statistics');
  };

  return (
    <form onSubmit={handleSubmit} className="card w-full max-w-md p-8 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-indigo-500 font-semibold">Welcome back</p>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Sign in to your console</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage products, orders and stock in real time.
        </p>
      </div>
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            className="input mt-1"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Password</label>
          <input
            className="input mt-1"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-sm text-center text-slate-500">
        No account?{' '}
        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
