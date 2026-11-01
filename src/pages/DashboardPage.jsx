import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { INITIAL_PROJECTS } from '../data/initialProjects.js';
import { INITIAL_LESSONS } from '../data/initialLessons.js';
import {
  Cpu,
  BookOpen,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  TrendingUp,
  Activity
} from 'lucide-react';

export const DashboardPage = () => {
  const { userProfile } = useAuth();
  const { progress } = useProgress();

  const studentGrade = userProfile?.grade || 5;

  // Filter lessons and projects for student grade
  const gradeProjects = INITIAL_PROJECTS.filter(p => p.gradeLevels.includes(studentGrade));
  const gradeLessons = INITIAL_LESSONS.filter(l => l.gradeLevel === studentGrade);

  // Compute real counts from progress
  const completedProjectsCount = Object.values(progress.projects || {}).filter(p => p.status === 'completed').length;
  const inProgressProjectsCount = Object.values(progress.projects || {}).filter(p => p.status === 'inProgress').length;
  const completedLessonsCount = Object.values(progress.lessons || {}).filter(l => l.status === 'completed').length;
  const totalAvailableProjects = INITIAL_PROJECTS.length;
  const totalPoints = progress.points || 0;

  // Find next unfinished lesson
  const nextLesson = gradeLessons.find(l => !progress.lessons[l.id] || progress.lessons[l.id].status !== 'completed') || gradeLessons[0];
  // Find recommended project
  const recommendedProject = gradeProjects.find(p => !progress.projects[p.id] || progress.projects[p.id].status !== 'completed') || gradeProjects[0];

  // Completion percentage
  const totalItems = gradeLessons.length + gradeProjects.length;
  const completedItems = (gradeLessons.filter(l => progress.lessons[l.id]?.status === 'completed').length) +
                         (gradeProjects.filter(p => progress.projects[p.id]?.status === 'completed').length);
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const activities = progress.activities || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-teal-900/60 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/40">
                Class {studentGrade} Tech Pathway
              </span>
              <span className="text-amber-300 text-xs font-bold flex items-center space-x-1">
                <span>⚡</span>
                <span>{totalPoints} Learning Points</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userProfile?.displayName || 'Junior Inventor'}!
            </h1>
            <p className="text-sm text-teal-100 max-w-xl">
              Ready to construct new sensor circuits? Continue your learning pathway or test experiments in the virtual lab.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/lab"
              className="px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Launch Virtual Lab</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Available Projects</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{totalAvailableProjects}</span>
            <span className="text-xs text-slate-400">catalog</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">Projects Completed</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-teal-600">{completedProjectsCount}</span>
            <span className="text-xs text-slate-400">/{gradeProjects.length} class</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Lessons Finished</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-600">{completedLessonsCount}</span>
            <span className="text-xs text-slate-400">/{gradeLessons.length} class</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Total Points</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-indigo-600">{totalPoints}</span>
            <span className="text-xs text-slate-400">pts</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Curriculum Progress</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600">{completionPercentage}%</span>
            <span className="text-xs text-slate-400">completed</span>
          </div>
        </div>

      </div>

      {/* Main Learning Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Continue Learning & Recommended Project */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Continue Learning Card */}
          {nextLesson && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-800">Continue Learning Next Lesson</h3>
                </div>
                <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Class {nextLesson.gradeLevel}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">{nextLesson.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{nextLesson.introduction}</p>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{nextLesson.estimatedMinutes} mins</span>
                    </span>
                    <span>•</span>
                    <span className="text-teal-600 font-semibold">+50 pts reward</span>
                  </div>
                </div>

                <Link
                  to={`/learn/${nextLesson.moduleId}?lesson=${nextLesson.id}`}
                  className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <span>Start Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Recommended Hands-on Project Card */}
          {recommendedProject && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-800">Recommended Guided Project</h3>
                </div>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {recommendedProject.difficulty}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{recommendedProject.thumbnail}</span>
                    <h4 className="text-lg font-bold text-slate-900">{recommendedProject.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{recommendedProject.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recommendedProject.components.slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/projects/${recommendedProject.id}`}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <span>View Project Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Progress Chart / Visual Meter */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-800">Curriculum Mastery Bar</h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700">{completionPercentage}%</span>
            </div>

            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-inner"
                style={{ width: `${Math.max(5, completionPercentage)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500 pt-2">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block font-bold text-slate-800">{gradeLessons.length}</span>
                <span className="text-[10px]">Total Lessons</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block font-bold text-slate-800">{gradeProjects.length}</span>
                <span className="text-[10px]">Guided Labs</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block font-bold text-slate-800">5 Badges</span>
                <span className="text-[10px]">Unlockable</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity Feed & Earned Badges */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Activity Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-800">Recent Activity</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Live Firestore Feed</span>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                <p>No activity recorded yet.</p>
                <Link
                  to="/learn"
                  className="text-teal-600 font-semibold hover:underline block"
                >
                  Start your first lesson to earn points!
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start space-x-3 text-xs border-b border-slate-50 pb-2.5 last:border-0">
                    <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                    <div className="space-y-0.5 flex-1">
                      <p className="font-semibold text-slate-800">{act.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {act.pointsAwarded > 0 && (
                          <span className="text-amber-600 font-bold">+{act.pointsAwarded} pts</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Badges Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-800">Your Badges</h3>
              </div>
              <Link to="/achievements" className="text-xs text-teal-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {['first-lesson', 'circuit-explorer'].map((bId) => {
                const earned = Boolean(progress.achievements && progress.achievements[bId]);
                return (
                  <div
                    key={bId}
                    className={`p-3 rounded-2xl border text-center space-y-1 ${
                      earned ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <span className="text-2xl block">{bId === 'first-lesson' ? '🚀' : '⚡'}</span>
                    <span className="font-bold text-[11px] text-slate-800 block">
                      {bId === 'first-lesson' ? 'First Step' : 'Circuit Explorer'}
                    </span>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      earned ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {earned ? 'Earned' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
