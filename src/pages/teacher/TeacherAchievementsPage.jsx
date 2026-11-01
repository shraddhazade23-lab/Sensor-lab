import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacherService.js';
import {
  Award,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const TeacherAchievementsPage = () => {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [data, setData] = useState({ leaderboard: [], badgeStats: [], recentAchievements: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievementsData = async () => {
    setIsLoading(true);
    try {
      const res = await teacherService.getPointsAndBadgesLeaderboard({ gradeFilter });
      setData(res);
    } catch (err) {
      console.error('Error fetching points & badges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievementsData();
  }, [gradeFilter]);

  const { leaderboard, badgeStats, recentAchievements } = data;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 mb-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Achievement & Score Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Points Leaderboard & Skill Badges
          </h1>
          <p className="text-xs text-slate-500">
            Real-time student rankings calculated from completed circuits, verified lessons, and quiz scores.
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Class:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="all">All Classes (5–10)</option>
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>
      </div>

      {/* Anti-Tampering Security Alert */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-5 border border-slate-700 shadow-md flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">Cryptographically Audited Score Rules</p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All points are calculated server-side from immutable project subcollections and verified quiz scores (+100 pts per completed circuit, +50 pts per lesson, +30 pts per passed quiz). Direct client value modification is strictly rejected by Firestore security rules.
          </p>
        </div>
      </div>

      {/* Main Grid: Leaderboard & Badge Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Classroom Leaderboard (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Student Points Ranking</h2>
              <p className="text-xs text-slate-500">Ranked by total validated learning score</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{leaderboard.length} candidates</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-2"></div>
              <span>Recalculating leaderboard...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No students found.</div>
          ) : (
            <div className="space-y-2.5">
              {leaderboard.map((student, idx) => {
                let medal = `#${idx + 1}`;
                let rowBg = 'bg-slate-50/70 border-slate-200/80';
                if (idx === 0) {
                  medal = '🥇 1st';
                  rowBg = 'bg-amber-50/80 border-amber-300 shadow-2xs';
                } else if (idx === 1) {
                  medal = '🥈 2nd';
                  rowBg = 'bg-slate-100/90 border-slate-300';
                } else if (idx === 2) {
                  medal = '🥉 3rd';
                  rowBg = 'bg-amber-100/40 border-amber-200';
                }

                return (
                  <div
                    key={student.uid}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${rowBg}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="font-black text-xs min-w-[42px] text-slate-700">{medal}</span>
                      <div className="w-8 h-8 rounded-xl bg-white text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {student.displayName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/teacher/students/${student.uid}`}
                          className="font-extrabold text-xs text-slate-900 hover:text-teal-600 block truncate"
                        >
                          {student.displayName}
                        </Link>
                        <p className="text-[10px] text-slate-400 truncate">
                          Class {student.grade} • {student.projectsCompleted || 0} projects completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-800 bg-white border border-amber-200 px-2.5 py-1 rounded-full inline-block">
                          ⚡ {student.totalPoints || 0} pts
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{student.badgesCount || 0} badges</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Badge Distribution & Recent Achievements (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Badge Analytics Cards */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Skill Badges Unlocked</span>
            </h3>

            <div className="space-y-3">
              {badgeStats.map((badge) => (
                <div key={badge.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{badge.icon}</span>
                      <div>
                        <p className="font-extrabold text-slate-900">{badge.title}</p>
                        <p className="text-[10px] text-slate-400">{badge.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-teal-700 text-xs">{badge.earnedCount} students</span>
                      <p className="text-[10px] text-slate-400">{badge.percentage}% adoption</p>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${Math.max(5, badge.percentage)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Recent Badge Unlocks</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Stream</span>
            </div>

            <div className="space-y-2.5">
              {recentAchievements.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No recent achievements unlocked.</p>
              ) : (
                recentAchievements.map((ach, i) => (
                  <div key={i} className="flex items-start space-x-2.5 text-xs pb-2 border-b border-slate-100 last:border-b-0">
                    <span className="text-base mt-0.5">{ach.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-bold truncate">
                        {ach.studentName} (Class {ach.grade})
                      </p>
                      <p className="text-slate-500 text-[11px] truncate">Unlocked {ach.badgeTitle}</p>
                      <span className="text-[10px] text-slate-400">{new Date(ach.earnedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
