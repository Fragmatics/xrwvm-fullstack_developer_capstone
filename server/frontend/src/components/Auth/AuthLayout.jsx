import React from 'react';
import Header from '../Header/Header';

// Shared split-screen shell for the login and register pages
const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-md">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <img src="/static/car_dealership.jpg" alt="" className="absolute inset-0 h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-brand-900/30"></div>
          <div className="absolute inset-x-0 bottom-0 p-12 text-white">
            <p className="text-2xl font-semibold leading-snug">&ldquo;Honest reviews from real buyers made choosing a dealer effortless.&rdquo;</p>
            <p className="mt-4 text-sm text-slate-300">Join thousands of drivers sharing their experience on Best Cars.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
