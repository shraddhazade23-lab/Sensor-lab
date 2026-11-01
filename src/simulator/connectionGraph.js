// Connection Graph & Electrical Netlist Analysis for SensorLab

export class ConnectionGraph {
  constructor(circuit) {
    this.circuit = circuit;
    this.adjacencyList = new Map();
    this.buildGraph();
  }

  // Key helper: returns canonical node string
  getNodeKey(componentId, pinId) {
    return `${componentId}:${pinId}`;
  }

  addNode(key) {
    if (!this.adjacencyList.has(key)) {
      this.adjacencyList.set(key, new Set());
    }
  }

  addEdge(nodeA, nodeB) {
    this.addNode(nodeA);
    this.addNode(nodeB);
    this.adjacencyList.get(nodeA).add(nodeB);
    this.adjacencyList.get(nodeB).add(nodeA);
  }

  buildGraph() {
    const { components, connections } = this.circuit;

    // 1. Add all wire connections
    for (const wire of connections) {
      const nodeA = this.getNodeKey(wire.fromComponentId, wire.fromPinId);
      const nodeB = this.getNodeKey(wire.toComponentId, wire.toPinId);
      this.addEdge(nodeA, nodeB);
    }

    // 2. Add internal connections for special components
    for (const comp of components) {
      if (comp.type === 'breadboard') {
        // All connections to power-pos share the same electrical rail
        // All connections to power-neg share the same electrical rail
      } else if (comp.type === 'resistor') {
        // Resistors conduct bidirectionally
        const n1 = this.getNodeKey(comp.id, 'pin1');
        const n2 = this.getNodeKey(comp.id, 'pin2');
        this.addEdge(n1, n2);
      } else if (comp.type === 'button') {
        // Conducts only when pressed
        if (comp.pressed) {
          const n1 = this.getNodeKey(comp.id, 'pin1');
          const n2 = this.getNodeKey(comp.id, 'pin2');
          this.addEdge(n1, n2);
        }
      } else if (comp.type === 'ldr') {
        // LDR conducts with light-dependent resistance
        const n1 = this.getNodeKey(comp.id, 'pin1');
        const n2 = this.getNodeKey(comp.id, 'pin2');
        this.addEdge(n1, n2);
      }
    }
  }

  // Find all nodes reachable from a start node using Breadth-First Search (BFS)
  getReachableNodes(startComponentId, startPinId) {
    const startKey = this.getNodeKey(startComponentId, startPinId);
    const visited = new Set();
    const queue = [startKey];
    visited.add(startKey);

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = this.adjacencyList.get(current) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return visited;
  }

  // Check if a path exists between two specific pins
  hasPath(fromCompId, fromPinId, toCompId, toPinId) {
    const reachable = this.getReachableNodes(fromCompId, fromPinId);
    const targetKey = this.getNodeKey(toCompId, toPinId);
    return reachable.has(targetKey);
  }

  // Check if power rail is connected to Arduino 5V
  isPowerRailEnergized() {
    const arduino = this.circuit.components.find(c => c.type === 'arduino');
    const breadboard = this.circuit.components.find(c => c.type === 'breadboard');
    if (!arduino) return false;

    // Check direct or breadboard rail connection
    if (breadboard) {
      return this.hasPath(arduino.id, '5V', breadboard.id, 'power-pos');
    }
    return true;
  }

  // Check if ground rail is connected to Arduino GND
  isGroundRailConnected() {
    const arduino = this.circuit.components.find(c => c.type === 'arduino');
    const breadboard = this.circuit.components.find(c => c.type === 'breadboard');
    if (!arduino) return false;

    const gndPins = ['GND_1', 'GND_2', 'GND_3'];
    for (const gnd of gndPins) {
      if (breadboard && this.hasPath(arduino.id, gnd, breadboard.id, 'power-neg')) {
        return true;
      }
    }
    return false;
  }

  // Check if a node is connected to any Arduino GND
  isConnectedToGND(componentId, pinId) {
    const arduino = this.circuit.components.find(c => c.type === 'arduino');
    const breadboard = this.circuit.components.find(c => c.type === 'breadboard');

    // Check breadboard power-neg if breadboard is grounded
    if (breadboard && this.isGroundRailConnected()) {
      if (this.hasPath(componentId, pinId, breadboard.id, 'power-neg')) {
        return true;
      }
    }

    // Check direct Arduino GND
    if (arduino) {
      for (const gnd of ['GND_1', 'GND_2', 'GND_3']) {
        if (this.hasPath(componentId, pinId, arduino.id, gnd)) {
          return true;
        }
      }
    }

    return false;
  }

  // Check if a node is connected to a 5V source
  isConnectedTo5V(componentId, pinId) {
    const arduino = this.circuit.components.find(c => c.type === 'arduino');
    const breadboard = this.circuit.components.find(c => c.type === 'breadboard');

    if (breadboard && this.isPowerRailEnergized()) {
      if (this.hasPath(componentId, pinId, breadboard.id, 'power-pos')) {
        return true;
      }
    }

    if (arduino && this.hasPath(componentId, pinId, arduino.id, '5V')) {
      return true;
    }

    return false;
  }

  // Check if a 3-pin sensor has both power (5V) and GND connected
  isSensorPowered(sensorId, vccPin = 'vcc', gndPin = 'gnd') {
    return this.isConnectedTo5V(sensorId, vccPin) && this.isConnectedToGND(sensorId, gndPin);
  }

  // Find which Arduino Analog pin (A0 - A5) is connected to a specific component pin
  getConnectedAnalogPin(componentId, pinId) {
    const arduino = this.circuit.components.find(c => c.type === 'arduino');
    if (!arduino) return null;
    const analogPins = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
    for (const pin of analogPins) {
      if (this.hasPath(componentId, pinId, arduino.id, pin)) {
        return pin;
      }
    }
    return null;
  }

  // Find which Arduino Digital pin (D2 - D13) is connected to a specific component pin
  getConnectedDigitalPin(componentId, pinId) {
    const arduino = this.circuit.components.find(c => c.type === 'arduino');
    if (!arduino) return null;
    const digitalPins = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'];
    for (const pin of digitalPins) {
      if (this.hasPath(componentId, pinId, arduino.id, pin)) {
        return pin;
      }
    }
    return null;
  }
}

