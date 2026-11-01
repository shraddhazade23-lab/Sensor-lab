import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services/teacherService.js';
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Users,
  PieChart,
  Zap
} from 'lucide-react';

export const TeacherReportsPage = () => {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getReportsAndAnalyticsData({ gradeFilter, dateRange });
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [gradeFilter, dateRange]);

  const handleExportFullReport = async () => {
    const studentsRes = await teacherService.getStudentsList({ gradeFilter, pageSize: 1000 });
    teacherService.exportStudentsToCSV(studentsRes.students);
  };

  if (isLoading || !analytics) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-semibold">Synthesizing institutional curriculum analytics...</p>
      </div>
    );
  }

  const { projectStats, pointsBuckets, gradeBreakdown, popularProjects, certTimeline, totalStudentsSampled } = analytics;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Academic Performance Visualizations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Curriculum Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real Firebase data visualizations evaluating project completion velocity, score distributions, and grade comparisons.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportFullReport}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Cohort:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
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

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="30d">Last 30 Days</option>
              <option value="term">Current Academic Term</option>
              <option value="all">All Time</option>
            </select>
          </div>

        </div>

        <span className="text-xs font-bold text-slate-400">
          Sampled Population: <strong className="text-slate-800">{totalStudentsSampled}</strong> Students
        </span>
      </div>

      {/* Chart Grid Row 1: Project Completion & Points Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Student Project Completion Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Project Completion Rates</span>
              </h2>
              <p className="text-xs text-slate-500">Percentage of enrolled students who successfully verified the circuit</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Live Verified Data
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {projectStats.map((proj) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 max-w-[280px] truncate" title={proj.fullTitle}>
                    {proj.name}
                  </span>
                  <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                    <span>{proj.completed} of {proj.started} finished</span>
                    <span className="font-black text-slate-900 w-10 text-right">{proj.rate}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      proj.rate >= 75
                        ? 'bg-emerald-500'
                        : proj.rate >= 50
                        ? 'bg-teal-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.max(4, proj.rate)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Points Distribution Histogram (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Points Distribution Histogram</span>
            </h2>
            <p className="text-xs text-slate-500">Student count grouped by cumulative points brackets</p>
          </div>

          {/* Vertical Columns Histogram */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 border-b border-slate-200 pb-2">
            {pointsBuckets.map((bucket, idx) => {
              const maxCount = Math.max(...pointsBuckets.map(b => b.count), 1);
              const heightPct = Math.round((bucket.count / maxCount) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-black text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bucket.count}
                  </span>
                  <div
                    className="w-full rounded-t-xl transition-all duration-700 relative group-hover:brightness-95"
                    style={{
                      height: `${Math.max(12, heightPct)}%`,
                      backgroundColor: bucket.color
                    }}
                  >
                    <div className="absolute top-1 left-0 right-0 text-center text-[10px] font-bold text-white">
                      {bucket.count > 0 ? bucket.count : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Histogram Labels */}
          <div className="flex justify-between gap-2 text-center text-[10px] font-bold text-slate-500 pt-1">
            {pointsBuckets.map((b, i) => (
              <span key={i} className="flex-1 truncate">{b.label}</span>
            ))}
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-500">
            💡 Most middle-school makers average 300–450 points after completing initial sensor and breadboard circuits.
          </div>
        </div>

      </div>

      {/* Chart Grid Row 2: Grade-wise Comparison & Popular Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 3: Grade-Wise Participation & Progress Comparison (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Cross-Grade Progress Comparison</span>
            </h2>
            <p className="text-xs text-slate-500">Comparing average points score and completed labs by grade</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Class Cohort</th>
                  <th className="py-2.5 text-center">Enrolled</th>
                  <th className="py-2.5 text-center">Avg Projects Done</th>
                  <th className="py-2.5 text-center">Average Points</th>
                  <th className="py-2.5 text-right">Performance Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradeBreakdown.map((row) => (
                  <tr key={row.grade} className="hover:bg-slate-50/60">
                    <td className="py-3 font-extrabold text-slate-900">{row.grade}</td>
                    <td className="py-3 text-center text-slate-600 font-semibold">{row.studentCount} students</td>
                    <td className="py-3 text-center font-bold text-teal-700">{row.avgCompletedProjects} / student</td>
                    <td className="py-3 text-center">
                      <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ⚡ {row.avgPoints} pts
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        row.avgPoints >= 450
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.avgPoints >= 250
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.avgPoints >= 450 ? 'Advanced' : row.avgPoints >= 250 ? 'Proficient' : 'Foundational'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart 4: Popular Projects & Certificates Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Most Popular Projects */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Most Popular Laboratory Projects</span>
            </h3>

            <div className="space-y-3">
              {popularProjects.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-5 text-center font-black text-slate-400">#{idx + 1}</span>
                    <span className="font-bold text-slate-800 truncate max-w-[170px]">{p.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900">{p.started} learners</span>
                    <span className="text-emerald-700 block text-[10px] font-bold">({p.rate}% pass rate)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Conferred Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Certificates Conferred Over Time</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              {certTimeline.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-2xl font-black text-indigo-700 block">{item.count}</span>
                  <span className="text-[11px] font-bold text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
