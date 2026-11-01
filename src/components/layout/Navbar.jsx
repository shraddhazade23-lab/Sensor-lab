import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProgress } from '../../contexts/ProgressContext.jsx';
import { Cpu, BookOpen, Layers, Award, User, LogOut, Menu, X, Sparkles, GraduationCap } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, userProfile, isTeacher, logout } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Cpu, authOnly: true },
    { name: 'Learn', path: '/learn', icon: BookOpen, authOnly: false },
    { name: 'Projects', path: '/projects', icon: Layers, authOnly: false },
    { name: 'Virtual Lab', path: '/lab', icon: Sparkles, authOnly: false, highlight: true },
    { name: 'Achievements', path: '/achievements', icon: Award, authOnly: true },
  ];

  const visibleLinks = navLinks.filter(l => !l.authOnly || currentUser);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                Sensor<span className="text-teal-600">Lab</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                Classes 5–10
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    link.highlight
                      ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold border border-teal-200/80'
                      : isActive
                      ? 'text-teal-600 bg-teal-50/50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? 'text-teal-600' : ''}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                
                {/* Faculty Portal Button if teacher */}
                {isTeacher && (
                  <Link
                    to="/teacher/overview"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                    title="Open Faculty Dashboard"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Teacher Portal</span>
                  </Link>
                )}

                {/* Points Pill */}
                <Link
                  to="/achievements"
                  className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 transition-colors"
                  title="Your Learning Points"
                >
                  <span>⚡</span>
                  <span>{progress.points || 0} pts</span>
                </Link>

                {/* Grade Badge */}
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200">
                  {userProfile?.grade ? `Class ${userProfile.grade}` : 'Faculty'}
                </span>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-slate-700 hover:text-teal-600 font-medium text-sm p-1 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Profile Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/20">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{userProfile?.displayName || 'User'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-600/30 transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {currentUser && (
              <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                ⚡ {progress.points || 0}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-600"
              >
                <Icon className="w-5 h-5 text-teal-600" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 text-sm text-slate-600">
                  <span>User: <strong>{userProfile?.displayName}</strong></span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                    {userProfile?.grade ? `Class ${userProfile.grade}` : 'Faculty'}
                  </span>
                </div>
                {isTeacher && (
                  <Link
                    to="/teacher/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-bold text-teal-700 bg-teal-50 rounded-lg border border-teal-200"
                  >
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <span>Teacher Faculty Portal</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
