import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { Award, Printer, ShieldCheck, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export const AchievementsPage = () => {
  const { userProfile } = useAuth();
  const { progress, badgesCatalog } = useProgress();

  const studentName = userProfile?.displayName || 'Student Maker';
  const studentGrade = userProfile?.grade || 6;
  const totalPoints = progress.points || 0;
  const earnedBadges = progress.achievements || {};

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `SL-${studentGrade}-${(userProfile?.uid || 'guest').substring(0, 6).toUpperCase()}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 no-print">
        <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Recognition & Rewards</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Badges & Achievement Certificate
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Track your earned badges, review points rules, and print your personalized SensorLab Middle School Electronics Certificate.
        </p>
      </div>

      {/* Points Summary Card */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Total Accumulated Score</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black">{totalPoints}</span>
            <span className="text-sm text-amber-100 font-bold">Learning Points</span>
          </div>
          <p className="text-xs text-amber-100/90 pt-1">
            +50 pts per lesson • +100 pts per completed project • +30 pts per passed quiz • +20 pts per saved circuit
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-3 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Printer className="w-4 h-4 text-amber-700" />
          <span>Print Official Certificate</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4 no-print">
        <h2 className="text-xl font-extrabold text-slate-900">Your Earned Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(badgesCatalog).map((badge) => {
            const isEarned = Boolean(earnedBadges[badge.id]);
            const earnedInfo = earnedBadges[badge.id];

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  isEarned
                    ? 'bg-white border-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200/80 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-amber-50 border border-amber-200 inline-block">
                      {badge.icon}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      isEarned ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isEarned ? 'Unlocked' : 'In Progress'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{badge.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                  {isEarned && earnedInfo?.earnedAt ? (
                    <span className="text-amber-800 font-semibold">
                      Earned on {new Date(earnedInfo.earnedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>Complete required lab activity to unlock</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="space-y-4">
        <div className="flex items-center justify-between no-print">
          <h2 className="text-xl font-extrabold text-slate-900">Printable Achievement Certificate</h2>
          <span className="text-xs text-slate-400">Suitable for School & Project Portfolios</span>
        </div>

        <div className="printable-certificate bg-white border-8 border-teal-800 rounded-3xl p-8 sm:p-14 text-center space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Corner Filigrees */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-teal-600 rounded-tl-xl"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-teal-600 rounded-tr-xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-teal-600 rounded-bl-xl"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-teal-600 rounded-br-xl"></div>

          {/* Certificate Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-teal-700">
              <Cpu className="w-8 h-8" />
              <span className="text-xl font-black tracking-tight">SensorLab Virtual Electronics Lab</span>
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400">
              Middle School Electronics & Sensor Learning Platform
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight pt-2">
              Certificate of Achievement
            </h1>
          </div>

          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            This certificate is proudly awarded to
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-teal-600 max-w-md mx-auto">
            <span className="text-3xl sm:text-4xl font-extrabold text-teal-800 tracking-tight">
              {studentName}
            </span>
          </div>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            for successfully completing middle school virtual laboratory activities in{' '}
            <strong className="text-slate-900">Class {studentGrade} Electronics, Sensors & Microcontroller Systems</strong>,
            demonstrating proficiency in circuit wiring, resistor protection, and simulated sensor automation.
          </p>

          {/* Certificate Metadata Signatures */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-xs max-w-2xl mx-auto border-t border-slate-200">
            <div>
              <p className="font-bold text-slate-800">{currentDate}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Date Awarded</p>
            </div>

            <div>
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-bold flex items-center justify-center text-sm shadow-inner">
                ⚡
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-1">Verified Simulator</p>
            </div>

            <div>
              <p className="font-mono font-bold text-slate-800">{certificateId}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Certificate ID</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic pt-2">
            * This certificate certifies achievement in the SensorLab browser simulation environment. Physical electronics require adult supervision.
          </p>

        </div>
      </div>

    </div>
  );
};
