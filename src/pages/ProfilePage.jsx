import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { progressService } from '../services/progressService.js';
import {
  User,
  Cpu,
  Trash2,
  Save,
  Check,
  LogOut,
  FolderOpen,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const AVATARS = [
  { id: 'bot-1', label: 'Circuit Bot', emoji: '🤖', bg: 'bg-teal-100 border-teal-300' },
  { id: 'bot-2', label: 'Volt Fox', emoji: '🦊', bg: 'bg-amber-100 border-amber-300' },
  { id: 'bot-3', label: 'Astro Spark', emoji: '🚀', bg: 'bg-indigo-100 border-indigo-300' },
  { id: 'bot-4', label: 'Lab Owl', emoji: '🦉', bg: 'bg-emerald-100 border-emerald-300' }
];

export const ProfilePage = () => {
  const { currentUser, userProfile, updateProfileData, logout } = useAuth();
  const { deleteSavedCircuit } = useProgress();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [grade, setGrade] = useState(userProfile?.grade ? String(userProfile.grade) : '5');
  const [avatarId, setAvatarId] = useState(userProfile?.avatarId || 'bot-1');
  const [savedCircuits, setSavedCircuits] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setGrade(String(userProfile.grade || 5));
      setAvatarId(userProfile.avatarId || 'bot-1');
    }
  }, [userProfile]);

  useEffect(() => {
    const loadCircuits = async () => {
      if (currentUser) {
        const list = await progressService.getSavedCircuits(currentUser.uid);
        setSavedCircuits(list);
      }
    };
    loadCircuits();
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfileData({
      displayName,
      grade: Number(grade),
      avatarId
    });
    setIsUpdating(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  };

  const handleDeleteCircuit = async (circuitId) => {
    if (window.confirm('Are you sure you want to delete this saved circuit?')) {
      await deleteSavedCircuit(circuitId);
      setSavedCircuits(prev => prev.filter(c => c.id !== circuitId));
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile & Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your personal electronics learning profile and saved circuits
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors flex items-center space-x-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <User className="w-5 h-5 text-teal-600" />
          <span>Account Information</span>
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={userProfile?.email || currentUser?.email || 'student@sensorlab.edu'}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Grade selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Class / Grade Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['5', '6', '7'].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    grade === g
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Class {g}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => setAvatarId(av.id)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${
                    avatarId === av.id
                      ? 'border-teal-600 bg-teal-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-1 border ${av.bg}`}>
                    {av.emoji}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              {updateSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <span>{isUpdating ? 'Saving...' : 'Save Profile Changes'}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Saved Circuits Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Your Saved Virtual Circuits</h2>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-500">
            {savedCircuits.length} Saved
          </span>
        </div>

        {savedCircuits.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 space-y-2">
            <p>You haven't saved any custom circuits yet.</p>
            <Link to="/lab" className="text-teal-600 font-bold hover:underline block">
              Construct and save a circuit in the Virtual Lab!
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedCircuits.map((circ) => (
              <div
                key={circ.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">{circ.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {circ.components?.length || 0} Components • {circ.connections?.length || 0} Wires • Saved {new Date(circ.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Link
                    to="/lab"
                    className="flex-1 sm:flex-initial px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center"
                  >
                    Open in Lab
                  </Link>
                  <button
                    onClick={() => handleDeleteCircuit(circ.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Saved Circuit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
