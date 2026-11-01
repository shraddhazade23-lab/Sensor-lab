import React, { useState } from 'react';
import { X, Save, Check } from 'lucide-react';

export const SaveCircuitModal = ({ isOpen, onClose, onSave, currentName }) => {
  const [circuitName, setCircuitName] = useState(currentName || 'My Custom Circuit');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!circuitName.trim()) return;

    setIsSaving(true);
    await onSave(circuitName);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-teal-700">
            <Save className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900">Save Your Circuit</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Circuit Name
            </label>
            <input
              type="text"
              value={circuitName}
              onChange={(e) => setCircuitName(e.target.value)}
              placeholder="e.g. My Smart Night Lamp"
              maxLength={50}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
              required
            />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Your components, wires, and pin configurations will be saved to your student profile so you can load them anytime.
          </p>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isSaved}
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>{isSaving ? 'Saving...' : 'Save Circuit'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
