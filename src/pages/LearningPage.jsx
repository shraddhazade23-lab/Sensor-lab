import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { lessonService } from '../services/lessonService.js';
import { INITIAL_LESSONS } from '../data/initialLessons.js';
import { BookOpen, CheckCircle2, Clock, ArrowRight, Sparkles, Layers } from 'lucide-react';

export const LearningPage = () => {
  const { userProfile } = useAuth();
  const { progress } = useProgress();

  const [selectedGrade, setSelectedGrade] = useState(userProfile?.grade ? String(userProfile.grade) : 'all');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      setLoading(true);
      const data = await lessonService.getModules(selectedGrade === 'all' ? null : Number(selectedGrade));
      setModules(data);
      setLoading(false);
    };
    loadModules();
  }, [selectedGrade]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Middle School Curriculum</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Class-Wise Learning Pathways
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Follow guided lessons designed for Classes 5, 6, and 7. Learn electronic fundamentals, explore sensor physics, and understand smart automation.
        </p>
      </div>

      {/* Grade Level Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All Classes' },
          { id: '5', label: 'Class 5 (Intro to Electronics)' },
          { id: '6', label: 'Class 6 (Sensors & Arduino)' },
          { id: '7', label: 'Class 7 (Automation & PWM)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedGrade(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modules List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-400">Loading curriculum modules...</div>
      ) : (
        <div className="space-y-8">
          {modules.map((mod) => {
            const moduleLessons = INITIAL_LESSONS.filter(l => l.moduleId === mod.id);
            const completedCount = moduleLessons.filter(l => progress.lessons[l.id]?.status === 'completed').length;

            return (
              <div
                key={mod.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl shadow-2xs">
                      {mod.thumbnail}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          Class {mod.gradeLevels.join(', ')}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-500">{mod.difficulty}</span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{mod.title}</h2>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      {completedCount} / {moduleLessons.length} Completed
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {mod.description}
                </p>

                {/* Lessons List inside this module */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Lessons in this Module:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {moduleLessons.map((les) => {
                      const isCompleted = progress.lessons[les.id]?.status === 'completed';
                      return (
                        <div
                          key={les.id}
                          className="bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-400">Lesson {les.sortOrder}</span>
                              {isCompleted ? (
                                <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Done (+50 pts)</span>
                                </span>
                              ) : (
                                <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                                  <Clock className="w-3 h-3" />
                                  <span>{les.estimatedMinutes} min</span>
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                              {les.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {les.introduction}
                            </p>
                          </div>

                          <Link
                            to={`/learn/${mod.id}?lesson=${les.id}`}
                            className="w-full py-2 bg-white hover:bg-teal-600 group-hover:bg-teal-600 text-slate-700 group-hover:text-white font-bold text-xs rounded-xl border border-slate-300 group-hover:border-teal-600 text-center transition-all shadow-2xs flex items-center justify-center space-x-1.5"
                          >
                            <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
