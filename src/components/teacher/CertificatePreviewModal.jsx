import React from 'react';
import { X, Printer, Download, CheckCircle2, Cpu, Award } from 'lucide-react';

export const CertificatePreviewModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Actions Bar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="font-extrabold text-sm text-slate-800">
              Official Credential Preview
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              {certificate.status ? certificate.status.toUpperCase() : 'ISSUED'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-100/60">
          <div className="printable-certificate bg-white border-8 border-teal-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            
            {/* Corner Filigrees */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-teal-600 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-teal-600 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-teal-600 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-teal-600 rounded-br-lg"></div>

            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center space-x-2 text-teal-800">
                <Cpu className="w-7 h-7" />
                <span className="text-lg font-black tracking-tight">SensorLab Middle & High School STEM</span>
              </div>
              <p className="text-[11px] font-mono tracking-widest uppercase text-slate-400">
                Virtual Electronics, Microcontrollers & Sensor Systems Laboratory
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight pt-2">
                {certificate.title || 'Certificate of Achievement'}
              </h1>
            </div>

            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              This certified credential is proudly conferred upon
            </p>

            {/* Student Name */}
            <div className="py-2 border-b-2 border-teal-600 max-w-md mx-auto">
              <span className="text-3xl sm:text-4xl font-extrabold text-teal-800 tracking-tight">
                {certificate.studentName}
              </span>
            </div>

            {/* Student ID & Grade */}
            <p className="text-xs font-semibold text-slate-500">
              Student ID: <span className="font-mono text-slate-800">{certificate.studentId || 'SL-STU-VERIFIED'}</span> • Class {certificate.grade} Candidate
            </p>

            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {certificate.description ||
                `for successfully completing curriculum requirements in Class ${certificate.grade} Virtual Electronics and demonstrating mastery in circuit construction, sensor integration, and microcontroller automated control.`}
            </p>

            {/* Skills checklist */}
            {certificate.skillsDemonstrated && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 max-w-lg mx-auto text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Validated Competencies:
                </p>
                <div className="grid grid-cols-1 gap-1 text-xs text-slate-700">
                  {certificate.skillsDemonstrated.map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signatures and Verification */}
            <div className="pt-6 grid grid-cols-3 gap-4 text-xs max-w-xl mx-auto border-t border-slate-200">
              <div>
                <p className="font-bold text-slate-800">
                  {certificate.formattedIssueDate || new Date(certificate.issueDate).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Date Conferred</p>
              </div>

              <div>
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-bold flex items-center justify-center text-sm shadow-inner">
                  ⚡
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-1">Verified Laboratory</p>
              </div>

              <div>
                <p className="font-mono font-bold text-slate-800 truncate" title={certificate.certificateId || certificate.id}>
                  {certificate.certificateId || certificate.id}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Credential ID</p>
              </div>
            </div>

            <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-center space-x-2">
              <span>Authorized Faculty Signature: <strong>{certificate.issuedBy || 'Faculty Committee'}</strong></span>
              <span>•</span>
              <span className="font-mono">{certificate.verificationHash || 'VERIFIED'}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
