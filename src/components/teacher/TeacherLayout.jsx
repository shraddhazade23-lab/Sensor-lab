import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { isFirebaseConfigured } from '../../services/firebase.js';
import {
  LayoutDashboard,
  Users,
  Layers,
  Award,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Database
} from 'lucide-react';

export const TeacherLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCloudOnline = isFirebaseConfigured();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/teacher/overview', icon: LayoutDashboard },
    { name: 'Students', path: '/teacher/students', icon: Users },
    { name: 'Projects', path: '/teacher/projects', icon: Layers },
    { name: 'Points & Badges', path: '/teacher/achievements', icon: Award },
    { name: 'Certificates', path: '/teacher/certificates', icon: FileCheck },
    { name: 'Reports & Analytics', path: '/teacher/reports', icon: BarChart3 },
    { name: 'Settings', path: '/teacher/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">SensorLab</span>
            <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              Faculty
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center space-x-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg text-white tracking-tight">Sensor<span className="text-teal-400">Lab</span></span>
                <span className="text-[10px] font-extrabold uppercase bg-teal-900/80 text-teal-300 px-1.5 py-0.5 rounded border border-teal-700/60">
                  Faculty
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                {userProfile?.institution || 'Greenwood STEM'}
              </p>
            </div>
          </div>

          {/* Teacher Profile Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'T'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userProfile?.displayName || 'Faculty Member'}</p>
              <p className="text-[10px] text-slate-400 truncate">Classes 5–10 STEM Faculty</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 pb-2 block">
              Teaching Tools
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/teacher/overview' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Student View Shortcut */}
          <div className="pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 pb-2 block">
              Student Environment
            </span>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-teal-300 hover:bg-slate-800/80 transition-all border border-slate-700/60 group"
            >
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-4 h-4 text-teal-400" />
                <span>Switch to Student View</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300" />
            </Link>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/90">
          {/* Connection Status Pill */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${isCloudOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{isCloudOnline ? 'Cloud Firebase' : 'Local Persistence'}</span>
            </div>
            <Database className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Faculty Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Sticky Header */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Verified Faculty Session</span>
            </div>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-600">
              Classes 5–10 Curriculum & Real-time Progress
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
            >
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              <span>Preview Student View</span>
            </Link>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center ring-2 ring-teal-500/20">
                {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'T'}
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 leading-tight">{userProfile?.displayName || 'Faculty'}</p>
                <p className="text-[10px] text-slate-400">Teacher</p>
              </div>
            </div>
          </div>
        </header>

        {/* Child Route Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
