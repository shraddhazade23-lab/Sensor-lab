import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacherService.js';
import {
  Layers,
  Filter,
  Download,
  CheckCircle2,
  Users,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

export const TeacherProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getProjectsMonitoring({
        categoryFilter,
        gradeFilter,
        statusFilter
      });
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects monitoring:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [categoryFilter, gradeFilter, statusFilter]);

  const handleExportCSV = () => {
    teacherService.exportProjectsToCSV(projects);
  };

  const toggleExpand = (id) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 mb-1">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Curriculum Projects Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Electronics Laboratory Projects ({projects.length})
          </h1>
          <p className="text-xs text-slate-500">
            Monitor student adoption, completion metrics, and common troubleshooting patterns across Classes 5 to 10.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5 shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Projects CSV</span>
        </button>
      </div>

      {/* Filter Controls Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Grade Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="all">All Grades (5–10)</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="all">All Topics & Categories</option>
              <option value="Basic Circuits">Basic Circuits</option>
              <option value="Digital Inputs">Digital Inputs</option>
              <option value="Sensors">Sensors & Analog</option>
              <option value="Automation">Automation & Logic</option>
              <option value="PWM">PWM & Controls</option>
              <option value="Microcontrollers">Microcontrollers & Flight</option>
              <option value="Security">Security & Systems</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="all">All Project Statuses</option>
              <option value="Completed">Mostly Completed</option>
              <option value="In Progress">Active In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

        </div>
      </div>

      {/* Projects List Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mx-auto mb-2"></div>
            <span>Calculating project statistics...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            No projects match the selected filters.
          </div>
        ) : (
          projects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Project Header */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                        {proj.thumbnail}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-black text-base text-slate-900 tracking-tight">{proj.title}</h3>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Class {proj.gradeLevels.join(', ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Topic: <strong>{proj.category}</strong> • Difficulty: {proj.difficulty} • Estimated: {proj.estimatedMinutes} mins
                        </p>
                      </div>
                    </div>

                    {/* Project Metrics Pills */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      
                      {/* Started & Completed */}
                      <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200/80 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled</span>
                        <div className="font-extrabold text-slate-900">
                          {proj.startedCount} started • <span className="text-emerald-700">{proj.completedCount} done</span>
                        </div>
                      </div>

                      {/* Completion Rate */}
                      <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200/80 text-center min-w-[100px]">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Completion Rate</span>
                        <span className="font-black text-teal-700 text-sm">{proj.completionRate}%</span>
                      </div>

                      {/* Average Points */}
                      <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200/80 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Points</span>
                        <span className="font-black text-amber-700 text-sm">⚡ {proj.avgPoints}</span>
                      </div>

                      {/* Status */}
                      <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200/80 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          proj.mostCommonStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : proj.mostCommonStatus === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {proj.mostCommonStatus}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/projects/${proj.id}`}
                          className="p-2 text-slate-400 hover:text-teal-600 rounded-xl hover:bg-slate-100 transition-colors"
                          title="Preview student project view"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => toggleExpand(proj.id)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <span>{isExpanded ? 'Hide Students' : `View Students (${proj.enrolledStudents.length})`}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Progress Line */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, proj.completionRate)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Enrolled Students Drawer */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/70 p-6 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Students Working On This Project ({proj.enrolledStudents.length}):
                    </h4>

                    {proj.enrolledStudents.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No students have started this project yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {proj.enrolledStudents.map((st, i) => (
                          <div
                            key={i}
                            className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between"
                          >
                            <div>
                              <Link
                                to={`/teacher/students/${st.uid}`}
                                className="font-bold text-slate-800 hover:text-teal-600 block"
                              >
                                {st.name}
                              </Link>
                              <span className="text-[10px] text-slate-400">Class {st.grade}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              st.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {st.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
