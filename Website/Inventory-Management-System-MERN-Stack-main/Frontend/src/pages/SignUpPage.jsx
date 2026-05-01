import React from 'react';
import SignUp from '../components/Auth/SignUp.jsx';

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl"></div>
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-extrabold">
            IMS
          </div>
          <span className="font-bold text-lg">Inventory MERN</span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">
            Start tracking stock<br /> in 60 seconds.
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            Create your account and your data lives in your own MongoDB cluster.
          </p>
        </div>
        <p className="relative text-xs text-white/60">© Inventory MERN — Microservices Edition</p>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <SignUp />
      </div>
    </div>
  );
}
