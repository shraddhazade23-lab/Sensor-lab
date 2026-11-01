import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Cpu, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

const AVATARS = [
  { id: 'bot-1', label: 'Circuit Bot', emoji: '🤖', bg: 'bg-teal-100 border-teal-300' },
  { id: 'bot-2', label: 'Volt Fox', emoji: '🦊', bg: 'bg-amber-100 border-amber-300' },
  { id: 'bot-3', label: 'Astro Spark', emoji: '🚀', bg: 'bg-indigo-100 border-indigo-300' },
  { id: 'bot-4', label: 'Lab Owl', emoji: '🦉', bg: 'bg-emerald-100 border-emerald-300' }
];

export const OnboardingPage = () => {
  const { userProfile, updateProfileData } = useAuth();
  const navigate = useNavigate();

  const [selectedGrade, setSelectedGrade] = useState(userProfile?.grade || 5);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatarId || 'bot-1');
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async () => {
    setIsSaving(true);
    await updateProfileData({
      grade: Number(selectedGrade),
      avatarId: selectedAvatar,
      onboardingCompleted: true
    });
    setIsSaving(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Welcome to SensorLab!</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Let's Personalize Your Electronics Lab
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Choose your grade level and favourite avatar so we can recommend the right lessons and projects for you.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-8">
        
        {/* Step 1: Select Grade */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            <span>Confirm Your Class</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { grade: 5, label: 'Class 5', title: 'Beginner Electronics', desc: 'LEDs, Resistors & Circuit Loops' },
              { grade: 6, label: 'Class 6', title: 'Sensors & Arduino', desc: 'LDRs, Light Sensors & Microcontrollers' },
              { grade: 7, label: 'Class 7', title: 'Smart Systems', desc: 'Analog vs Digital, PWM & Automation' }
            ].map((item) => (
              <div
                key={item.grade}
                onClick={() => setSelectedGrade(item.grade)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedGrade === item.grade
                    ? 'border-teal-600 bg-teal-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-sm text-slate-900">{item.label}</span>
                  {selectedGrade === item.grade && (
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="font-bold text-xs text-teal-700">{item.title}</p>
                <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Choose Avatar */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Choose Your Lab Mascot</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {AVATARS.map((av) => (
              <div
                key={av.id}
                onClick={() => setSelectedAvatar(av.id)}
                className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                  selectedAvatar === av.id
                    ? 'border-teal-600 bg-teal-50/60 shadow-sm scale-102'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 border ${av.bg}`}>
                  {av.emoji}
                </div>
                <span className="font-bold text-xs text-slate-800">{av.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Brief Lab Tour */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Virtual Lab Golden Rules</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Electricity always flows in a <strong>closed loop</strong> from power (5V) back to Ground (GND).</li>
            <li>Always protect sensitive LEDs with a <strong>220Ω resistor</strong>.</li>
            <li>Click <strong>Ask Sparky AI</strong> anytime you get stuck on a wiring step!</li>
          </ul>
        </div>

        {/* Finish Button */}
        <button
          onClick={handleComplete}
          disabled={isSaving}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all hover:shadow-xl"
        >
          <span>{isSaving ? 'Setting Up...' : 'Enter My Virtual Lab'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
