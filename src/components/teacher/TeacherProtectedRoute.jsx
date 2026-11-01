import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ShieldAlert, Cpu, ArrowLeft } from 'lucide-react';

export const TeacherProtectedRoute = ({ children }) => {
  const { currentUser, userProfile, isTeacher, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-600/10 text-teal-600 flex items-center justify-center animate-spin mb-4">
          <Cpu className="w-6 h-6" />
        </div>
        <p className="text-slate-600 font-medium text-sm">Verifying faculty authorization...</p>
      </div>
    );
  }

  // Not logged in -> go to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in as student without teacher role -> block access
  if (!isTeacher) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto ring-8 ring-red-50">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded-full">
              Teacher Authorization Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Restricted Faculty Portal
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your account (<strong>{userProfile?.displayName || currentUser.email}</strong>) is currently designated as a <em>Student</em> in Class {userProfile?.grade || 5}.
            </p>
            <p className="text-xs text-slate-500">
              Only authorized teachers and institution administrators can access student rosters, grade analytics, and certificates.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Student Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
