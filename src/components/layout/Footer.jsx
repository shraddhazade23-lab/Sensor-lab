import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Sensor<span className="text-teal-400">Lab</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive sensor learning platform and browser-based virtual electronics laboratory for students in middle school (Classes 5, 6, and 7).
            </p>
            <div className="flex items-center space-x-2 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>College Industrial Demonstration Project</span>
            </div>
          </div>

          {/* Learning Pathways */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Curriculum</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/learn" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Class 5: Intro to Electronics
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Class 6: Sensors & Microcontrollers
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Class 7: Smart Systems & PWM
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-teal-400 transition-colors">
                  All 6 Guided Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Virtual Lab */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Laboratory</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/lab" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Virtual Breadboard & Uno
                </Link>
              </li>
              <li>
                <Link to="/lab/proj-simple-led" className="text-slate-400 hover:text-teal-400 transition-colors">
                  LED & Resistor Circuit
                </Link>
              </li>
              <li>
                <Link to="/lab/proj-button-led" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Push Button Circuit
                </Link>
              </li>
              <li>
                <Link to="/lab/proj-ldr-indicator" className="text-slate-400 hover:text-teal-400 transition-colors">
                  LDR Ambient Sensor Lab
                </Link>
              </li>
              <li>
                <Link to="/lab/proj-auto-nightlight" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Threshold Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Lab Safety Notice</h4>
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Simulation Distinction</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                SensorLab is a pure software simulation designed for learning circuit logic. It does not physically control actual hardware. Always conduct real electronics projects under adult/teacher supervision.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SensorLab. Built with React, Vite, Tailwind CSS & Firebase.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Student Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
