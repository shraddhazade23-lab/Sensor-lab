import React, { useState, useRef, useEffect } from 'react';
import { COMPONENT_DEFINITIONS } from '../../simulator/componentDefinitions.js';

export const CircuitCanvas = ({
  circuit,
  onUpdateComponentPosition,
  onSelectComponent,
  selectedComponentId,
  onAddConnection,
  onSelectConnection,
  selectedConnectionId,
  onRemoveConnection,
  outputs,
  wireColor = '#ef4444'
}) => {
  const containerRef = useRef(null);
  const [draggingCompId, setDraggingCompId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Click-to-connect wiring state
  const [wiringStart, setWiringStart] = useState(null); // { componentId, pinId, pinLabel, compName, x, y }
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Cancel connection on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setWiringStart(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getCanvasCoordinates = (e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Dragging handling
  const handleMouseDownComponent = (e, comp) => {
    e.stopPropagation();
    onSelectComponent(comp.id);
    const coords = getCanvasCoordinates(e);
    setDraggingCompId(comp.id);
    setDragOffset({
      x: coords.x - comp.x,
      y: coords.y - comp.y
    });
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoordinates(e);
    setCursorPos(coords);

    if (draggingCompId) {
      const newX = Math.max(10, Math.min(1200, coords.x - dragOffset.x));
      const newY = Math.max(10, Math.min(800, coords.y - dragOffset.y));
      onUpdateComponentPosition(draggingCompId, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
  };

  // Click-to-connect pin interaction (Mouse and Touch)
  const handlePinClick = (e, componentId, pin) => {
    e.stopPropagation();
    const comp = circuit.components.find(c => c.id === componentId);
    if (!comp) return;

    const pinAbsX = comp.x + pin.x;
    const pinAbsY = comp.y + pin.y;

    if (!wiringStart) {
      // Step 1: Select start pin
      setWiringStart({
        componentId,
        pinId: pin.id,
        pinLabel: pin.label,
        compName: comp.label,
        x: pinAbsX,
        y: pinAbsY
      });
    } else {
      // Step 2: Complete wire to second pin
      // Deselect if clicking the same pin
      if (wiringStart.componentId === componentId && wiringStart.pinId === pin.id) {
        setWiringStart(null);
        return;
      }

      // Check if connection already exists
      const alreadyExists = circuit.connections.some(w =>
        (w.fromComponentId === wiringStart.componentId && w.fromPinId === wiringStart.pinId && w.toComponentId === componentId && w.toPinId === pin.id) ||
        (w.fromComponentId === componentId && w.fromPinId === pin.id && w.toComponentId === wiringStart.componentId && w.toPinId === wiringStart.pinId)
      );

      if (!alreadyExists) {
        onAddConnection(
          wiringStart.componentId,
          wiringStart.pinId,
          componentId,
          pin.id,
          wireColor
        );
      }
      setWiringStart(null);
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === containerRef.current || e.target.tagName === 'svg') {
      onSelectComponent(null);
      onSelectConnection(null);
      setWiringStart(null);
    }
  };

  // Helper to get absolute coordinates of any pin in the circuit
  const getPinAbsoluteCoords = (componentId, pinId) => {
    const comp = circuit.components.find(c => c.id === componentId);
    if (!comp) return { x: 0, y: 0 };
    const def = COMPONENT_DEFINITIONS[comp.type];
    if (!def) return { x: comp.x, y: comp.y };
    const pin = def.pins.find(p => p.id === pinId);
    if (!pin) return { x: comp.x, y: comp.y };
    return {
      x: comp.x + pin.x,
      y: comp.y + pin.y
    };
  };

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      className="relative flex-1 h-full min-h-[550px] bg-slate-900 overflow-auto select-none cursor-default"
      style={{
        backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      
      {/* Workbench Status / Wiring Guidance Banner */}
      <div className="absolute top-3 left-4 z-30 flex items-center space-x-2">
        {wiringStart ? (
          <div className="flex items-center space-x-2 bg-amber-950/90 text-amber-200 px-3 py-1.5 rounded-lg border border-amber-500/60 shadow-lg backdrop-blur-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-mono font-medium">
              1st Pin: <strong className="text-white">{wiringStart.compName} ({wiringStart.pinLabel})</strong> ➔ Click second pin to attach wire
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setWiringStart(null);
              }}
              className="ml-2 px-2 py-0.5 bg-amber-700 hover:bg-amber-600 text-white text-[11px] font-bold rounded shadow-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/80 backdrop-blur-xs">
            Click any pin to connect wires
          </span>
        )}
      </div>

      {/* SVG Layer for Wires */}
      <svg className="absolute inset-0 w-[2000px] h-[1200px] pointer-events-none z-20">
        <defs>
          <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Established Wires */}
        {circuit.connections.map((wire) => {
          const start = getPinAbsoluteCoords(wire.fromComponentId, wire.fromPinId);
          const end = getPinAbsoluteCoords(wire.toComponentId, wire.toPinId);
          const isSelected = selectedConnectionId === wire.id;

          // Compute smooth curved bezier path
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const cx1 = start.x + dx * 0.25;
          const cy1 = start.y + dy * 0.1 + Math.min(Math.abs(dx) * 0.3, 50);
          const cx2 = start.x + dx * 0.75;
          const cy2 = end.y - dy * 0.1 + Math.min(Math.abs(dx) * 0.3, 50);

          const midX = (start.x + end.x) / 2;
          const midY = (cy1 + cy2) / 2;

          const pathD = `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;

          return (
            <g
              key={wire.id}
              className="pointer-events-auto cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onSelectConnection(wire.id);
              }}
            >
              {/* Outer stroke for selection */}
              {isSelected && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              )}
              {/* Base shadow wire */}
              <path
                d={pathD}
                fill="none"
                stroke="#020617"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Core colored wire */}
              <path
                d={pathD}
                fill="none"
                stroke={wire.color || '#2dd4bf'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Start and end terminal nodes */}
              <circle cx={start.x} cy={start.y} r="3.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx={end.x} cy={end.y} r="3.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />

              {/* Delete button when wire is selected */}
              {isSelected && onRemoveConnection && (
                <g
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveConnection(wire.id);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    onRemoveConnection(wire.id);
                  }}
                >
                  <circle cx={midX} cy={midY} r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text x={midX} y={midY + 3.5} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">✕</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Active In-Progress Wire following cursor */}
        {wiringStart && (
          <path
            d={`M ${wiringStart.x} ${wiringStart.y} Q ${(wiringStart.x + cursorPos.x) / 2} ${(wiringStart.y + cursorPos.y) / 2 + 30} ${cursorPos.x} ${cursorPos.y}`}
            fill="none"
            stroke={wireColor}
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Render Component Instances */}
      <div className="absolute inset-0 w-[2000px] h-[1200px] z-10 pointer-events-none">
        {circuit.components.map((comp) => {
          const def = COMPONENT_DEFINITIONS[comp.type];
          if (!def) return null;
          const isSelected = selectedComponentId === comp.id;

          return (
            <div
              key={comp.id}
              onMouseDown={(e) => handleMouseDownComponent(e, comp)}
              onTouchStart={(e) => handleMouseDownComponent(e, comp)}
              style={{
                left: `${comp.x}px`,
                top: `${comp.y}px`,
                width: `${def.width}px`,
                height: `${def.height}px`,
              }}
              className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing rounded-xl transition-shadow ${
                isSelected ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-900 shadow-xl' : ''
              }`}
            >
              {/* Component Specific Visual Representation */}
              {renderComponentVisual(comp, def, outputs)}

              {/* Component Connection Pins (Click-To-Connect with Touch Support) */}
              {def.pins.map((pin) => {
                const isPinWiringStart = wiringStart?.componentId === comp.id && wiringStart?.pinId === pin.id;
                return (
                  <div
                    key={pin.id}
                    onClick={(e) => handlePinClick(e, comp.id, pin)}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      handlePinClick(e, comp.id, pin);
                    }}
                    style={{
                      left: `${pin.x}px`,
                      top: `${pin.y}px`,
                    }}
                    title={`${pin.label} (${comp.label})`}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer z-30 transition-transform ${
                      isPinWiringStart ? 'scale-125 ring-4 ring-amber-400 bg-amber-400/40 z-40' : 'hover:scale-125'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border border-slate-900 shadow-xs transition-transform ${
                        isPinWiringStart ? 'bg-amber-400 ring-2 ring-white scale-125' : ''
                      }`}
                      style={{ backgroundColor: isPinWiringStart ? '#fbbf24' : (pin.color || '#3b82f6') }}
                    />
                    {/* Tooltip on pin hover or when selected */}
                    <div className={`${isPinWiringStart ? 'block' : 'hidden group-hover:block'} absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50 border border-slate-700 pointer-events-none`}>
                      {isPinWiringStart ? `Selected: ${pin.label} (Click 2nd pin)` : pin.label}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

    </div>
  );
};

// Render original high-fidelity SVG/HTML components
function renderComponentVisual(comp, def, outputs) {
  switch (comp.type) {
    case 'arduino': {
      return (
        <div className="w-full h-full bg-[#006468] border-2 border-[#004f52] rounded-xl shadow-2xl relative p-3 text-white overflow-hidden select-none">
          {/* Header silk screen */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider opacity-90 border-b border-teal-800 pb-1">
            <span className="font-bold text-amber-300">ARDUINO</span>
            <span className="text-[9px] text-teal-200">UNO R3</span>
          </div>

          {/* USB Port & Power Jack */}
          <div className="absolute left-[-4px] top-6 w-7 h-9 bg-slate-300 border border-slate-400 rounded-r shadow-inner flex items-center justify-center">
            <div className="w-4 h-5 bg-slate-600 rounded-xs"></div>
          </div>
          <div className="absolute left-[-4px] bottom-6 w-9 h-8 bg-slate-950 border border-slate-800 rounded-r shadow-md"></div>

          {/* ATmega328P Chip */}
          <div className="absolute left-[90px] top-[70px] w-28 h-10 bg-slate-900 border border-slate-700 rounded-xs flex items-center justify-center shadow-lg">
            <span className="text-[8px] font-mono text-slate-400 tracking-wider">ATMEGA328P</span>
          </div>

          {/* Built-in D13 LED */}
          <div className="absolute right-12 top-10 flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${outputs?.digitalPinStates?.['D13'] || outputs?.ledState ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-700'}`}></div>
            <span className="text-[8px] text-teal-200 font-mono">L</span>
          </div>

          {/* ON Power LED */}
          <div className="absolute right-6 top-10 flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
            <span className="text-[8px] text-teal-200 font-mono">ON</span>
          </div>

          {/* Pin Label Strips */}
          <div className="absolute top-1 left-16 right-3 flex justify-between text-[8px] font-mono text-teal-200">
            <span>D13</span>
            <span>~D11</span>
            <span>~D9</span>
            <span>~D6</span>
            <span>~D3</span>
            <span>D2</span>
          </div>

          <div className="absolute bottom-1 left-14 right-8 flex justify-between text-[8px] font-mono text-teal-200">
            <span className="text-amber-300 font-bold">5V</span>
            <span className="text-slate-300 font-bold">GND</span>
            <span>A0</span>
            <span>A1</span>
            <span>A2</span>
            <span>A3</span>
            <span>A4</span>
          </div>
        </div>
      );
    }

    case 'breadboard': {
      return (
        <div className="w-full h-full bg-[#f8fafc] border-2 border-slate-300 rounded-xl shadow-xl relative p-2 overflow-hidden flex flex-col justify-between">
          {/* Top power bus */}
          <div className="space-y-1 bg-slate-100 p-1 rounded border border-slate-200">
            <div className="flex items-center space-x-1 text-[9px] font-mono">
              <span className="text-red-500 font-bold">+</span>
              <div className="h-0.5 flex-1 bg-red-400/80 rounded"></div>
            </div>
            <div className="flex items-center space-x-1 text-[9px] font-mono">
              <span className="text-blue-500 font-bold">-</span>
              <div className="h-0.5 flex-1 bg-blue-400/80 rounded"></div>
            </div>
          </div>

          {/* Middle terminal rows */}
          <div className="grid grid-rows-5 gap-2 my-1 px-1">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                <span className="font-semibold text-slate-500">{row}</span>
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                </div>
                <div className="w-3 h-0.5 bg-slate-300"></div>
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                </div>
                <span className="font-semibold text-slate-500">{row}</span>
              </div>
            ))}
          </div>

          <div className="text-center text-[9px] font-mono text-slate-400 border-t border-slate-200 pt-1">
            HALF-BREADBOARD (TIE-POINTS)
          </div>
        </div>
      );
    }

    case 'led': {
      const color = comp.color || 'red';
      const isLit = outputs?.ledState;
      const brightnessFactor = outputs?.ledBrightness !== undefined ? (outputs.ledBrightness / 255) : 1;

      const colorMap = {
        red: { body: '#ef4444', glow: 'rgba(239, 68, 68, 0.95)' },
        green: { body: '#22c55e', glow: 'rgba(34, 197, 94, 0.95)' },
        blue: { body: '#3b82f6', glow: 'rgba(59, 130, 246, 0.95)' },
        yellow: { body: '#eab308', glow: 'rgba(234, 179, 8, 0.95)' }
      };

      const c = colorMap[color] || colorMap.red;

      return (
        <div className="w-full h-full flex flex-col items-center justify-between select-none">
          {/* LED Epoxy Bulb with realistic animated glow */}
          <div
            className="w-9 h-11 rounded-t-full border border-slate-700/30 relative flex items-center justify-center transition-all duration-150"
            style={{
              backgroundColor: c.body,
              boxShadow: isLit ? `0 0 ${22 * brightnessFactor}px ${12 * brightnessFactor}px ${c.glow}` : 'none',
              opacity: isLit ? 1 : 0.65
            }}
          >
            {/* Specular reflection */}
            <div className="w-2.5 h-4 bg-white/40 rounded-full absolute top-1.5 left-2 -rotate-12"></div>
          </div>
          {/* Flat rim indicator for cathode */}
          <div className="w-10 h-1.5 bg-slate-400 rounded-xs"></div>
          <div className="text-[9px] font-mono text-slate-300 capitalize">{color} LED</div>
        </div>
      );
    }

    case 'resistor': {
      const resVal = comp.resistance || 220;
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-14 h-6 bg-[#d2b48c] border border-[#b89778] rounded-full relative flex items-center justify-around px-2 shadow-md">
            {/* Color bands */}
            {resVal === 10000 ? (
              <>
                <div className="w-1 h-5 bg-[#8b4513]"></div>
                <div className="w-1 h-5 bg-black"></div>
                <div className="w-1 h-5 bg-[#ff8c00]"></div>
                <div className="w-1 h-5 bg-[#ffd700]"></div>
              </>
            ) : (
              <>
                <div className="w-1 h-5 bg-red-600"></div>
                <div className="w-1 h-5 bg-red-600"></div>
                <div className="w-1 h-5 bg-[#8b4513]"></div>
                <div className="w-1 h-5 bg-[#ffd700]"></div>
              </>
            )}
          </div>
          <span className="absolute -bottom-4 text-[9px] font-mono text-slate-300 font-bold whitespace-nowrap">
            {resVal >= 1000 ? `${resVal / 1000}kΩ` : `${resVal}Ω`}
          </span>
        </div>
      );
    }

    case 'button': {
      return (
        <div className="w-full h-full bg-slate-800 border-2 border-slate-600 rounded-lg p-1.5 flex flex-col items-center justify-center shadow-lg">
          <div className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 border-2 border-slate-900 shadow-inner flex items-center justify-center cursor-pointer transition-transform">
            <div className="w-4 h-4 rounded-full bg-red-700/50"></div>
          </div>
          <span className="text-[8px] font-mono text-slate-300 mt-1">PUSH</span>
        </div>
      );
    }

    case 'ldr': {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#fde047] border-2 border-[#ca8a04] p-1 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[#b45309] fill-none stroke-2">
              <path d="M4 12h3l2-6 4 12 2-6h3" />
            </svg>
          </div>
          <span className="text-[8px] font-mono text-slate-300 mt-1">LDR SENSOR</span>
        </div>
      );
    }

    case 'potentiometer': {
      return (
        <div className="w-full h-full bg-slate-700 border border-slate-500 rounded-full p-2 flex items-center justify-center shadow-lg">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center relative">
            <div className="w-1 h-3 bg-teal-400 absolute top-1 rounded-full"></div>
          </div>
        </div>
      );
    }

    case 'buzzer': {
      const isSounding = outputs?.buzzerState;
      return (
        <div className="w-full h-full bg-slate-900 border-2 border-slate-700 rounded-full flex flex-col items-center justify-center text-white shadow-xl relative">
          <div className={`w-4 h-4 rounded-full transition-all ${isSounding ? 'bg-amber-400 border border-amber-300 shadow-[0_0_10px_#f59e0b]' : 'bg-black border border-slate-700'}`}></div>
          <span className="text-[8px] font-mono text-slate-400 mt-1">BUZZER</span>
        </div>
      );
    }

    case 'temperature': {
      return (
        <div className="w-full h-full flex flex-col items-center justify-start select-none relative">
          <div className="w-11 h-10 rounded-t-full border-2 border-slate-600 bg-slate-800 flex flex-col items-center justify-center p-1 relative shadow-lg">
            <span className="text-[8px] font-mono font-bold text-amber-300">TMP36</span>
          </div>
          <div className="w-9 flex justify-between px-0.5 mt-0.5">
            <div className="w-1 h-3.5 bg-slate-400 rounded-b"></div>
            <div className="w-1 h-3.5 bg-slate-400 rounded-b"></div>
            <div className="w-1 h-3.5 bg-slate-400 rounded-b"></div>
          </div>
          <div className="flex justify-between w-full px-1 text-[7px] font-mono text-slate-400">
            <span className="text-red-400">5V</span>
            <span className="text-blue-400">OUT</span>
            <span className="text-slate-400">GND</span>
          </div>
        </div>
      );
    }

    case 'soilMoisture': {
      return (
        <div className="w-full h-full flex flex-col items-center justify-start select-none relative">
          <div className="w-14 h-9 rounded-t-lg border-2 border-teal-600 bg-slate-900 p-1 flex flex-col items-center justify-between shadow-md">
            <span className="text-[7px] font-mono font-bold text-teal-400">SOIL PROBE</span>
          </div>
          <div className="w-10 h-8 flex justify-between px-1">
            <div className="w-3 h-full bg-gradient-to-b from-amber-600 to-amber-400 rounded-b border border-amber-700"></div>
            <div className="w-3 h-full bg-gradient-to-b from-amber-600 to-amber-400 rounded-b border border-amber-700"></div>
          </div>
          <div className="flex justify-between w-12 text-[7px] font-mono text-slate-400 mt-0.5">
            <span className="text-red-400">5V</span>
            <span className="text-blue-400">SIG</span>
            <span className="text-slate-400">GND</span>
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="w-full h-full bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs font-mono">
          {comp.label}
        </div>
      );
  }
}
