import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { useAssistant } from '../contexts/AssistantContext.jsx';
import { projectService } from '../services/projectService.js';
import { COMPONENT_DEFINITIONS } from '../simulator/componentDefinitions.js';
import {
  createInitialCircuit,
  addComponent,
  removeComponent,
  updateComponentPosition,
  updateComponentProperties,
  createConnection,
  removeConnection
} from '../simulator/circuitModel.js';
import { validateCircuit } from '../simulator/circuitValidator.js';
import { SimulationEngine } from '../simulator/simulationEngine.js';
import { audioManager } from '../simulator/audioManager.js';

import { ComponentPalette } from '../components/lab/ComponentPalette.jsx';
import { CircuitCanvas } from '../components/lab/CircuitCanvas.jsx';
import { PropertiesPanel } from '../components/lab/PropertiesPanel.jsx';
import { LabToolbar } from '../components/lab/LabToolbar.jsx';
import { SaveCircuitModal } from '../components/lab/SaveCircuitModal.jsx';

export const VirtualLabPage = () => {
  const { projectId } = useParams();
  const { saveCircuitToAccount, markProjectDone } = useProgress();
  const { updateAssistantContext } = useAssistant();

  const [project, setProject] = useState(null);
  const [circuit, setCircuit] = useState(createInitialCircuit());
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [wireColor, setWireColor] = useState('#ef4444'); // Default red power wire
  const [isMuted, setIsMuted] = useState(false);

  // Simulation mode
  const [simulationMode, setSimulationMode] = useState('led-circuit');
  const [isSimulating, setIsSimulating] = useState(false);
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);

  // Simulation inputs
  const [simInputs, setSimInputs] = useState({
    ambientLight: 70, // 0 - 100%
    temperature: 25, // -10 - 100°C
    soilMoisture: 45, // 0 - 100%
    buttonPressed: false,
    pwmValue: 128, // 0 - 255
    threshold: 400,
    tempThreshold: 30,
    moistureThreshold: 35,
    logicRule: {
      sensor: 'temp',
      operator: '>',
      threshold: 30,
      targetOutput: 'led'
    }
  });

  // Simulation outputs
  const [simOutputs, setSimOutputs] = useState({
    isSimulating: false,
    ledState: false,
    ledBrightness: 0,
    buzzerState: false,
    analogReading: 0,
    sensorVoltage: 0.0,
    currentMa: 0.0,
    temperature: 25,
    tempVoltage: 0.75,
    tempAdc: 153,
    ambientLight: 70,
    lightVoltage: 3.5,
    lightAdc: 716,
    soilMoisture: 45,
    soilVoltage: 2.25,
    soilAdc: 460,
    digitalPinStates: {},
    summary: 'Circuit ready. Click "Run Simulation" to energize.'
  });

  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [], warnings: [], suggestions: [] });
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Simulation Engine instance
  const engineRef = useRef(new SimulationEngine());
  const [engineLogs, setEngineLogs] = useState([]);

  // Load project or initial starter preset
  useEffect(() => {
    const initLab = async () => {
      if (projectId) {
        const proj = await projectService.getProject(projectId);
        if (proj) {
          setProject(proj);
          if (proj.supportedSimulationType) {
            setSimulationMode(proj.supportedSimulationType);
          }
          if (proj.initialCircuit) {
            setCircuit({
              schemaVersion: '1.0',
              name: proj.title,
              components: proj.initialCircuit.components || [],
              connections: proj.initialCircuit.connections || [],
              updatedAt: new Date().toISOString()
            });
          }
          updateAssistantContext({ currentProject: proj });
        }
      } else {
        // Load default starter: Arduino Uno + Breadboard on workspace
        let starter = createInitialCircuit();
        starter = addComponent(starter, 'arduino', 60, 80);
        starter = addComponent(starter, 'breadboard', 400, 80);
        starter = addComponent(starter, 'led', 460, 190, { color: 'red' });
        starter = addComponent(starter, 'resistor', 460, 270, { resistance: 220 });
        setCircuit(starter);
      }
    };
    initLab();
  }, [projectId]);

  // Validate circuit whenever circuit structure changes
  useEffect(() => {
    const val = validateCircuit(circuit, simulationMode);
    setValidationResult(val);
    updateAssistantContext({ simulatorErrors: val.errors });
  }, [circuit, simulationMode]);

  // Keyboard shortcut to delete selected wire or component
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedConnectionId) {
          handleRemoveConnection(selectedConnectionId);
        } else if (selectedComponentId) {
          handleRemoveComponent(selectedComponentId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedConnectionId, selectedComponentId]);

  // Simulation timer loop for real-time blinking and pulsing
  useEffect(() => {
    if (isSimulating) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTick(t => t + 1);
      }, 700); // 700ms clock for visible LED blinking and buzzer cadence
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      audioManager.stopBuzzer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      audioManager.stopBuzzer();
    };
  }, [isSimulating]);

  // Run simulation tick when simulating or inputs change
  useEffect(() => {
    if (!isSimulating) {
      audioManager.stopBuzzer();
      setSimOutputs(prev => ({
        ...prev,
        ledState: false,
        ledBrightness: 0,
        buzzerState: false,
        currentMa: 0,
        summary: 'Simulation stopped. Press "Run Simulation" to energize.'
      }));
      return;
    }

    const stepOutputs = engineRef.current.step(circuit, simulationMode, simInputs, tick);
    setSimOutputs(stepOutputs);

    // Audio output coordination
    if (stepOutputs.buzzerState) {
      audioManager.playBuzzer(880);
    } else {
      audioManager.stopBuzzer();
    }

    if (stepOutputs.ledState && project && !project.completed) {
      markProjectDone(project.id);
    }
  }, [isSimulating, tick, circuit, simulationMode, simInputs]);

  // Component palette action
  const handleAddComponent = (type) => {
    const x = 400 + Math.floor(Math.random() * 80);
    const y = 140 + Math.floor(Math.random() * 80);
    const updated = addComponent(circuit, type, x, y);
    setCircuit(updated);
    engineRef.current.log(`Added component: ${COMPONENT_DEFINITIONS[type]?.name || type}`, 'action');
    setEngineLogs(engineRef.current.getLogs());
  };

  const handleUpdatePosition = useCallback((componentId, x, y) => {
    setCircuit(prev => updateComponentPosition(prev, componentId, x, y));
  }, []);

  const handleUpdateProperties = (componentId, props) => {
    setCircuit(prev => updateComponentProperties(prev, componentId, props));
  };

  const handleRemoveComponent = (componentId) => {
    setCircuit(prev => removeComponent(prev, componentId));
    setSelectedComponentId(null);
    engineRef.current.log('Removed component from workbench', 'warn');
    setEngineLogs(engineRef.current.getLogs());
  };

  // Connection actions
  const handleAddConnection = (fromCompId, fromPinId, toCompId, toPinId, color) => {
    const updated = createConnection(circuit, fromCompId, fromPinId, toCompId, toPinId, color);
    setCircuit(updated);
    engineRef.current.log(`Attached wire: ${fromPinId} ➔ ${toPinId}`, 'success');
    setEngineLogs(engineRef.current.getLogs());
  };

  const handleRemoveConnection = (connectionId) => {
    setCircuit(prev => removeConnection(prev, connectionId));
    setSelectedConnectionId(null);
    engineRef.current.log('Detached wire', 'warn');
    setEngineLogs(engineRef.current.getLogs());
  };

  // Toolbar actions
  const handleToggleSimulation = () => {
    const nextState = !isSimulating;
    setIsSimulating(nextState);
    if (!nextState) {
      audioManager.stopBuzzer();
    }
    engineRef.current.log(
      nextState ? '▶ Simulation started. Power rails energized.' : '⏹ Simulation stopped.',
      nextState ? 'success' : 'info'
    );
    setEngineLogs(engineRef.current.getLogs());
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    audioManager.stopBuzzer();
    setTick(0);
    setSimInputs({
      ambientLight: 70,
      temperature: 25,
      soilMoisture: 45,
      buttonPressed: false,
      pwmValue: 128,
      threshold: 400,
      tempThreshold: 30,
      moistureThreshold: 35,
      logicRule: {
        sensor: 'temp',
        operator: '>',
        threshold: 30,
        targetOutput: 'led'
      }
    });
    engineRef.current.log('Simulation state reset to default inputs', 'info');
    setEngineLogs(engineRef.current.getLogs());
  };

  const handleToggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const handleClearCircuit = () => {
    if (window.confirm('Are you sure you want to clear your entire workbench?')) {
      setCircuit(createInitialCircuit());
      setSelectedComponentId(null);
      setSelectedConnectionId(null);
      setIsSimulating(false);
      engineRef.current.log('Cleared entire workbench', 'warn');
      setEngineLogs(engineRef.current.getLogs());
    }
  };

  const handleSaveCircuit = async (name) => {
    await saveCircuitToAccount(name, circuit, projectId);
    engineRef.current.log(`Circuit "${name}" saved to your student profile (+20 pts)`, 'success');
    setEngineLogs(engineRef.current.getLogs());
  };

  const handleUpdateInput = (key, value) => {
    setSimInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-900">
      
      {/* Top Controls Toolbar */}
      <LabToolbar
        project={project}
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
        onResetSimulation={handleResetSimulation}
        onClearCircuit={handleClearCircuit}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        wireColor={wireColor}
        setWireColor={setWireColor}
        simulationMode={simulationMode}
        setSimulationMode={setSimulationMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Workbench Body: 3-Panel Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left: Component Palette */}
        <ComponentPalette onAddComponent={handleAddComponent} />

        {/* Center: Circuit Interactive SVG Workbench */}
        <CircuitCanvas
          circuit={circuit}
          onUpdateComponentPosition={handleUpdatePosition}
          onSelectComponent={setSelectedComponentId}
          selectedComponentId={selectedComponentId}
          onAddConnection={handleAddConnection}
          onSelectConnection={setSelectedConnectionId}
          selectedConnectionId={selectedConnectionId}
          onRemoveConnection={handleRemoveConnection}
          outputs={simOutputs}
          wireColor={wireColor}
        />

        {/* Right: Properties, Simulation Controls & Diagnostics */}
        <PropertiesPanel
          circuit={circuit}
          selectedComponentId={selectedComponentId}
          selectedConnectionId={selectedConnectionId}
          onUpdateComponentProperties={handleUpdateProperties}
          onRemoveComponent={handleRemoveComponent}
          onRemoveConnection={handleRemoveConnection}
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
          inputs={simInputs}
          onUpdateInput={handleUpdateInput}
          outputs={simOutputs}
          validationResult={validationResult}
          logs={engineLogs}
          onClearLogs={() => {
            engineRef.current.clearLogs();
            setEngineLogs([]);
          }}
        />

      </div>

      {/* Save Circuit Modal */}
      <SaveCircuitModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveCircuit}
        currentName={project ? `${project.title} Save` : 'My Custom Breadboard Circuit'}
      />

    </div>
  );
};
