import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teacherService } from '../../services/teacherService.js';
import { CertificatePreviewModal } from '../../components/teacher/CertificatePreviewModal.jsx';
import { IssueCertificateModal } from '../../components/teacher/IssueCertificateModal.jsx';
import {
  ArrowLeft,
  Users,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck,
  Calendar,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const TeacherStudentDetailPage = () => {
  const { studentId } = useParams();
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getStudentDetails(studentId);
      setDetails(data);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-semibold">Loading student profile & lab records...</p>
      </div>
    );
  }

  if (!details || !details.student) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
        <p className="text-base font-bold text-slate-800">Student Record Not Found</p>
        <p className="text-xs text-slate-500">The requested student could not be located in your authorized roster.</p>
        <Link
          to="/teacher/students"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Roster</span>
        </Link>
      </div>
    );
  }

  const { student, projectActivities, certificates, overallProgressPercent } = details;
  const recentActivities = student.progress?.activities || [];

  return (
    <div className="space-y-8">
      
      {/* Back Link & Quick Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/teacher/students"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Roster</span>
        </Link>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
        >
          <Award className="w-4 h-4" />
          <span>Confer Certificate</span>
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-teal-500/20">
              {student.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{student.displayName}</h1>
                <span className="bg-teal-50 text-teal-700 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-teal-200">
                  Class {student.grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Student ID: <span className="font-mono text-slate-700 font-bold">{student.studentId}</span> • {student.email || 'No email registered'}
              </p>
              <p className="text-[11px] text-slate-400">
                Institution: {student.institution || 'Greenwood STEM Academy'} • Enrolled on {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Points</span>
            <span className="text-3xl font-black text-amber-700">⚡ {student.totalPoints || 0}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Last active: {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'Recent'}
            </p>
          </div>
        </div>

        {/* Overall Progress Journey Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider">
              Overall Class {student.grade} Curriculum Progress
            </span>
            <span className="font-black text-teal-700">{overallProgressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(5, overallProgressPercent)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xl font-black text-slate-900 block">{student.projectsStarted || 0}</span>
            <span className="text-[11px] font-bold text-slate-500">Projects Started</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xl font-black text-teal-700 block">{student.projectsCompleted || 0}</span>
            <span className="text-[11px] font-bold text-slate-500">Projects Completed</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xl font-black text-amber-700 block">{student.badgesCount || 0}</span>
            <span className="text-[11px] font-bold text-slate-500">Badges Unlocked</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-xl font-black text-indigo-700 block">{certificates.length}</span>
            <span className="text-[11px] font-bold text-slate-500">Certificates Earned</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center col-span-2 sm:col-span-1">
            <span className="text-xl font-black text-emerald-700 block">{student.learningStatus || 'Active'}</span>
            <span className="text-[11px] font-bold text-slate-500">Learning Status</span>
          </div>
        </div>
      </div>

      {/* Projects Activity Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Project Activity & Simulation Progress</h2>
          <p className="text-xs text-slate-500">
            All curriculum projects attempted, objectives satisfied, and simulation test results for this student.
          </p>
        </div>

        <div className="space-y-4">
          {projectActivities.map((proj) => {
            const isCompleted = proj.status === 'Completed';
            const isInProgress = proj.status === 'In Progress';
            return (
              <div
                key={proj.projectId}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-white border-emerald-300 shadow-2xs'
                    : isInProgress
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                      {proj.thumbnail || '⚡'}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{proj.title}</h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Topic: {proj.category} • Target: Class {proj.gradeLevels.join(', ')} • {proj.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      ⚡ +{proj.pointsEarned} pts
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 space-x-2">
                      {proj.startDate && <span>Started: {new Date(proj.startDate).toLocaleDateString()}</span>}
                      {proj.completionDate && <span className="text-emerald-700 font-bold">• Finished: {new Date(proj.completionDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>

                {/* Learning Objectives Checklist */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Demonstrated Learning Objectives:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {proj.allObjectives.map((obj, i) => {
                      const completed = proj.objectivesCompleted.includes(obj) || isCompleted;
                      return (
                        <div key={i} className={`flex items-start space-x-2 ${completed ? 'text-slate-800' : 'text-slate-400'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${completed ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span className="text-[11px]">{obj}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Certificates & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Issued Certificates (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span>Conferred Certificates ({certificates.length})</span>
            </h3>
            <button
              onClick={() => setShowIssueModal(true)}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              + Issue Another
            </button>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="font-semibold text-slate-600">No certificates issued yet.</p>
              <p className="text-[11px]">When the student satisfies prerequisite criteria, you can confer an official credential.</p>
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs"
              >
                Check Criteria & Issue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.certificateId || cert.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-900">{cert.title}</h4>
                    <p className="font-mono text-[10px] text-slate-400">{cert.certificateId || cert.id}</p>
                    <p className="text-[10px] text-slate-500">Conferred on {new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center space-x-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Learning Activities Stream (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>Recent Activity Stream</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Live Logs</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80">
              No recent activity records available.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs pb-2 border-b border-slate-100 last:border-b-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{act.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <CertificatePreviewModal
          certificate={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}

      {/* Issue Certificate Modal */}
      {showIssueModal && (
        <IssueCertificateModal
          student={student}
          onCertificateIssued={() => {
            fetchStudentData();
          }}
          onClose={() => setShowIssueModal(false)}
        />
      )}

    </div>
  );
};
