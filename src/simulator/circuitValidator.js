// Educational Circuit Validator for SensorLab

import { ConnectionGraph } from './connectionGraph.js';

export function validateCircuit(circuit, expectedType = 'generic') {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  const components = circuit.components || [];
  const connections = circuit.connections || [];

  // Check 1: Empty workspace
  if (components.length === 0) {
    errors.push('Your workspace is empty! Place an Arduino Uno and components from the left panel to begin.');
    return { isValid: false, errors, warnings, suggestions };
  }

  // Check 2: Arduino presence
  const arduino = components.find(c => c.type === 'arduino');
  if (!arduino) {
    errors.push('No power source found. Place an Arduino Uno to provide power (5V) and Ground (GND).');
    return { isValid: false, errors, warnings, suggestions };
  }

  // Check 3: Breadboard & Grounding
  const graph = new ConnectionGraph(circuit);
  const breadboard = components.find(c => c.type === 'breadboard');

  if (breadboard) {
    const isGndConnected = graph.isGroundRailConnected();
    if (!isGndConnected && connections.length > 2) {
      warnings.push('The breadboard Ground rail (-) is not connected to Arduino GND. Remember that electricity needs a return path!');
      suggestions.push('Connect a black wire from Arduino GND to the breadboard negative rail (-).');
    }
  }

  // Check 4: LED-related circuit checks
  const leds = components.filter(c => c.type === 'led');
  const resistors = components.filter(c => c.type === 'resistor');
  const buttons = components.filter(c => c.type === 'button');
  const ldrs = components.filter(c => c.type === 'ldr');

  if (expectedType === 'led-circuit' || expectedType === 'button-led') {
    if (leds.length === 0) {
      errors.push('Missing LED: Place an LED on your breadboard to observe the light output.');
    } else {
      const led = leds[0];
      const hasResistor = resistors.length > 0;

      if (!hasResistor) {
        warnings.push('⚠️ Protection Warning: No resistor detected! In real-life electronics, an LED without a 220Ω resistor will burn out.');
        suggestions.push('Place a 220Ω resistor between the LED Cathode (-) and Ground (GND).');
      }

      // Polarity check: Is cathode connected to 5V?
      const isCathodeOn5V = graph.isConnectedTo5V(led.id, 'cathode');
      if (isCathodeOn5V) {
        errors.push('LED Polarity Error: The Cathode (-) is connected to power! An LED is a diode and only conducts when Anode (+) is toward power.');
        suggestions.push('Reverse the LED orientation so Anode (+) connects toward power and Cathode (-) toward ground.');
      }
    }

    if (expectedType === 'button-led' && buttons.length === 0) {
      errors.push('Missing Switch: Add a Push Button to control the circuit.');
      suggestions.push('Wire the push button in series between the power source and the LED.');
    }
  }

  // Check 5: LDR Sensor checks
  if (expectedType === 'ldr-sensor' || expectedType === 'auto-nightlight') {
    if (ldrs.length === 0) {
      errors.push('Missing Sensor: Place an LDR (Photoresistor) to sense ambient light levels.');
    }

    // Check if Analog A0 is wired
    const hasA0Wire = connections.some(w => 
      (w.fromComponentId === arduino.id && w.fromPinId === 'A0') ||
      (w.toComponentId === arduino.id && w.toPinId === 'A0')
    );

    if (!hasA0Wire) {
      warnings.push('Analog Pin A0 is not connected. The Arduino needs to read the sensor voltage divider on pin A0.');
      suggestions.push('Connect a wire from the junction of the LDR and resistor to Arduino pin A0.');
    }
  }

  // Check 6: PWM Circuit checks
  if (expectedType === 'pwm-brightness') {
    const pwmPins = ['D3', 'D5', 'D6', 'D9', 'D10', 'D11'];
    const hasPwmWire = connections.some(w => 
      (w.fromComponentId === arduino.id && pwmPins.includes(w.fromPinId)) ||
      (w.toComponentId === arduino.id && pwmPins.includes(w.toPinId))
    );

    if (!hasPwmWire) {
      warnings.push('No PWM-capable pin connected. PWM dimming requires pins marked with a tilde (~), like D9.');
      suggestions.push('Connect the LED Anode to Arduino Pin ~D9.');
    }
  }

  // Check 7: Temperature Sensor (TMP36) circuit checks
  if (expectedType === 'temp-alert') {
    const tempSensors = components.filter(c => c.type === 'temperature');
    if (tempSensors.length === 0) {
      errors.push('Missing Temperature Sensor: Place a TMP36 Temperature Sensor on your workbench.');
      suggestions.push('Select "Temperature Sensor (TMP36)" from the Sensors category in the left panel.');
    } else {
      const tempSensor = tempSensors[0];
      const isPowered = graph.isSensorPowered(tempSensor.id, 'vcc', 'gnd');
      if (!isPowered) {
        warnings.push('Temperature sensor power pins (VCC or GND) are not fully connected.');
        suggestions.push('Connect VCC to 5V and GND to Arduino GND.');
      }

      const connectedAnalog = graph.getConnectedAnalogPin(tempSensor.id, 'vout');
      if (!connectedAnalog) {
        warnings.push('TMP36 VOUT pin is not connected to an Arduino Analog Pin (A0-A5).');
        suggestions.push('Wire the center pin (VOUT) of the TMP36 sensor to Arduino Analog Pin A1.');
      }
    }

    if (leds.length === 0) {
      warnings.push('No output LED placed. Add an LED to visually indicate high temperature alerts.');
    }
  }

  // Check 8: Soil Moisture Sensor circuit checks
  if (expectedType === 'soil-watering') {
    const soilSensors = components.filter(c => c.type === 'soilMoisture');
    if (soilSensors.length === 0) {
      errors.push('Missing Soil Moisture Sensor: Add a Soil Moisture Sensor from the component library.');
      suggestions.push('Select "Soil Moisture Sensor" from the Sensors category in the left panel.');
    } else {
      const soilSensor = soilSensors[0];
      const isPowered = graph.isSensorPowered(soilSensor.id, 'vcc', 'gnd');
      if (!isPowered) {
        warnings.push('Soil moisture sensor power pins (VCC or GND) are not fully connected.');
        suggestions.push('Connect VCC to 5V and GND to Arduino GND.');
      }

      const connectedAnalog = graph.getConnectedAnalogPin(soilSensor.id, 'sig');
      if (!connectedAnalog) {
        warnings.push('Soil sensor SIG pin is not connected to an Arduino Analog Pin.');
        suggestions.push('Wire the SIG pin of the Soil Moisture Sensor to Arduino Analog Pin A2.');
      }
    }

    if (leds.length === 0 && circuit.components.filter(c => c.type === 'buzzer').length === 0) {
      warnings.push('No actuator detected. Add an LED or Piezo Buzzer to signal low soil moisture alerts.');
    }
  }

  // Check 9: Smart Logic Rule mode checks
  if (expectedType === 'smart-logic') {
    const hasAnySensor = components.some(c => ['ldr', 'temperature', 'soilMoisture'].includes(c.type));
    if (!hasAnySensor) {
      errors.push('No sensors placed. Place an LDR, Temperature, or Soil Moisture sensor on your board.');
    }
    const hasAnyOutput = components.some(c => ['led', 'buzzer'].includes(c.type));
    if (!hasAnyOutput) {
      warnings.push('No output device placed. Place an LED or Buzzer to be activated by your rule.');
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    suggestions
  };
}
