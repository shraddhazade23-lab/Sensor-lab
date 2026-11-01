import React from 'react';
import { COMPONENT_DEFINITIONS } from '../../simulator/componentDefinitions.js';
import { Trash2, AlertTriangle, CheckCircle2, Info, Sliders, Sun, Zap, Activity, Volume2 } from 'lucide-react';

export const PropertiesPanel = ({
  circuit,
  selectedComponentId,
  selectedConnectionId,
  onUpdateComponentProperties,
  onRemoveComponent,
  onRemoveConnection,
  simulationMode,
  setSimulationMode,
  inputs,
  onUpdateInput,
  outputs,
  validationResult,
  logs,
  onClearLogs
}) => {
  const selectedComp = circuit.components.find(c => c.id === selectedComponentId);
  const selectedWire = circuit.connections.find(w => w.id === selectedConnectionId);
  const def = selectedComp ? COMPONENT_DEFINITIONS[selectedComp.type] : null;

  return (
    <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 overflow-y-auto">
      
      {/* Simulation Honesty Disclaimer */}
      <div className="bg-slate-900 text-slate-300 px-3.5 py-2 text-[11px] font-mono flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-1.5 text-teal-400">
          <Zap className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wider">SOFTWARE SIMULATION</span>
        </div>
        <span className="text-[10px] text-slate-400">Middle School Lab</span>
      </div>

      {/* Selected Item Inspector */}
      {(selectedComp || selectedWire) ? (
        <div className="p-4 border-b border-slate-200 bg-teal-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>{selectedComp ? selectedComp.label : 'Selected Wire'}</span>
            </span>
            <button
              onClick={() => {
                if (selectedComp) onRemoveComponent(selectedComp.id);
                if (selectedWire) onRemoveConnection(selectedWire.id);
              }}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded flex items-center space-x-1"
              title="Delete from circuit"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          {/* Configurable component properties */}
          {selectedComp && (
            <div className="space-y-2.5 text-xs text-slate-600">
              {selectedComp.type === 'led' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">LED Color</label>
                  <div className="flex space-x-2">
                    {['red', 'green', 'blue', 'yellow'].map((col) => (
                      <button
                        key={col}
                        onClick={() => onUpdateComponentProperties(selectedComp.id, { color: col })}
                        className={`w-6 h-6 rounded-full border-2 capitalize transition-all ${
                          selectedComp.color === col ? 'ring-2 ring-teal-500 scale-110' : 'opacity-80'
                        }`}
                        style={{
                          backgroundColor:
                            col === 'red' ? '#ef4444' : col === 'green' ? '#22c55e' : col === 'blue' ? '#3b82f6' : '#eab308'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedComp.type === 'resistor' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Resistance Value</label>
                  <select
                    value={selectedComp.resistance || 220}
                    onChange={(e) => onUpdateComponentProperties(selectedComp.id, { resistance: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                  >
                    <option value={220}>220 Ω (LED Guard)</option>
                    <option value={330}>330 Ω (High Brightness Guard)</option>
                    <option value={1000}>1,000 Ω (1 kΩ)</option>
                    <option value={10000}>10,000 Ω (10 kΩ Sensor Divider)</option>
                  </select>
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-tight">
                {def?.description}
              </p>
            </div>
          )}

          {selectedWire && (
            <div className="text-xs text-slate-600 space-y-1">
              <p>Connecting: <span className="font-mono text-slate-800">{selectedWire.fromPinId}</span> ➔ <span className="font-mono text-slate-800">{selectedWire.toPinId}</span></p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 text-center">
          Click any component or wire to inspect properties
        </div>
      )}

      {/* Interactive Simulation Controls */}
      <div className="p-4 border-b border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Controls</span>
          </h4>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
            Mode: {simulationMode.replace('-', ' ')}
          </span>
        </div>

        {/* Ambient Light Slider (LDR / Night light projects) */}
        {(simulationMode === 'ldr-sensor' || simulationMode === 'auto-nightlight') && (
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Ambient Light</span>
              </span>
              <span className="font-mono font-bold text-teal-700">{inputs.ambientLight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.ambientLight}
              onChange={(e) => onUpdateInput('ambientLight', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Night)</span>
              <span>50% (Dusk)</span>
              <span>100% (Sunlight)</span>
            </div>
          </div>
        )}

        {/* Push Button Control */}
        {simulationMode === 'button-led' && (
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-xs font-semibold text-slate-700 block">Push Button Switch</span>
            <button
              onMouseDown={() => onUpdateInput('buttonPressed', true)}
              onMouseUp={() => onUpdateInput('buttonPressed', false)}
              onTouchStart={() => onUpdateInput('buttonPressed', true)}
              onTouchEnd={() => onUpdateInput('buttonPressed', false)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                inputs.buttonPressed
                  ? 'bg-emerald-600 text-white shadow-inner scale-98'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {inputs.buttonPressed ? 'Pressed (Loop Closed)' : 'Click & Hold to Press'}
            </button>
            <p className="text-[10px] text-slate-400">Pressing bridges the circuit contacts</p>
          </div>
        )}

        {/* PWM Duty Slider */}
        {simulationMode === 'pwm-brightness' && (
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">PWM Value (analogWrite)</span>
              <span className="font-mono font-bold text-teal-700">{inputs.pwmValue} / 255</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={inputs.pwmValue}
              onChange={(e) => onUpdateInput('pwmValue', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (0% OFF)</span>
              <span>128 (50% Duty)</span>
              <span>255 (100% Full)</span>
            </div>
          </div>
        )}

        {/* Simulated Output Metrics Display */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">LED Output</span>
            <span className={`text-xs font-bold ${outputs?.ledState ? 'text-emerald-600' : 'text-slate-400'}`}>
              {outputs?.ledState ? 'GLOWING (ON)' : 'DARK (OFF)'}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Simulated Current</span>
            <span className="text-xs font-bold font-mono text-slate-700">
              {outputs?.currentMa ? `${outputs.currentMa.toFixed(1)} mA` : '0.0 mA'}
            </span>
          </div>

          {(simulationMode === 'ldr-sensor' || simulationMode === 'auto-nightlight') && (
            <>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">ADC Pin A0</span>
                <span className="text-xs font-bold font-mono text-teal-700">
                  {outputs?.analogReading || 0} / 1023
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Divider Voltage</span>
                <span className="text-xs font-bold font-mono text-slate-700">
                  {outputs?.sensorVoltage ? `${outputs.sensorVoltage} V` : '0.0 V'}
                </span>
              </div>
            </>
          )}

          {/* Buzzer Metric when buzzer is in circuit */}
          {circuit.components.some(c => c.type === 'buzzer') && (
            <div className="col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between px-3">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Piezo Buzzer:</span>
              <span className={`text-xs font-bold font-mono flex items-center space-x-1 ${outputs?.buzzerState ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>
                <Volume2 className="w-3.5 h-3.5 mr-1" />
                <span>{outputs?.buzzerState ? 'SOUNDING (BEEP)' : 'SILENT (OFF)'}</span>
              </span>
            </div>
          )}
        </div>

        {/* Educational Summary Message */}
        {outputs?.summary && (
          <div className="bg-teal-50/70 border border-teal-200 p-2.5 rounded-xl text-xs text-teal-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Circuit Explanation:</span>
            {outputs.summary}
          </div>
        )}
      </div>

      {/* Validation Feedback */}
      <div className="p-4 border-b border-slate-200 space-y-2">
        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Circuit Health Check</span>
        </h4>

        {validationResult.errors.length > 0 && (
          <div className="space-y-1">
            {validationResult.errors.map((err, i) => (
              <div key={i} className="flex items-start space-x-1.5 text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        {validationResult.warnings.length > 0 && (
          <div className="space-y-1">
            {validationResult.warnings.map((warn, i) => (
              <div key={i} className="flex items-start space-x-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {validationResult.isValid && validationResult.errors.length === 0 && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Circuit structure is valid and ready to simulate!</span>
          </div>
        )}
      </div>

      {/* Live Event Log */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Event Log</h4>
          <button
            onClick={onClearLogs}
            className="text-[10px] text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 bg-slate-900 rounded-xl p-2.5 overflow-y-auto space-y-1.5 max-h-48 font-mono text-[11px]">
          {logs.length === 0 ? (
            <span className="text-slate-500 text-[10px]">No simulation events logged yet.</span>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="text-slate-300 leading-tight">
                <span className="text-teal-400 font-bold">[{log.time}]</span> {log.message}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
