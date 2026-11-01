import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 text-2xl shadow-inner">
          <Cpu className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-4xl font-black text-slate-900 font-mono">404</span>
          <h2 className="text-xl font-bold text-slate-800">Circuit Not Found!</h2>
          <p className="text-xs text-slate-500">
            Looks like this wire led to nowhere or the page has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
