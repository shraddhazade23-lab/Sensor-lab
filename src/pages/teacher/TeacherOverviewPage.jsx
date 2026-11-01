import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacherService.js';
import {
  Users,
  Activity,
  Layers,
  Award,
  FileCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  GraduationCap,
  Calendar
} from 'lucide-react';

export const TeacherOverviewPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topAchievers, setTopAchievers] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      setIsLoading(true);
      try {
        const [sumData, studentsRes, leaderboardRes] = await Promise.all([
          teacherService.getDashboardSummary({ gradeFilter }),
          teacherService.getStudentsList({ gradeFilter, pageSize: 6 }),
          teacherService.getPointsAndBadgesLeaderboard({ gradeFilter })
        ]);

        setSummary(sumData);
        setTopAchievers(leaderboardRes.leaderboard.slice(0, 4));

        // Flatten recent activities from students
        const acts = [];
        studentsRes.students.forEach(s => {
          (s.progress?.activities || []).forEach(a => {
            acts.push({
              ...a,
              studentName: s.displayName,
              studentId: s.studentId,
              grade: s.grade
            });
          });
        });
        acts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentActivities(acts.slice(0, 7));
      } catch (err) {
        console.error('Error loading teacher overview:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, [gradeFilter]);

  const handleExportRoster = async () => {
    const res = await teacherService.getStudentsList({ gradeFilter, pageSize: 1000 });
    teacherService.exportStudentsToCSV(res.students);
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-teal-900/80 border border-teal-500/40 text-teal-200 text-xs font-bold px-3 py-1 rounded-full">
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <span>Academic Command Center • Classes 5–10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Faculty Monitoring & Student Progress
          </h1>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Monitor real-time hands-on electronics circuit wiring, guided project completions, earned skill badges, and issued credentials across all active school grades.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleExportRoster}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 backdrop-blur-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster CSV</span>
          </button>
          <Link
            to="/teacher/students"
            className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-900 rounded-xl text-xs font-black shadow-md transition-all flex items-center space-x-1.5"
          >
            <span>Manage Students</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Ambient background blur circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Grade Quick Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Curriculum Cohort:</span>
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto pb-1">
          {['all', '5', '6', '7', '8', '9', '10'].map(g => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                gradeFilter === g
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {g === 'all' ? 'All Classes (5–10)' : `Class ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : (summary?.totalStudents ?? 0)}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Enrolled candidates</p>
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Students</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : (summary?.activeStudents ?? 0)}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Active in last 30d</p>
          </div>
        </div>

        {/* Projects Completed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Completed Projects</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : (summary?.projectsCompleted ?? 0)}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Simulations verified</p>
          </div>
        </div>

        {/* Projects In Progress */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : (summary?.projectsInProgress ?? 0)}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Wiring on breadboard</p>
          </div>
        </div>

        {/* Certificates Issued */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Certificates</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : (summary?.totalCertificatesIssued ?? 0)}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Official credentials</p>
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Total Points</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-700">
              {isLoading ? '...' : (summary?.totalPointsEarned ?? 0)}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Earned by students</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Cohort Progress & Recent Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Grade-wise Performance Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Grade Performance Distribution</h2>
              <p className="text-xs text-slate-500">Student enrollment and completion rates across Classes 5 to 10</p>
            </div>
            <Link
              to="/teacher/reports"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {(summary?.gradeDistribution || []).map((gd) => {
              const maxPts = 1200;
              const fillPct = Math.min(100, Math.round((gd.totalPoints / (gd.studentCount * 300 || 1)) * 100));
              return (
                <div key={gd.grade} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">
                        C{gd.grade}
                      </span>
                      <span className="text-slate-800">Class {gd.grade}</span>
                      <span className="text-slate-400 font-normal">({gd.studentCount} students)</span>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-600">
                      <span>{gd.completedProjects} projects done</span>
                      <span className="text-amber-700 font-black">⚡ {gd.totalPoints} pts</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, fillPct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Top Achievers & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top Achievers Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Classroom Top Achievers</span>
              </h3>
              <Link to="/teacher/achievements" className="text-xs font-bold text-teal-600 hover:underline">
                Leaderboard
              </Link>
            </div>

            <div className="space-y-2.5">
              {topAchievers.map((st, idx) => (
                <Link
                  key={st.uid}
                  to={`/teacher/students/${st.uid}`}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-2xl transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-center font-black text-xs text-slate-400 group-hover:text-amber-600">
                      #{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      {st.displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800 group-hover:text-teal-600 transition-colors">
                        {st.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400">Class {st.grade} • {st.studentId}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    ⚡ {st.totalPoints} pts
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Student Activity Stream */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Live Student Activity</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Real-time</span>
            </div>

            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No learning activities recorded yet.
                </div>
              ) : (
                recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-semibold truncate">
                        <strong>{act.studentName}</strong> (Class {act.grade})
                      </p>
                      <p className="text-slate-600 text-[11px] truncate">{act.title}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
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
