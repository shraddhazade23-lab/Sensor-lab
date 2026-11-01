import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService.js';
import { teacherService } from '../../services/teacherService.js';
import { CertificatePreviewModal } from '../../components/teacher/CertificatePreviewModal.jsx';
import { IssueCertificateModal } from '../../components/teacher/IssueCertificateModal.jsx';
import {
  FileCheck,
  Search,
  Filter,
  Download,
  Printer,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trash2
} from 'lucide-react';

export const TeacherCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [previewCert, setPreviewCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const all = await certificateService.getAllCertificates();
      setCertificates(all);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleExportCSV = () => {
    teacherService.exportCertificatesToCSV(filteredCertificates);
  };

  const handleRevoke = async (certId) => {
    if (window.confirm(`Are you sure you wish to revoke certificate ${certId}?`)) {
      await certificateService.revokeCertificate(certId, 'Faculty administrative action');
      await fetchCertificates();
    }
  };

  // Filtering
  const filteredCertificates = certificates.filter(c => {
    if (gradeFilter !== 'all' && String(c.grade) !== String(gradeFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = c.studentName?.toLowerCase().includes(q);
      const matchId = (c.certificateId || c.id)?.toLowerCase().includes(q);
      const matchTitle = c.title?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 mb-1">
            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Certificates Management ({filteredCertificates.length})
          </h1>
          <p className="text-xs text-slate-500">
            Confer and verify official digital diplomas for Classes 5–10 electronics and robotics milestones.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Confer New Certificate</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV Registry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, certificate ID, or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Class:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
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

        </div>
      </div>

      {/* Certificates Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Certificate ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Certificate Title</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Issue Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-2"></div>
                    <span>Loading certificate records...</span>
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 space-y-2">
                    <p className="font-bold text-slate-700">No certificates found matching your criteria.</p>
                    <p className="text-xs text-slate-400">Certificates are earned as students complete project benchmarks.</p>
                    <button
                      onClick={() => setShowIssueModal(true)}
                      className="px-3 py-1.5 text-xs text-white font-bold bg-teal-600 rounded-lg hover:bg-teal-700"
                    >
                      Issue First Certificate
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => {
                  const isRevoked = cert.status === 'revoked';
                  return (
                    <tr key={cert.certificateId || cert.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Certificate ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-800 text-[11px]">
                        {cert.certificateId || cert.id}
                      </td>

                      {/* Student Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {cert.studentName}
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                          Class {cert.grade}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {cert.title}
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-500 text-[11px]">
                        {cert.formattedIssueDate || new Date(cert.issueDate).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          isRevoked
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {cert.status || 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setPreviewCert(cert)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          {!isRevoked && (
                            <button
                              onClick={() => handleRevoke(cert.certificateId || cert.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Revoke Certificate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
          onCertificateIssued={() => {
            fetchCertificates();
          }}
          onClose={() => setShowIssueModal(false)}
        />
      )}

    </div>
  );
};
