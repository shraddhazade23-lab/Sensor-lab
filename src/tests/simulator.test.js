import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialCircuit,
  addComponent,
  removeComponent,
  createConnection,
  removeConnection,
  serializeCircuit,
  deserializeCircuit
} from '../simulator/circuitModel.js';
import { ConnectionGraph } from '../simulator/connectionGraph.js';
import { validateCircuit } from '../simulator/circuitValidator.js';
import { SimulationEngine } from '../simulator/simulationEngine.js';

describe('Circuit Model & Operations', () => {
  it('initializes an empty circuit with valid schema', () => {
    const circuit = createInitialCircuit();
    expect(circuit.schemaVersion).toBe('1.0');
    expect(circuit.components).toHaveLength(0);
    expect(circuit.connections).toHaveLength(0);
  });

  it('adds components with stable unique IDs and properties', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 200, 100, { color: 'green' });

    expect(circuit.components).toHaveLength(2);
    expect(circuit.components[0].type).toBe('arduino');
    expect(circuit.components[1].type).toBe('led');
    expect(circuit.components[1].color).toBe('green');
    expect(circuit.components[0].id).not.toBe(circuit.components[1].id);
  });

  it('cascades and removes connected wires when a component is deleted', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 200, 100);

    const ardId = circuit.components[0].id;
    const ledId = circuit.components[1].id;

    circuit = createConnection(circuit, ardId, '5V', ledId, 'anode');
    expect(circuit.connections).toHaveLength(1);

    // Delete the LED
    circuit = removeComponent(circuit, ledId);
    expect(circuit.components).toHaveLength(1);
    expect(circuit.connections).toHaveLength(0); // Wire was automatically removed
  });

  it('prevents duplicate connections between identical pins', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'breadboard', 200, 100);

    const ardId = circuit.components[0].id;
    const bbId = circuit.components[1].id;

    circuit = createConnection(circuit, ardId, '5V', bbId, 'power-pos');
    circuit = createConnection(circuit, ardId, '5V', bbId, 'power-pos'); // duplicate

    expect(circuit.connections).toHaveLength(1);
  });

  it('serializes and deserializes circuit data faithfully', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'resistor', 150, 50, { resistance: 10000 });

    const json = serializeCircuit(circuit);
    const restored = deserializeCircuit(json);

    expect(restored.schemaVersion).toBe('1.0');
    expect(restored.components).toHaveLength(2);
    expect(restored.components[1].resistance).toBe(10000);
  });
});

describe('Circuit Validator Feedback', () => {
  it('flags an empty workspace', () => {
    const circuit = createInitialCircuit();
    const result = validateCircuit(circuit, 'led-circuit');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Your workspace is empty');
  });

  it('flags missing Arduino power source', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'led', 100, 100);
    const result = validateCircuit(circuit, 'led-circuit');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('No power source found');
  });

  it('warns when LED lacks a protective resistor', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 150, 50);

    const result = validateCircuit(circuit, 'led-circuit');
    expect(result.warnings.some(w => w.includes('Protection Warning'))).toBe(true);
  });
});

describe('Simulation Engine Step Modes', () => {
  let engine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  it('evaluates LED circuit closed loop correctly', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'breadboard', 300, 50);
    circuit = addComponent(circuit, 'led', 350, 120);
    circuit = addComponent(circuit, 'resistor', 350, 180, { resistance: 220 });

    const ard = circuit.components[0];
    const bb = circuit.components[1];
    const led = circuit.components[2];
    const res = circuit.components[3];

    // Wire up complete loop: 5V -> rail -> led anode -> led cathode -> res -> gnd rail -> GND
    circuit = createConnection(circuit, ard.id, '5V', bb.id, 'power-pos');
    circuit = createConnection(circuit, ard.id, 'GND_1', bb.id, 'power-neg');
    circuit = createConnection(circuit, bb.id, 'power-pos', led.id, 'anode');
    circuit = createConnection(circuit, led.id, 'cathode', res.id, 'pin1');
    circuit = createConnection(circuit, res.id, 'pin2', bb.id, 'power-neg');

    const outputs = engine.step(circuit, 'led-circuit');
    expect(outputs.ledState).toBe(true);
    expect(outputs.ledBrightness).toBe(255);
    expect(outputs.currentMa).toBeGreaterThan(10);
  });

  it('simulates push button toggle in Button-LED mode', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 200, 50);

    // Released state
    const releasedOutputs = engine.step(circuit, 'button-led', { buttonPressed: false });
    expect(releasedOutputs.ledState).toBe(false);

    // Pressed state
    const pressedOutputs = engine.step(circuit, 'button-led', { buttonPressed: true });
    expect(pressedOutputs.ledState).toBe(true);
    expect(pressedOutputs.ledBrightness).toBe(255);
  });

  it('calculates LDR sensor voltage and ADC readings proportionally', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);

    // 100% ambient light
    const brightOutputs = engine.step(circuit, 'ldr-sensor', { ambientLight: 100 });
    expect(brightOutputs.analogReading).toBe(1023);
    expect(brightOutputs.sensorVoltage).toBe(5.0);

    // 0% ambient light (pitch dark)
    const darkOutputs = engine.step(circuit, 'ldr-sensor', { ambientLight: 0 });
    expect(darkOutputs.analogReading).toBe(0);
    expect(darkOutputs.sensorVoltage).toBe(0.0);

    // 50% ambient light
    const halfOutputs = engine.step(circuit, 'ldr-sensor', { ambientLight: 50 });
    expect(halfOutputs.analogReading).toBe(512);
  });

  it('triggers Automatic Night Light only when ambient light drops below threshold', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 200, 50);

    const threshold = 400;

    // Daytime (80% light => ADC ~ 818 => above 400)
    const dayOutputs = engine.step(circuit, 'auto-nightlight', { ambientLight: 80, threshold });
    expect(dayOutputs.ledState).toBe(false);
    expect(dayOutputs.digitalPinStates['D13']).toBe(false);

    // Nighttime (20% light => ADC ~ 205 => below 400)
    const nightOutputs = engine.step(circuit, 'auto-nightlight', { ambientLight: 20, threshold });
    expect(nightOutputs.ledState).toBe(true);
    expect(nightOutputs.digitalPinStates['D13']).toBe(true);
  });

  it('computes PWM duty cycle and LED brightness scaling in PWM mode', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);

    // Half brightness
    const pwmOutputs = engine.step(circuit, 'pwm-brightness', { pwmValue: 128 });
    expect(pwmOutputs.ledBrightness).toBe(128);
    expect(pwmOutputs.ledState).toBe(true);
    expect(pwmOutputs.sensorVoltage).toBeCloseTo(2.51, 1);
  });

  it('calculates TMP36 temperature sensor voltage and ADC and triggers high-temp alert', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);

    // 25°C room temp (Vout = 25 * 0.01 + 0.50 = 0.75V)
    const normalOutputs = engine.step(circuit, 'temp-alert', { temperature: 25, tempThreshold: 30 });
    expect(normalOutputs.temperature).toBe(25);
    expect(normalOutputs.tempVoltage).toBeCloseTo(0.75, 2);
    expect(normalOutputs.tempAdc).toBe(153);
    expect(normalOutputs.ledState).toBe(false);
    expect(normalOutputs.digitalPinStates['D6']).toBe(false);

    // 45°C overheating temp (Vout = 45 * 0.01 + 0.50 = 0.95V => above 30°C threshold)
    const hotOutputs = engine.step(circuit, 'temp-alert', { temperature: 45, tempThreshold: 30 });
    expect(hotOutputs.temperature).toBe(45);
    expect(hotOutputs.tempVoltage).toBeCloseTo(0.95, 2);
    expect(hotOutputs.tempAdc).toBe(194);
    expect(hotOutputs.ledState).toBe(true);
    expect(hotOutputs.digitalPinStates['D6']).toBe(true);
    expect(hotOutputs.summary).toContain('HIGH TEMP ALERT');
  });

  it('evaluates soil moisture sensor readings and triggers irrigation alert when dry', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);

    // Adequate moisture (50% > 35% threshold)
    const moistOutputs = engine.step(circuit, 'soil-watering', { soilMoisture: 50, moistureThreshold: 35 });
    expect(moistOutputs.soilMoisture).toBe(50);
    expect(moistOutputs.soilAdc).toBe(512);
    expect(moistOutputs.ledState).toBe(false);
    expect(moistOutputs.summary).toContain('ADEQUATE');

    // Dry soil (20% < 35% threshold)
    const dryOutputs = engine.step(circuit, 'soil-watering', { soilMoisture: 20, moistureThreshold: 35 });
    expect(dryOutputs.soilMoisture).toBe(20);
    expect(dryOutputs.soilAdc).toBe(205);
    expect(dryOutputs.ledState).toBe(true);
    expect(dryOutputs.digitalPinStates['D8']).toBe(true);
    expect(dryOutputs.summary).toContain('SOIL DRY');
  });

  it('executes custom smart logic rules accurately', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);

    // Rule: IF temperature > 32 THEN LED ON
    const ruleHot = {
      sensor: 'temp',
      operator: '>',
      threshold: 32,
      targetOutput: 'led'
    };

    // Condition met: 35°C > 32°C
    const metOutputs = engine.step(circuit, 'smart-logic', { temperature: 35, logicRule: ruleHot });
    expect(metOutputs.ledState).toBe(true);
    expect(metOutputs.ledBrightness).toBe(255);
    expect(metOutputs.activeRule.conditionMet).toBe(true);

    // Condition not met: 28°C not > 32°C
    const unmetOutputs = engine.step(circuit, 'smart-logic', { temperature: 28, logicRule: ruleHot });
    expect(unmetOutputs.ledState).toBe(false);
    expect(unmetOutputs.activeRule.conditionMet).toBe(false);
  });

  it('alternates LED ON and OFF repeatedly across clock ticks in blinking-led mode', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 200, 50);

    // Tick 0: LED is ON
    const tick0 = engine.step(circuit, 'blinking-led', {}, 0);
    expect(tick0.ledState).toBe(true);
    expect(tick0.ledBrightness).toBe(255);
    expect(tick0.digitalPinStates['D13']).toBe(true);

    // Tick 1: LED is OFF
    const tick1 = engine.step(circuit, 'blinking-led', {}, 1);
    expect(tick1.ledState).toBe(false);
    expect(tick1.ledBrightness).toBe(0);
    expect(tick1.digitalPinStates['D13']).toBe(false);

    // Tick 2: LED turns back ON
    const tick2 = engine.step(circuit, 'blinking-led', {}, 2);
    expect(tick2.ledState).toBe(true);
    expect(tick2.ledBrightness).toBe(255);
  });

  it('triggers audible buzzer and syncs LED in buzzer-alarm mode', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'buzzer', 200, 50);
    circuit = addComponent(circuit, 'led', 300, 50);

    // Tick 0: Buzzer active and LED in sync
    const alarmOn = engine.step(circuit, 'buzzer-alarm', {}, 0);
    expect(alarmOn.buzzerState).toBe(true);
    expect(alarmOn.ledState).toBe(true);
    expect(alarmOn.summary).toContain('Audible Security Alarm');

    // Tick 1: Pause cycle
    const alarmOff = engine.step(circuit, 'buzzer-alarm', {}, 1);
    expect(alarmOff.buzzerState).toBe(false);
    expect(alarmOff.ledState).toBe(false);
  });

  it('activates both LED and Buzzer together when button is pressed', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    circuit = addComponent(circuit, 'led', 200, 50);
    circuit = addComponent(circuit, 'buzzer', 300, 50);

    // Button pressed: both LED and Buzzer are active
    const pressedOutputs = engine.step(circuit, 'button-led', { buttonPressed: true });
    expect(pressedOutputs.ledState).toBe(true);
    expect(pressedOutputs.buzzerState).toBe(true);

    // Button released: both are deactivated
    const releasedOutputs = engine.step(circuit, 'button-led', { buttonPressed: false });
    expect(releasedOutputs.ledState).toBe(false);
    expect(releasedOutputs.buzzerState).toBe(false);
  });
});

describe('Circuit Validator for Advanced Sensors', () => {
  it('flags missing temperature sensor in temp-alert mode', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    const result = validateCircuit(circuit, 'temp-alert');
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Missing Temperature Sensor'))).toBe(true);
  });

  it('flags missing soil moisture sensor in soil-watering mode', () => {
    let circuit = createInitialCircuit();
    circuit = addComponent(circuit, 'arduino', 50, 50);
    const result = validateCircuit(circuit, 'soil-watering');
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Missing Soil Moisture Sensor'))).toBe(true);
  });
});
