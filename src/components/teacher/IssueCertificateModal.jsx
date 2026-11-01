import React, { useState, useEffect } from 'react';
import { certificateService, CERTIFICATE_DEFINITIONS } from '../../services/certificateService.js';
import { teacherService } from '../../services/teacherService.js';
import { X, Award, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const IssueCertificateModal = ({ student, onCertificateIssued, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState(student || null);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState('foundation-circuits');
  const [eligibilityList, setEligibilityList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      if (!student) {
        const res = await teacherService.getStudentsList({ pageSize: 50 });
        setAllStudents(res.students);
        if (res.students.length > 0 && !selectedStudent) {
          setSelectedStudent(res.students[0]);
        }
      }
    };
    loadStudents();
  }, [student]);

  useEffect(() => {
    if (selectedStudent) {
      const evaluate = async () => {
        const existingCerts = await certificateService.getAllCertificates();
        const evalList = certificateService.evaluateStudentEligibility(
          selectedStudent,
          selectedStudent.progress,
          existingCerts
        );
        setEligibilityList(evalList);

        // Auto-select first eligible and not yet issued
        const firstEligible = evalList.find(e => e.isEligible && !e.alreadyIssued);
        if (firstEligible) {
          setSelectedTypeId(firstEligible.typeId);
        } else if (evalList.length > 0) {
          setSelectedTypeId(evalList[0].typeId);
        }
      };
      evaluate();
    }
  }, [selectedStudent]);

  const currentDef = eligibilityList.find(d => d.typeId === selectedTypeId) || CERTIFICATE_DEFINITIONS[0];

  const handleIssue = async () => {
    if (!selectedStudent || !selectedTypeId) return;
    setErrorMsg('');
    setSuccessMsg('');

    if (currentDef?.alreadyIssued) {
      setErrorMsg('This certificate has already been issued to this student.');
      return;
    }

    setIsSubmitting(true);
    try {
      const issued = await certificateService.issueCertificate({
        studentUid: selectedStudent.uid,
        studentName: selectedStudent.displayName,
        studentId: selectedStudent.studentId,
        grade: selectedStudent.grade,
        typeId: selectedTypeId,
        issuedByTeacherName: 'Dr. Priya Rao',
        issuedByTeacherUid: 'teacher-admin'
      });

      setSuccessMsg(`Successfully issued ${issued.shortTitle}! Certificate ID: ${issued.certificateId}`);
      if (onCertificateIssued) {
        onCertificateIssued(issued);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to issue certificate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Issue Certified Credential</h3>
              <p className="text-[11px] text-slate-500">Criteria-verified digital certificate generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Student Selector if not fixed */}
          {!student && allStudents.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Student
              </label>
              <select
                value={selectedStudent?.uid || ''}
                onChange={(e) => {
                  const s = allStudents.find(item => item.uid === e.target.value);
                  setSelectedStudent(s);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                {allStudents.map(s => (
                  <option key={s.uid} value={s.uid}>
                    {s.displayName} (Class {s.grade} • {s.totalPoints || 0} pts • {s.projectsCompleted || 0} projects)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Student Banner */}
          {selectedStudent && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm ring-2 ring-teal-500/20">
                  {selectedStudent.displayName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{selectedStudent.displayName}</h4>
                  <p className="text-[11px] text-slate-500">
                    ID: {selectedStudent.studentId} • Class {selectedStudent.grade}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block">
                  ⚡ {selectedStudent.totalPoints || selectedStudent.progress?.points || 0} pts
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {selectedStudent.projectsCompleted || Object.values(selectedStudent.progress?.projects || {}).filter(p => p.status === 'completed').length} projects completed
                </p>
              </div>
            </div>
          )}

          {/* Certificate Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Certificate Track
            </label>
            <div className="space-y-2">
              {eligibilityList.map((item) => {
                const isSelected = selectedTypeId === item.typeId;
                return (
                  <div
                    key={item.typeId}
                    onClick={() => setSelectedTypeId(item.typeId)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{item.shortTitle}</span>
                        {item.alreadyIssued ? (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            Already Conferred
                          </span>
                        ) : item.isEligible ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Criteria Satisfied</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Prerequisites Pending
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.category} • Min {item.minPoints} pts • {item.requiredProjectCount} projects
                      </p>
                    </div>

                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 border-slate-300">
                      {isSelected && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Criteria Evaluation Checklist */}
          {currentDef && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Criteria Verification Breakdown
              </h5>
              <div className="space-y-1.5 text-xs">
                {currentDef.satisfiedCriteria?.map((sat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sat}</span>
                  </div>
                ))}
                {currentDef.unmetCriteria?.map((unmet, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-amber-700">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{unmet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleIssue}
            disabled={isSubmitting || currentDef?.alreadyIssued || (!currentDef?.isEligible)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Validating & Issuing...'
                : currentDef?.alreadyIssued
                ? 'Already Issued'
                : !currentDef?.isEligible
                ? 'Prerequisites Not Met'
                : 'Confer Official Certificate'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
