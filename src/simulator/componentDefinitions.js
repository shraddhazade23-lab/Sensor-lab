// Component definitions and pin configurations for SensorLab Virtual Lab

export const COMPONENT_TYPES = {
  ARDUINO: 'arduino',
  BREADBOARD: 'breadboard',
  LED: 'led',
  RESISTOR: 'resistor',
  BUTTON: 'button',
  LDR: 'ldr',
  TEMPERATURE: 'temperature',
  SOIL_MOISTURE: 'soilMoisture',
  POTENTIOMETER: 'potentiometer',
  BUZZER: 'buzzer'
};

export const COMPONENT_DEFINITIONS = {
  arduino: {
    type: 'arduino',
    name: 'Arduino Uno R3',
    category: 'Microcontrollers',
    width: 260,
    height: 190,
    description: 'Educational microcontroller board with ATmega328P chip, 14 digital I/O pins, and 6 analog inputs.',
    defaultProperties: {
      model: 'Uno R3',
      powerState: true,
      builtinLed: false
    },
    pins: [
      // Power header
      { id: '5V', label: '5V', type: 'power', x: 75, y: 175, color: '#ef4444' },
      { id: '3.3V', label: '3.3V', type: 'power', x: 60, y: 175, color: '#f97316' },
      { id: 'GND_1', label: 'GND', type: 'gnd', x: 90, y: 175, color: '#1e293b' },
      { id: 'GND_2', label: 'GND', type: 'gnd', x: 105, y: 175, color: '#1e293b' },
      { id: 'Vin', label: 'Vin', type: 'power', x: 120, y: 175, color: '#b91c1c' },

      // Analog In header
      { id: 'A0', label: 'A0', type: 'analog', x: 145, y: 175, color: '#3b82f6' },
      { id: 'A1', label: 'A1', type: 'analog', x: 160, y: 175, color: '#3b82f6' },
      { id: 'A2', label: 'A2', type: 'analog', x: 175, y: 175, color: '#3b82f6' },
      { id: 'A3', label: 'A3', type: 'analog', x: 190, y: 175, color: '#3b82f6' },
      { id: 'A4', label: 'A4', type: 'analog', x: 205, y: 175, color: '#3b82f6' },
      { id: 'A5', label: 'A5', type: 'analog', x: 220, y: 175, color: '#3b82f6' },

      // Digital header (top)
      { id: 'GND_3', label: 'GND', type: 'gnd', x: 70, y: 15, color: '#1e293b' },
      { id: 'D13', label: 'D13', type: 'digital', x: 85, y: 15, color: '#14b8a6' },
      { id: 'D12', label: 'D12', type: 'digital', x: 100, y: 15, color: '#14b8a6' },
      { id: 'D11', label: '~D11', type: 'pwm', x: 115, y: 15, color: '#8b5cf6' },
      { id: 'D10', label: '~D10', type: 'pwm', x: 130, y: 15, color: '#8b5cf6' },
      { id: 'D9', label: '~D9', type: 'pwm', x: 145, y: 15, color: '#8b5cf6' },
      { id: 'D8', label: 'D8', type: 'digital', x: 160, y: 15, color: '#14b8a6' },
      { id: 'D7', label: 'D7', type: 'digital', x: 180, y: 15, color: '#14b8a6' },
      { id: 'D6', label: '~D6', type: 'pwm', x: 195, y: 15, color: '#8b5cf6' },
      { id: 'D5', label: '~D5', type: 'pwm', x: 210, y: 15, color: '#8b5cf6' },
      { id: 'D4', label: 'D4', type: 'digital', x: 225, y: 15, color: '#14b8a6' },
      { id: 'D3', label: '~D3', type: 'pwm', x: 240, y: 15, color: '#8b5cf6' },
      { id: 'D2', label: 'D2', type: 'digital', x: 255, y: 15, color: '#14b8a6' }
    ]
  },

  breadboard: {
    type: 'breadboard',
    name: 'Half-Size Breadboard',
    category: 'Prototyping',
    width: 320,
    height: 240,
    description: 'Prototyping board with top/bottom power buses and central 5-hole terminal strips.',
    defaultProperties: {},
    pins: [
      // Top power rails
      { id: 'power-pos', label: '+ (5V Rail)', type: 'rail-pos', x: 20, y: 20, color: '#ef4444' },
      { id: 'power-neg', label: '- (GND Rail)', type: 'rail-neg', x: 20, y: 40, color: '#1e293b' },
      // Breadboard terminal rows
      { id: 'row-1', label: 'Row 1', type: 'terminal', x: 60, y: 80, color: '#64748b' },
      { id: 'row-2', label: 'Row 2', type: 'terminal', x: 60, y: 110, color: '#64748b' },
      { id: 'row-3', label: 'Row 3', type: 'terminal', x: 60, y: 140, color: '#64748b' },
      { id: 'row-4', label: 'Row 4', type: 'terminal', x: 60, y: 170, color: '#64748b' },
      { id: 'row-5', label: 'Row 5', type: 'terminal', x: 60, y: 200, color: '#64748b' }
    ]
  },

  led: {
    type: 'led',
    name: 'LED (Light Emitting Diode)',
    category: 'Outputs',
    width: 60,
    height: 70,
    description: 'Converts electricity into visible light. Has polarity: Anode (+) must face power, Cathode (-) faces ground.',
    defaultProperties: {
      color: 'red', // red, green, blue, yellow
      state: false,
      brightness: 255
    },
    pins: [
      { id: 'anode', label: 'Anode (+)', type: 'input', x: 18, y: 62, color: '#ef4444' },
      { id: 'cathode', label: 'Cathode (-)', type: 'output', x: 42, y: 62, color: '#1e293b' }
    ]
  },

  resistor: {
    type: 'resistor',
    name: 'Resistor',
    category: 'Passives',
    width: 80,
    height: 40,
    description: 'Slows down current to protect sensitive components like LEDs from burnout.',
    defaultProperties: {
      resistance: 220, // Ohms: 220, 330, 1k, 10k
      tolerance: 5
    },
    pins: [
      { id: 'pin1', label: 'Pin 1', type: 'passive', x: 8, y: 20, color: '#d97706' },
      { id: 'pin2', label: 'Pin 2', type: 'passive', x: 72, y: 20, color: '#d97706' }
    ]
  },

  button: {
    type: 'button',
    name: 'Push Button',
    category: 'Inputs',
    width: 60,
    height: 60,
    description: 'Tactile switch that completes a circuit only when pressed down.',
    defaultProperties: {
      pressed: false
    },
    pins: [
      { id: 'pin1', label: 'Terminal A', type: 'switch', x: 12, y: 30, color: '#3b82f6' },
      { id: 'pin2', label: 'Terminal B', type: 'switch', x: 48, y: 30, color: '#3b82f6' }
    ]
  },

  ldr: {
    type: 'ldr',
    name: 'LDR (Light Sensor)',
    category: 'Sensors',
    width: 60,
    height: 60,
    description: 'Light-Dependent Resistor whose resistance drops when exposed to ambient light.',
    defaultProperties: {
      lightLevel: 60 // 0 (dark) to 100 (sunlight)
    },
    pins: [
      { id: 'pin1', label: 'Leg 1', type: 'sensor', x: 15, y: 50, color: '#eab308' },
      { id: 'pin2', label: 'Leg 2', type: 'sensor', x: 45, y: 50, color: '#eab308' }
    ]
  },

  temperature: {
    type: 'temperature',
    name: 'Temperature Sensor (TMP36)',
    category: 'Sensors',
    width: 60,
    height: 70,
    description: 'Precision analog temperature sensor. Outputs 10 mV per °C with 500 mV offset at 0°C (-40°C to 125°C).',
    defaultProperties: {
      temperature: 25, // -10 to 100°C
      model: 'TMP36'
    },
    pins: [
      { id: 'vcc', label: 'VCC (5V)', type: 'power', x: 15, y: 62, color: '#ef4444' },
      { id: 'vout', label: 'VOUT (Analog)', type: 'analog', x: 30, y: 62, color: '#3b82f6' },
      { id: 'gnd', label: 'GND', type: 'gnd', x: 45, y: 62, color: '#1e293b' }
    ]
  },

  soilMoisture: {
    type: 'soilMoisture',
    name: 'Soil Moisture Sensor',
    category: 'Sensors',
    width: 65,
    height: 85,
    description: 'Soil moisture probe that reads water saturation level from 0% (Bone Dry) to 100% (Submerged).',
    defaultProperties: {
      moisture: 45 // 0% to 100%
    },
    pins: [
      { id: 'vcc', label: 'VCC (5V)', type: 'power', x: 16, y: 78, color: '#ef4444' },
      { id: 'sig', label: 'SIG (Analog)', type: 'analog', x: 32, y: 78, color: '#3b82f6' },
      { id: 'gnd', label: 'GND', type: 'gnd', x: 48, y: 78, color: '#1e293b' }
    ]
  },

  potentiometer: {
    type: 'potentiometer',
    name: 'Potentiometer (Rotary Dial)',
    category: 'Inputs',
    width: 70,
    height: 70,
    description: 'Variable resistor used as a volume or dimmer knob, providing a 0V-5V analog voltage divider output.',
    defaultProperties: {
      value: 512 // 0 to 1023
    },
    pins: [
      { id: 'vcc', label: 'VCC (5V)', type: 'power', x: 15, y: 60, color: '#ef4444' },
      { id: 'wiper', label: 'Wiper (Out)', type: 'analog', x: 35, y: 60, color: '#3b82f6' },
      { id: 'gnd', label: 'GND', type: 'gnd', x: 55, y: 60, color: '#1e293b' }
    ]
  },

  buzzer: {
    type: 'buzzer',
    name: 'Piezo Buzzer',
    category: 'Outputs',
    width: 60,
    height: 60,
    description: 'Emits an acoustic tone when an electrical signal is applied.',
    defaultProperties: {
      active: false,
      frequency: 440
    },
    pins: [
      { id: 'pos', label: 'Pos (+)', type: 'input', x: 18, y: 50, color: '#ef4444' },
      { id: 'neg', label: 'Neg (-)', type: 'output', x: 42, y: 50, color: '#1e293b' }
    ]
  }
};
