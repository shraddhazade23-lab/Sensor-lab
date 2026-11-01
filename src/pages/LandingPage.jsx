import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  Cpu,
  Zap,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Play
} from 'lucide-react';

export const LandingPage = () => {
  const { currentUser, loginAsDemoStudent } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    await loginAsDemoStudent(6);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-24 bg-gradient-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Middle School Electronics • Classes 5, 6, & 7</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Explore Electronics. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                  Build Virtual Circuits.
                </span> <br />
                Learn by Doing.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                SensorLab empowers school students to wire virtual breadboards, connect sensors and Arduino boards, simulate real outputs safely in the browser, and learn with an AI lab mentor.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all hover:shadow-xl"
                  >
                    <span>Open Student Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="w-full sm:w-auto px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all hover:shadow-xl"
                    >
                      <span>Start Learning Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={handleQuickDemo}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm flex items-center justify-center space-x-2 transition-all"
                    >
                      <Play className="w-4 h-4 text-teal-600 fill-teal-600" />
                      <span>1-Click Live Demonstration</span>
                    </button>
                  </>
                )}

                <Link
                  to="/lab"
                  className="w-full sm:w-auto px-5 py-3.5 text-slate-700 hover:text-teal-600 font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Launch Virtual Lab</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Safe Virtual Simulation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>No Physical Hardware Needed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>AI Sparky Tutor</span>
                </div>
              </div>
            </div>

            {/* Interactive Workbench Mockup Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-slate-800 text-white overflow-hidden group">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">virtual_circuit_preview</span>
                  </div>
                  <span className="text-[10px] bg-teal-950 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-800">
                    SIMULATION ACTIVE
                  </span>
                </div>

                {/* Circuit Graphic Illustration */}
                <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-800/60 border border-teal-600 flex items-center justify-center text-teal-300">
                        <Cpu className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Arduino Uno R3</p>
                        <p className="text-[10px] font-mono text-teal-400">5V Power Rail: ENERGIZED</p>
                      </div>
                    </div>

                    {/* Glowing LED Illustration */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-10 bg-red-600 rounded-t-full shadow-[0_0_20px_#ef4444] animate-pulse"></div>
                      <span className="text-[9px] font-mono text-amber-300 mt-1">LED GLOWING</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                    <p className="text-teal-400">⚡ Path: Arduino 5V ➔ 220Ω Resistor ➔ Red LED ➔ GND</p>
                    <p className="text-emerald-400">✓ Current: 14.5 mA (Safe operation)</p>
                    <p className="text-slate-400">✓ Polarity: Anode (+) connected forward</p>
                  </div>

                  <Link
                    to="/lab/proj-simple-led"
                    className="w-full block py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-center font-bold text-xs rounded-xl transition-colors"
                  >
                    Try This LED Circuit in Virtual Lab
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Educational Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Everything Middle Schoolers Need to Master Electronics
          </h2>
          <p className="text-base text-slate-600">
            Designed specifically for students in Classes 5, 6, and 7 to move from fundamental concepts to smart sensor automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-900">Virtual Breadboard Lab</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag and drop authentic Arduino boards, LEDs, resistors, push buttons, and LDR light sensors. Connect wires with snap terminals and test without hardware risk.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              📡
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sensors & Microcontrollers</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Understand how sensors translate real-world physical light and temperature into digital and analog values, and how microcontrollers make autonomous decisions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
              🤖
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sparky AI Lab Companion</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Integrated with Firebase AI Logic and Gemini to offer friendly, age-appropriate answers, step-by-step circuit debugging hints, and concept analogies.
            </p>
          </div>

        </div>
      </section>

      {/* How it Works 5-Step Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How Learning Works on SensorLab</h2>
            <p className="text-sm text-teal-200">A clear, fun, 5-step journey designed for school students.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Choose Your Class', desc: 'Curriculum calibrated for Class 5, 6, or 7' },
              { step: '02', title: 'Learn a Concept', desc: 'Read friendly lessons with water analogies' },
              { step: '03', title: 'Build in Virtual Lab', desc: 'Wire the components on your breadboard' },
              { step: '04', title: 'Run Simulation', desc: 'Observe real simulated light and metrics' },
              { step: '05', title: 'Earn Badges', desc: 'Pass quizzes and unlock printable certificates' }
            ].map((s) => (
              <div key={s.step} className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2 backdrop-blur-xs">
                <span className="text-2xl font-black text-teal-300 font-mono">{s.step}</span>
                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Class Pathways Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore by Grade Level</h2>
          <p className="text-sm text-slate-600 mt-1">Select your class to start with age-appropriate fundamentals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              grade: 'Class 5',
              title: 'Introduction to Electronics',
              desc: 'Voltage, Current, Closed Loops, LEDs, and Resistors.',
              color: 'border-emerald-200 bg-emerald-50/50',
              badge: 'Beginner',
              link: '/learn'
            },
            {
              grade: 'Class 6',
              title: 'Sensors & Microcontrollers',
              desc: 'How LDR sensors see light, Arduino Uno pin anatomy, inputs and outputs.',
              color: 'border-teal-200 bg-teal-50/50',
              badge: 'Intermediate',
              link: '/learn'
            },
            {
              grade: 'Class 7',
              title: 'Smart Systems & Automation',
              desc: 'Analog vs Digital, PWM LED dimming, and threshold-based automatic night lamps.',
              color: 'border-indigo-200 bg-indigo-50/50',
              badge: 'Advanced Middle',
              link: '/learn'
            }
          ].map((c) => (
            <div key={c.grade} className={`rounded-2xl p-6 border ${c.color} flex flex-col justify-between space-y-4`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-teal-800">{c.grade}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white border border-slate-200">
                    {c.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
              </div>

              <Link
                to={c.link}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 text-center transition-colors shadow-2xs"
              >
                View Lessons
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
