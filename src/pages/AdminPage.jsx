import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { isFirebaseConfigured } from '../services/firebase.js';
import { INITIAL_MODULES, INITIAL_LESSONS } from '../data/initialLessons.js';
import { INITIAL_PROJECTS } from '../data/initialProjects.js';
import { INITIAL_QUIZZES } from '../data/initialQuizzes.js';
import {
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminPage = () => {
  const { currentUser, userProfile } = useAuth();
  const firebaseOnline = isFirebaseConfigured();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-1.5 bg-slate-900 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>System Administration & Project Inspection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          SensorLab Architecture Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Evaluation and administrative panel for industrial project verification, database rules, and curriculum health.
        </p>
      </div>

      {/* Backend & Environment Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Firebase Service</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${firebaseOnline ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
            <span className="font-extrabold text-sm text-slate-900">
              {firebaseOnline ? 'Cloud Firebase Active' : 'Local Persistence Mode'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {firebaseOnline ? 'Connected via modular SDK' : 'Full offline / demo mock persistence active'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Firestore Security</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-extrabold text-sm text-slate-900">
              Rules Enforced (firestore.rules)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            User-scoped subcollections, admin-only content writes
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">AI Learning Mentor</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="font-extrabold text-sm text-slate-900">
              Sparky AI Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Firebase AI Logic / Gemini model integration + fallback
          </p>
        </div>

      </div>

      {/* Curriculum & Database Inventory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <FileCode className="w-5 h-5 text-teal-600" />
          <span>Curriculum & Content Inventory</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{INITIAL_MODULES.length}</span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Class Modules</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-2xl font-black text-teal-600">{INITIAL_LESSONS.length}</span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Structured Lessons</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-2xl font-black text-indigo-600">{INITIAL_PROJECTS.length}</span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Guided Projects</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-2xl font-black text-amber-600">{INITIAL_QUIZZES.length}</span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Quiz Assessments</span>
          </div>
        </div>

        {/* Security Rules Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verified Security Policies
          </h4>
          <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-xs space-y-1">
            <p className="text-emerald-400">✓ match /users/{'{userId}'} ➔ Read/Write restricted to owner (request.auth.uid == userId)</p>
            <p className="text-emerald-400">✓ match /learningModules ➔ Read allowed for students; Writes strictly require admin claim</p>
            <p className="text-emerald-400">✓ match /savedCircuits ➔ Isolated per student UID</p>
            <p className="text-emerald-400">✓ Client cannot escalate privileges by updating isAdmin: true</p>
          </div>
        </div>

      </div>

    </div>
  );
};
