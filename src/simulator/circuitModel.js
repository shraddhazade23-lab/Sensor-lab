// Circuit Data Model for SensorLab Virtual Lab

import { COMPONENT_DEFINITIONS } from './componentDefinitions.js';

export const CIRCUIT_SCHEMA_VERSION = '1.0';

export function generateId(prefix = 'item') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

export function createInitialCircuit() {
  return {
    schemaVersion: CIRCUIT_SCHEMA_VERSION,
    name: 'Untitled Circuit',
    components: [],
    connections: [],
    updatedAt: new Date().toISOString()
  };
}

export function addComponent(circuit, type, x = 100, y = 100, customProps = {}) {
  const def = COMPONENT_DEFINITIONS[type];
  if (!def) {
    throw new Error(`Unknown component type: ${type}`);
  }

  const newComponent = {
    id: generateId(`comp_${type}`),
    type,
    label: def.name,
    x: Math.round(x),
    y: Math.round(y),
    rotation: 0,
    ...def.defaultProperties,
    ...customProps
  };

  return {
    ...circuit,
    components: [...circuit.components, newComponent],
    updatedAt: new Date().toISOString()
  };
}

export function removeComponent(circuit, componentId) {
  // Cascading deletion: remove the component AND all wires connected to any of its pins
  const updatedComponents = circuit.components.filter(c => c.id !== componentId);
  const updatedConnections = circuit.connections.filter(
    wire => wire.fromComponentId !== componentId && wire.toComponentId !== componentId
  );

  return {
    ...circuit,
    components: updatedComponents,
    connections: updatedConnections,
    updatedAt: new Date().toISOString()
  };
}

export function updateComponentPosition(circuit, componentId, x, y) {
  const updatedComponents = circuit.components.map(c => {
    if (c.id === componentId) {
      return { ...c, x: Math.round(x), y: Math.round(y) };
    }
    return c;
  });

  return {
    ...circuit,
    components: updatedComponents,
    updatedAt: new Date().toISOString()
  };
}

export function updateComponentProperties(circuit, componentId, newProps) {
  const updatedComponents = circuit.components.map(c => {
    if (c.id === componentId) {
      return { ...c, ...newProps };
    }
    return c;
  });

  return {
    ...circuit,
    components: updatedComponents,
    updatedAt: new Date().toISOString()
  };
}

export function createConnection(circuit, fromComponentId, fromPinId, toComponentId, toPinId, color = '#2dd4bf') {
  // Prevent connecting a pin to itself
  if (fromComponentId === toComponentId && fromPinId === toPinId) {
    return circuit;
  }

  // Check if identical wire already exists in either direction
  const exists = circuit.connections.some(wire => 
    (wire.fromComponentId === fromComponentId && wire.fromPinId === fromPinId &&
     wire.toComponentId === toComponentId && wire.toPinId === toPinId) ||
    (wire.fromComponentId === toComponentId && wire.fromPinId === toPinId &&
     wire.toComponentId === fromComponentId && wire.toPinId === fromPinId)
  );

  if (exists) {
    return circuit;
  }

  const newWire = {
    id: generateId('wire'),
    fromComponentId,
    fromPinId,
    toComponentId,
    toPinId,
    color
  };

  return {
    ...circuit,
    connections: [...circuit.connections, newWire],
    updatedAt: new Date().toISOString()
  };
}

export function removeConnection(circuit, connectionId) {
  return {
    ...circuit,
    connections: circuit.connections.filter(wire => wire.id !== connectionId),
    updatedAt: new Date().toISOString()
  };
}

export function serializeCircuit(circuit) {
  return JSON.stringify({
    schemaVersion: CIRCUIT_SCHEMA_VERSION,
    name: circuit.name || 'Saved Circuit',
    components: circuit.components,
    connections: circuit.connections,
    savedAt: new Date().toISOString()
  }, null, 2);
}

export function deserializeCircuit(serializedData) {
  try {
    const parsed = typeof serializedData === 'string' ? JSON.parse(serializedData) : serializedData;
    if (!parsed || !Array.isArray(parsed.components) || !Array.isArray(parsed.connections)) {
      throw new Error('Invalid circuit file structure');
    }
    return {
      schemaVersion: parsed.schemaVersion || CIRCUIT_SCHEMA_VERSION,
      name: parsed.name || 'Imported Circuit',
      components: parsed.components,
      connections: parsed.connections,
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error deserializing circuit:', err);
    throw err;
  }
}
