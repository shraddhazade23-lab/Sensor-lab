import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Cpu, Eye, EyeOff, AlertCircle, ArrowRight, Play, Check } from 'lucide-react';
import { authService } from '../services/authService.js';

export const LoginPage = () => {
  const { login, loginAsDemoStudent, loginAsDemoTeacher } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const destination = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      // If user is a teacher, redirect to teacher overview
      const isFaculty = result.user?.role === 'teacher' || result.user?.isAdmin === true;
      if (isFaculty && !location.state?.from) {
        navigate('/teacher/overview', { replace: true });
      } else {
        navigate(destination, { replace: true });
      }
    }
  };

  const handleQuickDemo = async (grade = 6) => {
    setIsSubmitting(true);
    await loginAsDemoStudent(grade);
    setIsSubmitting(false);
    navigate(destination, { replace: true });
  };

  const handleQuickTeacherDemo = async () => {
    setIsSubmitting(true);
    await loginAsDemoTeacher();
    setIsSubmitting(false);
    navigate('/teacher/overview', { replace: true });
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await authService.resetPassword(forgotEmail);
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowForgotModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 mx-auto flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to SensorLab
          </h2>
          <p className="text-xs text-slate-500">
            Log in to continue your virtual electronics learning journey
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Fast Demonstration Login Banner */}
        <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4 text-center space-y-2.5">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-teal-900">
            <Play className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
            <span>Industrial Live Demo Quick-Start</span>
          </div>
          <p className="text-[11px] text-teal-700">
            Instantly evaluate either the Student Learning Platform or the new Teachers Faculty Dashboard.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo(6)}
              disabled={isSubmitting}
              className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Sign In as Student (Class 6)
            </button>
            <button
              type="button"
              onClick={handleQuickTeacherDemo}
              disabled={isSubmitting}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-teal-300 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Sign In as Teacher (Faculty)
            </button>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.edu"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to SensorLab?{' '}
          <Link to="/signup" className="text-teal-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your email address and we'll send a password recovery link.
            </p>
            <form onSubmit={handleSendReset} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="student@school.edu"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                required
              />
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg flex items-center justify-center space-x-1"
                >
                  {resetSent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <span>Send Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
