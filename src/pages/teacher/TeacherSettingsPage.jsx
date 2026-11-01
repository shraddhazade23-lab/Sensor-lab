import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services/teacherService.js';
import { isFirebaseConfigured } from '../../services/firebase.js';
import {
  Settings,
  User,
  ShieldCheck,
  Database,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  GraduationCap
} from 'lucide-react';

export const TeacherSettingsPage = () => {
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    institution: '',
    department: '',
    assignedGrades: [5, 6, 7, 8, 9, 10],
    emailNotifications: true,
    autoAwardBadges: true,
    allowStudentSelfAssess: true
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const isCloudOnline = isFirebaseConfigured();

  useEffect(() => {
    const loadProfile = async () => {
      const p = await teacherService.getTeacherProfile();
      setProfile(p);
    };
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await teacherService.updateTeacherProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset classroom sample data to initial benchmark cohort? This will replenish sample student progress and certificates for demonstration.')) {
      teacherService.resetToSampleData();
      setIsResetSuccess(true);
      setTimeout(() => setIsResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 mb-1">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>Faculty & Classroom Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Teacher Portal Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your institution profile, active class assignments, evaluation policies, and Firebase security status.
        </p>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Faculty settings successfully saved.</span>
        </div>
      )}

      {isResetSuccess && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Classroom roster data re-seeded to sample benchmark cohort.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
          <User className="w-4 h-4 text-teal-600" />
          <span>Teacher Profile & School Credentials</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Faculty Full Name
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Faculty Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              School / Institution
            </label>
            <input
              type="text"
              value={profile.institution}
              onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Department
            </label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
            />
          </div>
        </div>

        {/* Classroom Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Automated Evaluation Policies
          </h3>

          <div className="space-y-2">
            <label className="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.autoAwardBadges}
                onChange={(e) => setProfile({ ...profile, autoAwardBadges: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Automatically trigger badge unlocks when student satisfies simulation criteria</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.emailNotifications}
                onChange={(e) => setProfile({ ...profile, emailNotifications: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Send weekly email digest summarizing newly completed student projects</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.allowStudentSelfAssess}
                onChange={(e) => setProfile({ ...profile, allowStudentSelfAssess: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Allow students to request certificate evaluation upon completing grade milestones</span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Backend & Security Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & Firebase Infrastructure Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Database Layer</span>
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <span className={`w-2.5 h-2.5 rounded-full ${isCloudOnline ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{isCloudOnline ? 'Cloud Firestore Connected' : 'Local Persistence & Offline Demo Mode'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isCloudOnline ? 'Direct secure SDK synchronization' : 'Persisting in browser local store for resilient testing'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Access Control Rules</span>
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Role-Enforced (firestore.rules)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Students cannot access other students' records or elevate roles
            </p>
          </div>
        </div>
      </div>

      {/* Classroom Demonstration Data Manager */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Demonstration Cohort Manager</span>
            </h2>
            <p className="text-xs text-slate-500">
              Reset classroom sample data to initial benchmark cohort for live presentations or evaluations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetSampleData}
            className="px-4 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Re-seed Sample Cohort</span>
          </button>
        </div>
      </div>

    </div>
  );
};
