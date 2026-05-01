import React from 'react';
import SignIn from '../components/Auth/SignIn.jsx';

export default function SignInPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-extrabold">
              IMS
            </div>
            <span className="font-bold text-lg">Inventory MERN</span>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">
            Run your warehouse<br /> like a Fortune 500.
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            Real-time stock, orders, statistics and microservices — in a single console.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {['Products', 'Orders', 'Inventory'].map((k) => (
              <div key={k} className="rounded-xl bg-white/10 backdrop-blur px-3 py-4 border border-white/10">
                <p className="text-xs text-white/70">{k}</p>
                <p className="font-bold">Live</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/60">© Inventory MERN — Microservices Edition</p>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <SignIn />
      </div>
    </div>
  );
}
