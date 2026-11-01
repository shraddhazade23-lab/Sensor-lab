import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacherService.js';
import { IssueCertificateModal } from '../../components/teacher/IssueCertificateModal.jsx';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';

export const TeacherStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('points_desc');
  const [isLoading, setIsLoading] = useState(true);

  // Issue Certificate Modal state
  const [certStudent, setCertStudent] = useState(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await teacherService.getStudentsList({
        gradeFilter,
        statusFilter,
        searchQuery,
        sortBy,
        page: currentPage,
        pageSize
      });
      setStudents(res.students);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeFilter, statusFilter, searchQuery, sortBy, currentPage, pageSize]);

  const handleExportCSV = async () => {
    const res = await teacherService.getStudentsList({
      gradeFilter,
      statusFilter,
      searchQuery,
      sortBy,
      page: 1,
      pageSize: 1000
    });
    teacherService.exportStudentsToCSV(res.students);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 mb-1">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Student Management Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Enrolled Students ({totalItems})
          </h1>
          <p className="text-xs text-slate-500">
            Search, filter, evaluate learning progress, and confer certified awards to students across Classes 5 to 10.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCertStudent({})}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Issue Certificate</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, student ID, email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
            />
          </div>

          {/* Grade Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Class:</span>
            <select
              value={gradeFilter}
              onChange={(e) => {
                setGradeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
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

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="all">All Learning Statuses</option>
              <option value="Active">Active Learners</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed Milestones</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="points_desc">Points (Highest First)</option>
              <option value="points_asc">Points (Lowest First)</option>
              <option value="projects_desc">Projects Completed</option>
              <option value="recent_activity">Most Recently Active</option>
              <option value="name_asc">Name (A–Z)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Student Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Student Name & ID</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Email</th>
                <th className="py-3.5 px-4 text-center">Projects (S / C)</th>
                <th className="py-3.5 px-4 text-center">Points</th>
                <th className="py-3.5 px-4 text-center hidden sm:table-cell">Badges</th>
                <th className="py-3.5 px-4 text-center hidden sm:table-cell">Certs</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Last Active</th>
                <th className="py-3.5 px-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mx-auto mb-2"></div>
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 space-y-2">
                    <p className="font-bold text-slate-700">No students match your filter criteria.</p>
                    <p className="text-xs text-slate-400">Try adjusting your search terms or clearing filters.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setGradeFilter('all'); setStatusFilter('all'); }}
                      className="px-3 py-1.5 text-xs text-teal-600 font-bold bg-teal-50 rounded-lg hover:bg-teal-100"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.uid} className="hover:bg-slate-50/60 transition-colors group">
                    
                    {/* Student Name & ID */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/20 shrink-0">
                          {student.displayName ? student.displayName.charAt(0) : 'S'}
                        </div>
                        <div>
                          <Link
                            to={`/teacher/students/${student.uid}`}
                            className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors block leading-tight"
                          >
                            {student.displayName}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400">{student.studentId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Class/Grade */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                        Class {student.grade}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-500 truncate max-w-[140px]">
                      {student.email || 'N/A'}
                    </td>

                    {/* Projects Started & Completed */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <span className="font-bold text-slate-800">{student.projectsStarted || 0}</span>
                        <span className="text-slate-400">/</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {student.projectsCompleted || 0} done
                        </span>
                      </div>
                    </td>

                    {/* Total Points */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full text-xs inline-block">
                        ⚡ {student.totalPoints || 0}
                      </span>
                    </td>

                    {/* Badges Earned */}
                    <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                      <span className="font-semibold text-slate-700">
                        {student.badgesCount || 0} 🏅
                      </span>
                    </td>

                    {/* Certificates Earned */}
                    <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        student.certificatesCount > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-400'
                      }`}>
                        {student.certificatesCount || 0}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-slate-500 text-[11px]">
                      {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setCertStudent(student)}
                          className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                          title="Issue Certificate"
                        >
                          Confer Cert
                        </button>
                        <Link
                          to={`/teacher/students/${student.uid}`}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{students.length}</span> of{' '}
            <span className="font-bold text-slate-800">{totalItems}</span> students
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-600 disabled:opacity-40 hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-600 disabled:opacity-40 hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal to Issue Certificate */}
      {certStudent && (
        <IssueCertificateModal
          student={certStudent.uid ? certStudent : null}
          onCertificateIssued={() => {
            fetchStudents();
          }}
          onClose={() => setCertStudent(null)}
        />
      )}

    </div>
  );
};
