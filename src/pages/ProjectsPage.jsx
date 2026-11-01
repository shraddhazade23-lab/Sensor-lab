import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { projectService } from '../services/projectService.js';
import { Layers, Search, Filter, Clock, CheckCircle2, ArrowRight, Cpu, Sparkles } from 'lucide-react';

export const ProjectsPage = () => {
  const { userProfile } = useAuth();
  const { progress } = useProgress();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await projectService.getProjects({
        grade: selectedGrade === 'all' ? null : Number(selectedGrade),
        difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty,
        search: searchTerm
      });
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, [searchTerm, selectedGrade, selectedDifficulty]);

  // Apply client status filter
  const displayedProjects = projects.filter(p => {
    const isCompleted = progress.projects[p.id]?.status === 'completed';
    if (selectedStatus === 'completed') return isCompleted;
    if (selectedStatus === 'incomplete') return !isCompleted;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hands-on Project Laboratory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Guided Electronics Projects
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Construct real virtual circuits, wire components on the breadboard, and run simulations to see your electronics come alive.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search projects (LED, LDR...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          {/* Grade filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="all">All Classes (5, 6, 7)</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
            </select>
          </div>

          {/* Difficulty filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced middle">Advanced Middle</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="incomplete">Incomplete Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">Loading guided projects...</div>
      ) : displayedProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-700">No projects found matching your filters.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedGrade('all'); setSelectedDifficulty('all'); setSelectedStatus('all'); }}
            className="text-xs text-teal-600 font-bold hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((proj) => {
            const isCompleted = progress.projects[proj.id]?.status === 'completed';

            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-2xl shadow-2xs">
                      {proj.thumbnail}
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {proj.difficulty}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center space-x-1 text-emerald-600 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Finished (+100 pts)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  {/* Components Tag List */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Components Needed:</span>
                    <div className="flex flex-wrap gap-1">
                      {proj.components.map((c, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200/80">
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <Link
                    to={`/projects/${proj.id}`}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition-colors"
                  >
                    Guide & Blueprint
                  </Link>
                  <Link
                    to={`/lab/${proj.id}`}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl text-center shadow-sm shadow-teal-600/20 transition-all flex items-center justify-center space-x-1"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Open Lab</span>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
