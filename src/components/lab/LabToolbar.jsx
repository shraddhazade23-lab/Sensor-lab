import React from 'react';
import { Play, Square, RotateCcw, Trash2, Save, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useAssistant } from '../../contexts/AssistantContext.jsx';

export const LabToolbar = ({
  project,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  onClearCircuit,
  onOpenSaveModal,
  wireColor,
  setWireColor,
  simulationMode,
  setSimulationMode,
  isMuted = false,
  onToggleMute
}) => {
  const { setIsOpen } = useAssistant();

  const wireColors = [
    { name: 'Red (5V Power)', color: '#ef4444' },
    { name: 'Black (Ground/GND)', color: '#1e293b' },
    { name: 'Yellow (Signal)', color: '#eab308' },
    { name: 'Green (Input)', color: '#22c55e' },
    { name: 'Blue (Analog)', color: '#3b82f6' },
    { name: 'Teal', color: '#14b8a6' }
  ];

  return (
    <div className="bg-slate-800 text-white border-b border-slate-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      
      {/* Project or Lab Name & Simulation Mode */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-extrabold text-sm tracking-tight text-white">
            {project ? project.title : 'Virtual Electronics Lab'}
          </span>
        </div>

        {/* Mode Selector */}
        <select
          value={simulationMode}
          onChange={(e) => setSimulationMode(e.target.value)}
          className="bg-slate-700 text-slate-200 border border-slate-600 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-teal-400 outline-none"
        >
          <option value="led-circuit">Mode: Basic LED Circuit</option>
          <option value="blinking-led">Mode: Blinking LED (Repeated Blink)</option>
          <option value="button-led">Mode: Push Button Control</option>
          <option value="buzzer-alarm">Mode: Piezo Buzzer Sound Alarm</option>
          <option value="ldr-sensor">Mode: LDR Ambient Light Sensor</option>
          <option value="auto-nightlight">Mode: Smart Night Light (Threshold)</option>
          <option value="pwm-brightness">Mode: PWM LED Brightness Control</option>
        </select>
      </div>

      {/* Center: Run / Stop / Reset Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSimulation}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all ${
            isSimulating
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          {isSimulating ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isSimulating ? 'Stop Simulation' : 'Run Simulation'}</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition-colors"
          title="Reset Simulation State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Right: Wire Color & Actions */}
      <div className="flex items-center space-x-3">
        {/* Wire Color Picker */}
        <div className="flex items-center space-x-1.5 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-mono mr-1 hidden sm:inline">Wire:</span>
          {wireColors.map((wc) => (
            <button
              key={wc.color}
              onClick={() => setWireColor(wc.color)}
              title={wc.name}
              className={`w-4 h-4 rounded-full border transition-transform ${
                wireColor === wc.color ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: wc.color, borderColor: '#475569' }}
            />
          ))}
        </div>

        {/* Audio Mute / Unmute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-1"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
        </button>

        {/* Clear Circuit */}
        <button
          onClick={onClearCircuit}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
          title="Clear Entire Circuit"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Save to Account */}
        <button
          onClick={onOpenSaveModal}
          className="flex items-center space-x-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
          title="Save Circuit to Your Profile"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        {/* Ask Sparky AI button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
          title="Ask Sparky for circuit advice"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>

    </div>
  );
};
