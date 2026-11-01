// Controlled Simulation Engine for SensorLab Virtual Lab

import { ConnectionGraph } from './connectionGraph.js';

export class SimulationEngine {
  constructor() {
    this.logs = [];
    this.maxLogs = 30;
  }

  log(message, type = 'info') {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logs.unshift({ time, message, type, id: Math.random().toString(36).substr(2, 6) });
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  step(circuit, mode = 'generic', inputs = {}, tick = 0) {
    const graph = new ConnectionGraph(circuit);
    const arduino = circuit.components.find(c => c.type === 'arduino');
    const leds = circuit.components.filter(c => c.type === 'led');
    const resistors = circuit.components.filter(c => c.type === 'resistor');
    const buzzers = circuit.components.filter(c => c.type === 'buzzer');

    // Extract simulated inputs with safe defaults
    const ambientLight = inputs.ambientLight !== undefined ? Number(inputs.ambientLight) : 70;
    const temperature = inputs.temperature !== undefined ? Number(inputs.temperature) : 25;
    const soilMoisture = inputs.soilMoisture !== undefined ? Number(inputs.soilMoisture) : 45;
    const buttonPressed = !!inputs.buttonPressed;
    const pwmValue = inputs.pwmValue !== undefined ? Number(inputs.pwmValue) : 128;
    const threshold = inputs.threshold !== undefined ? Number(inputs.threshold) : 400;
    const tempThreshold = inputs.tempThreshold !== undefined ? Number(inputs.tempThreshold) : 30;
    const moistureThreshold = inputs.moistureThreshold !== undefined ? Number(inputs.moistureThreshold) : 35;
    const logicRule = inputs.logicRule || {
      sensor: 'temp',
      operator: '>',
      threshold: 30,
      targetOutput: 'led'
    };

    // Sensor calculations (simulated software physics)
    // 1. Temperature Sensor (TMP36: Vout = (temp * 10mV) + 500mV)
    const rawTempVoltage = (temperature * 0.01) + 0.50;
    const tempVoltage = parseFloat(Math.max(0, Math.min(5.0, rawTempVoltage)).toFixed(2));
    const tempAdc = Math.min(1023, Math.max(0, Math.round((tempVoltage / 5.0) * 1023)));

    // 2. Light Sensor (LDR: 0% dark -> 0V, 100% sun -> 5V)
    const lightAdc = Math.min(1023, Math.max(0, Math.round((ambientLight / 100) * 1023)));
    const lightVoltage = parseFloat(((lightAdc / 1023) * 5.0).toFixed(2));

    // 3. Soil Moisture Sensor (0% dry -> 0V/0 ADC, 100% wet -> 5V/1023 ADC)
    const soilAdc = Math.min(1023, Math.max(0, Math.round((soilMoisture / 100) * 1023)));
    const soilVoltage = parseFloat(((soilAdc / 1023) * 5.0).toFixed(2));

    // Output telemetry state
    const outputs = {
      isSimulating: true,
      mode,
      ledState: false,
      ledBrightness: 0,
      buzzerState: false,
      analogReading: lightAdc,
      sensorVoltage: lightVoltage,
      currentMa: 0.0,
      // Telemetry fields
      temperature,
      tempVoltage,
      tempAdc,
      ambientLight,
      lightVoltage,
      lightAdc,
      soilMoisture,
      soilVoltage,
      soilAdc,
      statusLabel: 'Virtual Simulation Active (Simulated)',
      digitalPinStates: {},
      analogPinStates: {
        A0: lightAdc,
        A1: tempAdc,
        A2: soilAdc
      },
      activeRule: null,
      summary: '',
      error: null
    };

    // Check basic power from Arduino
    if (!arduino) {
      outputs.summary = 'No power source connected. Place an Arduino Uno to provide 5V and GND.';
      return outputs;
    }

    // Evaluate based on simulation mode
    switch (mode) {
      case 'led-circuit': {
        const led = leds[0];
        if (led) {
          const anodePowered = graph.isConnectedTo5V(led.id, 'anode');
          const cathodeGrounded = graph.isConnectedToGND(led.id, 'cathode');

          if (anodePowered && cathodeGrounded) {
            const hasResistor = resistors.length > 0;
            outputs.ledState = true;
            outputs.ledBrightness = 255;
            outputs.currentMa = hasResistor ? 14.5 : 45.0; // Safe vs high current
            outputs.summary = hasResistor
              ? 'Complete circuit! 5V DC flows through LED and 220Ω resistor safely (~14.5 mA).'
              : '⚠️ Complete circuit, but current is dangerously high without a resistor! (~45 mA)';
          } else {
            outputs.ledState = false;
            outputs.summary = 'Circuit is OPEN. Current cannot flow until both 5V and GND form a closed loop.';
          }
        } else {
          outputs.summary = 'Place an LED on the breadboard and connect it to 5V and GND through a resistor.';
        }
        break;
      }

      case 'blinking-led': {
        const isTickOn = tick % 2 === 0;
        const led = leds[0];
        const buzzer = buzzers[0];

        outputs.ledState = isTickOn;
        outputs.ledBrightness = isTickOn ? 255 : 0;
        outputs.digitalPinStates['D13'] = isTickOn;
        outputs.currentMa = isTickOn ? 14.5 : 0.0;

        if (buzzer) {
          outputs.buzzerState = isTickOn;
        }

        outputs.summary = isTickOn
          ? '⚡ Blinking loop: State is HIGH (LED ON, Pin D13 Active). Will toggle next interval.'
          : '⏸️ Blinking loop: State is LOW (LED OFF, Pin D13 Low). Will toggle next interval.';
        break;
      }

      case 'buzzer-alarm': {
        const buzzer = buzzers[0];
        const isAlarmOn = tick % 2 === 0;

        outputs.buzzerState = isAlarmOn;
        outputs.ledState = isAlarmOn;
        outputs.ledBrightness = isAlarmOn ? 255 : 0;
        outputs.digitalPinStates['D8'] = isAlarmOn;
        outputs.currentMa = isAlarmOn ? 25.0 : 2.0;

        outputs.summary = isAlarmOn
          ? '🚨 Audible Security Alarm: Piezo Buzzer emitting 880Hz audio tone! LED pulsing in sync.'
          : '⏸️ Alarm sequence pause: Buzzer silent.';
        break;
      }

      case 'button-led': {
        const led = leds[0];
        const buzzer = buzzers[0];
        if (buttonPressed) {
          outputs.ledState = true;
          outputs.ledBrightness = 255;
          outputs.buzzerState = !!buzzer;
          outputs.currentMa = 14.5 + (buzzer ? 18.0 : 0);
          outputs.summary = buzzer
            ? 'Button PRESSED: Switch loop closed! LED illuminates and Buzzer produces sound.'
            : 'Button PRESSED: The internal switch contacts bridge the loop. LED illuminates!';
        } else {
          outputs.ledState = false;
          outputs.ledBrightness = 0;
          outputs.buzzerState = false;
          outputs.currentMa = 0.0;
          outputs.summary = 'Button RELEASED: Circuit loop is open. No electrons are circulating.';
        }
        break;
      }

      case 'ldr-sensor': {
        outputs.analogReading = lightAdc;
        outputs.sensorVoltage = lightVoltage;
        outputs.summary = `Ambient light at ${ambientLight}%: Voltage divider outputs ${lightVoltage}V (Simulated ADC: ${lightAdc}/1023).`;
        break;
      }

      case 'auto-nightlight': {
        const isNight = lightAdc < threshold;
        outputs.analogReading = lightAdc;
        outputs.sensorVoltage = lightVoltage;
        outputs.digitalPinStates['D13'] = isNight;
        outputs.ledState = isNight;
        outputs.ledBrightness = isNight ? 255 : 0;
        outputs.currentMa = isNight ? 14.5 : 0.0;

        outputs.summary = isNight
          ? `🌙 Ambient light (${lightAdc}) is BELOW threshold (${threshold}) → Night lamp activated (D13 HIGH)!`
          : `☀️ Ambient light (${lightAdc}) is ABOVE threshold (${threshold}) → Night lamp turned OFF (D13 LOW).`;
        break;
      }

      case 'temp-alert': {
        const isOverheating = temperature > tempThreshold;
        outputs.analogReading = tempAdc;
        outputs.sensorVoltage = tempVoltage;
        outputs.digitalPinStates['D6'] = isOverheating;
        outputs.ledState = isOverheating;
        outputs.ledBrightness = isOverheating ? 255 : 0;
        outputs.buzzerState = isOverheating;
        outputs.currentMa = isOverheating ? 18.2 : 2.1;

        outputs.summary = isOverheating
          ? `🔥 HIGH TEMP ALERT! Simulated Temperature ${temperature}°C (${tempVoltage}V, ADC: ${tempAdc}) exceeds threshold (${tempThreshold}°C) → Cooling Fan / Alert LED ON!`
          : `❄️ Temperature NORMAL (${temperature}°C, ${tempVoltage}V). Below threshold (${tempThreshold}°C) → Cooling Fan / LED is OFF.`;
        break;
      }

      case 'soil-watering': {
        const isDry = soilMoisture < moistureThreshold;
        outputs.analogReading = soilAdc;
        outputs.sensorVoltage = soilVoltage;
        outputs.digitalPinStates['D8'] = isDry;
        outputs.ledState = isDry;
        outputs.ledBrightness = isDry ? 255 : 0;
        outputs.buzzerState = isDry;
        outputs.currentMa = isDry ? 19.5 : 3.0;

        const moistureDesc = soilMoisture < 25 ? 'Bone Dry' : soilMoisture < 60 ? 'Moist / Ideal' : 'Water Saturated';
        outputs.summary = isDry
          ? `🌱 SOIL DRY (${soilMoisture}%, Status: ${moistureDesc}, ADC: ${soilAdc})! Below moisture threshold (${moistureThreshold}%) → Irrigation Pump / Warning LED ON!`
          : `💧 SOIL HYDRATED & ADEQUATE (${soilMoisture}%, Status: ${moistureDesc}, ADC: ${soilAdc}). Above threshold (${moistureThreshold}%) → Irrigation Pump is standby (OFF).`;
        break;
      }

      case 'smart-logic': {
        // Evaluates user-configured rule
        let currentVal = temperature;
        let sensorLabel = 'Temperature';
        let unit = '°C';

        if (logicRule.sensor === 'light') {
          currentVal = ambientLight;
          sensorLabel = 'Ambient Light';
          unit = '%';
        } else if (logicRule.sensor === 'moisture') {
          currentVal = soilMoisture;
          sensorLabel = 'Soil Moisture';
          unit = '%';
        }

        const isConditionMet = logicRule.operator === '>' 
          ? (currentVal > logicRule.threshold)
          : (currentVal < logicRule.threshold);

        outputs.ledState = isConditionMet;
        outputs.ledBrightness = isConditionMet ? 255 : 0;
        outputs.buzzerState = isConditionMet && logicRule.targetOutput === 'buzzer';
        outputs.digitalPinStates['D13'] = isConditionMet;
        outputs.currentMa = isConditionMet ? 15.0 : 0.0;

        outputs.activeRule = {
          conditionMet: isConditionMet,
          message: `IF ${sensorLabel} (${currentVal}${unit}) ${logicRule.operator} ${logicRule.threshold}${unit} ➔ Output ${isConditionMet ? 'ACTIVATED' : 'OFF'}`
        };

        outputs.summary = isConditionMet
          ? `✅ LOGIC RULE TRIGGERED: ${sensorLabel} is ${currentVal}${unit}, which satisfies "${logicRule.operator} ${logicRule.threshold}${unit}". Turning ${logicRule.targetOutput === 'buzzer' ? 'Buzzer' : 'LED'} ON!`
          : `⏸️ LOGIC CONDITION NOT MET: ${sensorLabel} is ${currentVal}${unit}, which is not "${logicRule.operator} ${logicRule.threshold}${unit}". Output is OFF.`;
        break;
      }

      case 'pwm-brightness': {
        outputs.ledBrightness = pwmValue;
        outputs.ledState = pwmValue > 5;
        const dutyPercent = ((pwmValue / 255) * 100).toFixed(1);
        const effectiveVoltage = ((pwmValue / 255) * 5.0).toFixed(2);

        outputs.digitalPinStates['D9'] = pwmValue;
        outputs.sensorVoltage = parseFloat(effectiveVoltage);
        outputs.currentMa = parseFloat(((pwmValue / 255) * 18.0).toFixed(1));
        outputs.summary = `PWM Duty Cycle: ${dutyPercent}% (Value: ${pwmValue}/255). Perceived voltage: ${effectiveVoltage}V.`;
        break;
      }

      default: {
        let anyLedLit = false;
        let anyBuzzerActive = false;

        for (const led of leds) {
          const anodePowered = graph.isConnectedTo5V(led.id, 'anode');
          const cathodeGrounded = graph.isConnectedToGND(led.id, 'cathode');
          if (anodePowered && cathodeGrounded) {
            anyLedLit = true;
          }
        }

        for (const b of buzzers) {
          const posPowered = graph.isConnectedTo5V(b.id, 'pos');
          const negGrounded = graph.isConnectedToGND(b.id, 'neg');
          if (posPowered && negGrounded) {
            anyBuzzerActive = true;
          }
        }

        outputs.ledState = anyLedLit;
        outputs.ledBrightness = anyLedLit ? 255 : 0;
        outputs.buzzerState = anyBuzzerActive;
        outputs.currentMa = (anyLedLit ? 14.5 : 0) + (anyBuzzerActive ? 18.0 : 0);
        outputs.summary = (anyLedLit || anyBuzzerActive)
          ? `Virtual circuit energized: ${anyLedLit ? 'LED illuminated. ' : ''}${anyBuzzerActive ? 'Buzzer sounding tone.' : ''}`
          : 'Circuit ready. Complete connections to energize.';
        break;
      }
    }

    return outputs;
  }
}
