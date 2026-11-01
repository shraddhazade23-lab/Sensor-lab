// Beginner and Intermediate Guided Electronics Projects

export const INITIAL_PROJECTS = [
  {
    id: 'proj-simple-led',
    title: 'Project 1: Basic LED Circuit & Resistor Guard',
    gradeLevels: [5, 6],
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    topic: 'Basic Circuits',
    thumbnail: '💡',
    description: 'Learn how to power a Light Emitting Diode safely using an Arduino 5V power supply and a 220Ω current-limiting resistor.',
    objectives: [
      'Connect Arduino 5V to the breadboard power rail.',
      'Connect an LED with correct polarity (Anode to power, Cathode to resistor).',
      'Use a 220Ω resistor to complete the return path to Ground (GND).'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno (Power Source)' },
      { type: 'breadboard', count: 1, label: 'Half-size Breadboard' },
      { type: 'led', count: 1, label: 'Red LED (5mm)' },
      { type: 'resistor', count: 1, label: '220Ω Resistor' },
      { type: 'wire', count: 3, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Place the Arduino Uno and Breadboard on your workspace.',
      'Step 2: Connect a red wire from the Arduino 5V pin to Breadboard Rail (+).',
      'Step 3: Connect a black wire from Arduino GND to Breadboard Rail (-).',
      'Step 4: Place a Red LED on the breadboard (Anode leg facing left/power rail).',
      'Step 5: Place a 220Ω resistor between the LED cathode and the ground rail.',
      'Step 6: Click "Run Simulation" to observe your virtual LED glowing safely!'
    ],
    supportedSimulationType: 'led-circuit',
    troubleshootingTips: [
      'If the LED does not light up, check if the LED polarity is reversed.',
      'Ensure both the 5V power and GND wires are firmly attached.',
      'Do not omit the resistor—running an LED without a resistor risks simulated burnout!'
    ],
    quizId: 'quiz-c5-led-resistor',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-led-1', type: 'led', label: 'Red LED', color: 'red', x: 440, y: 150, rotation: 0, state: false },
        { id: 'comp-res-1', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 440, y: 220, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: '5V', toComponentId: 'comp-breadboard-1', toPinId: 'power-pos', color: '#ef4444' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-3', fromComponentId: 'comp-breadboard-1', fromPinId: 'power-pos', toComponentId: 'comp-led-1', toPinId: 'anode', color: '#ef4444' },
        { id: 'wire-4', fromComponentId: 'comp-led-1', toPinId: 'cathode', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-5', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-button-led',
    title: 'Project 2: Push Button Controlled LED',
    gradeLevels: [5, 6, 7],
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    topic: 'Digital Inputs',
    thumbnail: '🔘',
    description: 'Add an interactive push button switch that closes the circuit when pressed, turning the LED ON instantly.',
    objectives: [
      'Understand how a momentary push button switch bridges an open circuit.',
      'Wire a push button in series with an LED and resistor.',
      'Interact with the push button during live virtual simulation.'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno (Power Source)' },
      { type: 'breadboard', count: 1, label: 'Half-size Breadboard' },
      { type: 'button', count: 1, label: 'Push Button Switch' },
      { type: 'led', count: 1, label: 'Green LED' },
      { type: 'resistor', count: 1, label: '220Ω Resistor' },
      { type: 'wire', count: 4, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Set up the 5V and GND rails on the breadboard from Arduino.',
      'Step 2: Place a push button across the breadboard center trough.',
      'Step 3: Connect 5V to one side of the push button switch.',
      'Step 4: Connect the other side of the push button to the LED Anode.',
      'Step 5: Connect the LED Cathode through a 220Ω resistor back to GND.',
      'Step 6: Run simulation, then click or hold the push button to turn the light ON!'
    ],
    supportedSimulationType: 'button-led',
    troubleshootingTips: [
      'Ensure the push button is placed correctly across the central divider.',
      'Verify that releasing the button opens the circuit and stops current.'
    ],
    quizId: 'quiz-c5-open-closed',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-button-1', type: 'button', label: 'Push Button', x: 440, y: 120, rotation: 0, pressed: false },
        { id: 'comp-led-1', type: 'led', label: 'Green LED', color: 'green', x: 440, y: 200, rotation: 0, state: false },
        { id: 'comp-res-1', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 440, y: 280, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: '5V', toComponentId: 'comp-breadboard-1', toPinId: 'power-pos', color: '#ef4444' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-3', fromComponentId: 'comp-breadboard-1', fromPinId: 'power-pos', toComponentId: 'comp-button-1', toPinId: 'pin1', color: '#ef4444' },
        { id: 'wire-4', fromComponentId: 'comp-button-1', toPinId: 'pin2', toComponentId: 'comp-led-1', toPinId: 'anode', color: '#22c55e' },
        { id: 'wire-5', fromComponentId: 'comp-led-1', toPinId: 'cathode', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-6', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-ldr-indicator',
    title: 'Project 3: Light Sensor (LDR) Monitor',
    gradeLevels: [6, 7],
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    topic: 'Sensors & Analog Inputs',
    thumbnail: '☀️',
    description: 'Connect a Light-Dependent Resistor (LDR) to an Arduino Analog Pin (A0) to read environmental illumination and display numerical lux values.',
    objectives: [
      'Create a voltage divider circuit using an LDR and a 10kΩ reference resistor.',
      'Feed the divider voltage into Arduino Analog Pin A0.',
      'Observe analog readings from 0 (pitch dark) to 1023 (bright sun) as you move the ambient light slider.'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno' },
      { type: 'breadboard', count: 1, label: 'Breadboard' },
      { type: 'ldr', count: 1, label: 'LDR (Photoresistor)' },
      { type: 'resistor', count: 1, label: '10kΩ Voltage Divider Resistor' },
      { type: 'wire', count: 5, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Connect 5V and GND from Arduino to the breadboard rails.',
      'Step 2: Place the LDR on the breadboard and connect one leg to 5V.',
      'Step 3: Connect the other leg of the LDR to a 10kΩ resistor, and ground the other side of the resistor.',
      'Step 4: Tap into the junction between the LDR and 10kΩ resistor with a wire connected to Arduino Analog Pin A0.',
      'Step 5: Run the simulation and slide the Virtual Ambient Light control to watch live readings!'
    ],
    supportedSimulationType: 'ldr-sensor',
    troubleshootingTips: [
      'Ensure the junction wire connects specifically to Analog In A0.',
      'Use a 10kΩ resistor (Brown-Black-Orange) for optimal voltage divider sensitivity.'
    ],
    quizId: 'quiz-c6-ldr-light',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-ldr-1', type: 'ldr', label: 'Photoresistor (LDR)', x: 440, y: 130, rotation: 0, lightLevel: 75 },
        { id: 'comp-res-1', type: 'resistor', label: '10kΩ Resistor', resistance: 10000, x: 440, y: 220, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: '5V', toComponentId: 'comp-breadboard-1', toPinId: 'power-pos', color: '#ef4444' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-3', fromComponentId: 'comp-breadboard-1', toPinId: 'power-pos', toComponentId: 'comp-ldr-1', toPinId: 'pin1', color: '#ef4444' },
        { id: 'wire-4', fromComponentId: 'comp-ldr-1', toPinId: 'pin2', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-5', fromComponentId: 'comp-ldr-1', toPinId: 'pin2', toComponentId: 'comp-arduino-1', toPinId: 'A0', color: '#3b82f6' },
        { id: 'wire-6', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-auto-nightlight',
    title: 'Project 4: Smart Automatic Night Light',
    gradeLevels: [6, 7],
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    topic: 'Automation & Logic',
    thumbnail: '🌙',
    description: 'Build an autonomous night lamp that automatically illuminates when darkness falls below a programmable threshold.',
    objectives: [
      'Combine an LDR sensor input with an LED indicator output.',
      'Configure an automated decision threshold (e.g. analog reading < 400).',
      'Demonstrate how microcontrollers act as autonomous environmental controllers.'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno' },
      { type: 'breadboard', count: 1, label: 'Breadboard' },
      { type: 'ldr', count: 1, label: 'LDR Photoresistor' },
      { type: 'led', count: 1, label: 'Yellow Night Light LED' },
      { type: 'resistor', count: 2, label: '10kΩ (Sensor) + 220Ω (LED Guard)' },
      { type: 'wire', count: 7, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Set up the LDR voltage divider on Analog Pin A0.',
      'Step 2: Place a Yellow LED on the breadboard and connect its Anode to Arduino Digital Pin D13.',
      'Step 3: Connect the LED Cathode to Ground through a 220Ω resistor.',
      'Step 4: In the simulation, adjust the ambient sunlight down into dusk/night.',
      'Step 5: Watch the microcontroller trigger the lamp ON whenever ambient light drops below 40%!'
    ],
    supportedSimulationType: 'auto-nightlight',
    troubleshootingTips: [
      'Confirm the LED is wired to Pin D13 and LDR to A0.',
      'Adjust the threshold slider in the simulation panel to calibrate for your desired sensitivity.'
    ],
    quizId: 'quiz-c7-automation',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-ldr-1', type: 'ldr', label: 'Photoresistor (LDR)', x: 440, y: 120, rotation: 0, lightLevel: 80 },
        { id: 'comp-res-sensor', type: 'resistor', label: '10kΩ Resistor', resistance: 10000, x: 440, y: 190, rotation: 0 },
        { id: 'comp-led-1', type: 'led', label: 'Night Lamp LED', color: 'yellow', x: 530, y: 120, rotation: 0, state: false },
        { id: 'comp-res-led', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 530, y: 200, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: '5V', toComponentId: 'comp-breadboard-1', toPinId: 'power-pos', color: '#ef4444' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-3', fromComponentId: 'comp-breadboard-1', toPinId: 'power-pos', toComponentId: 'comp-ldr-1', toPinId: 'pin1', color: '#ef4444' },
        { id: 'wire-4', fromComponentId: 'comp-ldr-1', toPinId: 'pin2', toComponentId: 'comp-res-sensor', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-5', fromComponentId: 'comp-ldr-1', toPinId: 'pin2', toComponentId: 'comp-arduino-1', toPinId: 'A0', color: '#3b82f6' },
        { id: 'wire-6', fromComponentId: 'comp-res-sensor', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-7', fromComponentId: 'comp-arduino-1', fromPinId: 'D13', toComponentId: 'comp-led-1', toPinId: 'anode', color: '#eab308' },
        { id: 'wire-8', fromComponentId: 'comp-led-1', toPinId: 'cathode', toComponentId: 'comp-res-led', toPinId: 'pin1', color: '#14b8a6' },
        { id: 'wire-9', fromComponentId: 'comp-res-led', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-pwm-brightness',
    title: 'Project 5: PWM LED Smooth Dimmer Control',
    gradeLevels: [7],
    difficulty: 'Advanced Middle',
    estimatedMinutes: 20,
    topic: 'PWM & Analog Output',
    thumbnail: '🎛️',
    description: 'Master Pulse-Width Modulation (PWM) on Arduino Digital Pin D9 to smoothly fade an LED from gentle glow to full brilliance.',
    objectives: [
      'Learn why PWM pins are marked with a tilde (~).',
      'Understand the relationship between duty cycle (0–100%) and brightness.',
      'Control simulated PWM levels in real time from 0 to 255.'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno' },
      { type: 'breadboard', count: 1, label: 'Breadboard' },
      { type: 'led', count: 1, label: 'Blue High-Efficiency LED' },
      { type: 'resistor', count: 1, label: '220Ω Resistor' },
      { type: 'wire', count: 3, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Connect Arduino GND to Breadboard GND rail.',
      'Step 2: Connect Arduino PWM Pin ~D9 to the Blue LED Anode.',
      'Step 3: Connect the LED Cathode to the 220Ω resistor, and ground the resistor.',
      'Step 4: Run simulation and move the PWM Duty Cycle slider (0–255).',
      'Step 5: Inspect the simulated waveform visualization and LED brightness changes.'
    ],
    supportedSimulationType: 'pwm-brightness',
    troubleshootingTips: [
      'PWM is only available on specific pins (D3, D5, D6, D9, D10, D11). Pin D9 is recommended.',
      'Value 0 = 0% duty (Off); Value 128 = 50% duty (Half bright); Value 255 = 100% duty (Full bright).'
    ],
    quizId: 'quiz-c7-pwm',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-led-1', type: 'led', label: 'Blue LED', color: 'blue', x: 440, y: 140, rotation: 0, state: true, brightness: 128 },
        { id: 'comp-res-1', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 440, y: 220, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: 'D9', toComponentId: 'comp-led-1', toPinId: 'anode', color: '#3b82f6' },
        { id: 'wire-2', fromComponentId: 'comp-led-1', toPinId: 'cathode', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-3', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-4', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-ultrasonic-radar',
    title: 'Project 6: Ultrasonic Distance Radar & Proximity Warning',
    gradeLevels: [8, 9],
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    topic: 'Time-of-Flight & Microcontrollers',
    thumbnail: '🦇',
    description: 'Use high-frequency ultrasonic sound bursts to measure distance, compute object proximity in centimeters, and trigger warning LEDs.',
    objectives: [
      'Understand how echolocation and the speed of sound (343 m/s) measure distance.',
      'Send a 10µs pulse to the Trigger pin and calculate duration with the Echo pin.',
      'Implement multi-level proximity warning zones (Safe, Caution, Danger).'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno' },
      { type: 'breadboard', count: 1, label: 'Breadboard' },
      { type: 'led', count: 2, label: 'Green & Red Indicator LEDs' },
      { type: 'resistor', count: 2, label: '220Ω Resistors' },
      { type: 'wire', count: 8, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Wire 5V and GND rails to the breadboard.',
      'Step 2: Connect the Red LED to Arduino Pin D8 and Green LED to D7 via 220Ω resistors.',
      'Step 3: Connect the simulated sensor trigger line to D12 and echo line to D11.',
      'Step 4: Run simulation and adjust object distance to trigger the proximity warning zones.'
    ],
    supportedSimulationType: 'ultrasonic-radar',
    troubleshootingTips: [
      'Distance formula: Distance (cm) = (Time in microseconds × 0.0343) / 2.',
      'Ensure the sound wave travel time is divided by 2 for the round-trip.'
    ],
    quizId: 'quiz-c7-pwm',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-led-green', type: 'led', label: 'Safe Zone LED', color: 'green', x: 440, y: 130, rotation: 0, state: true },
        { id: 'comp-led-red', type: 'led', label: 'Warning LED', color: 'red', x: 530, y: 130, rotation: 0, state: false },
        { id: 'comp-res-1', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 440, y: 210, rotation: 0 },
        { id: 'comp-res-2', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 530, y: 210, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: 'D7', toComponentId: 'comp-led-green', toPinId: 'anode', color: '#22c55e' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'D8', toComponentId: 'comp-led-red', toPinId: 'anode', color: '#ef4444' },
        { id: 'wire-3', fromComponentId: 'comp-led-green', toPinId: 'cathode', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-4', fromComponentId: 'comp-led-red', toPinId: 'cathode', toComponentId: 'comp-res-2', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-5', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-6', fromComponentId: 'comp-res-2', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-7', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-temp-fan',
    title: 'Project 7: Smart Temperature Monitor & Automated Cooling',
    gradeLevels: [8, 9, 10],
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    topic: 'Analog Interfacing & Actuation',
    thumbnail: '❄️',
    description: 'Interface an analog temperature sensor to continuously monitor climate conditions and trigger an automated cooling fan circuit when heat thresholds exceed safe limits.',
    objectives: [
      'Calibrate analog voltage readings into degrees Celsius.',
      'Construct a threshold comparator logic (e.g., Temperature > 28°C triggers cooling).',
      'Learn how microcontrollers isolate low-power logic from higher current actuators.'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno' },
      { type: 'breadboard', count: 1, label: 'Breadboard' },
      { type: 'ldr', count: 1, label: 'Analog Sensor Probe' },
      { type: 'led', count: 1, label: 'Cooling Active Indicator' },
      { type: 'resistor', count: 2, label: '10kΩ Reference + 220Ω Current Limiter' },
      { type: 'wire', count: 7, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Set up 5V and GND power rails on the breadboard.',
      'Step 2: Connect the sensor probe in a voltage divider into Analog Pin A1.',
      'Step 3: Connect Digital Pin D6 to the cooling indicator LED through a 220Ω resistor.',
      'Step 4: Run simulation, raise the temperature slider, and observe automated cooling engagement!'
    ],
    supportedSimulationType: 'auto-nightlight',
    troubleshootingTips: [
      'Check that the sensor tap connects to Analog Pin A1.',
      'Verify hysteresis to avoid rapid flapping on temperature boundary values.'
    ],
    quizId: 'quiz-c7-automation',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-ldr-1', type: 'ldr', label: 'Temperature Probe', x: 440, y: 120, rotation: 0, lightLevel: 50 },
        { id: 'comp-res-1', type: 'resistor', label: '10kΩ Resistor', resistance: 10000, x: 440, y: 190, rotation: 0 },
        { id: 'comp-led-1', type: 'led', label: 'Fan Relay LED', color: 'blue', x: 530, y: 120, rotation: 0, state: false },
        { id: 'comp-res-2', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 530, y: 200, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: '5V', toComponentId: 'comp-breadboard-1', toPinId: 'power-pos', color: '#ef4444' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-3', fromComponentId: 'comp-breadboard-1', toPinId: 'power-pos', toComponentId: 'comp-ldr-1', toPinId: 'pin1', color: '#ef4444' },
        { id: 'wire-4', fromComponentId: 'comp-ldr-1', toPinId: 'pin2', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-5', fromComponentId: 'comp-ldr-1', toPinId: 'pin2', toComponentId: 'comp-arduino-1', toPinId: 'A0', color: '#3b82f6' },
        { id: 'wire-6', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-7', fromComponentId: 'comp-arduino-1', fromPinId: 'D9', toComponentId: 'comp-led-1', toPinId: 'anode', color: '#3b82f6' },
        { id: 'wire-8', fromComponentId: 'comp-led-1', toPinId: 'cathode', toComponentId: 'comp-res-2', toPinId: 'pin1', color: '#14b8a6' },
        { id: 'wire-9', fromComponentId: 'comp-res-2', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  },
  {
    id: 'proj-smart-alarm',
    title: 'Project 8: Dual-Sensor Security Alarm & Logic Gate Controller',
    gradeLevels: [9, 10],
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    topic: 'Security Systems & Digital Logic',
    thumbnail: '🚨',
    description: 'Design a commercial-grade burglar alarm with push-button arming/disarming, trip sensor logic, and audible alarm strobe sequencing.',
    objectives: [
      'Implement multi-condition logical operations (AND/OR latching).',
      'Create an armed state machine that toggles with button input.',
      'Drive pulsing warning signals when security boundaries are breached.'
    ],
    components: [
      { type: 'arduino', count: 1, label: 'Arduino Uno' },
      { type: 'breadboard', count: 1, label: 'Breadboard' },
      { type: 'button', count: 1, label: 'Arming Switch' },
      { type: 'led', count: 2, label: 'Status & Strobe LEDs' },
      { type: 'resistor', count: 3, label: '220Ω and 10kΩ Resistors' },
      { type: 'wire', count: 9, label: 'Jumper Wires' }
    ],
    instructions: [
      'Step 1: Connect power and ground rails to the breadboard.',
      'Step 2: Wire the push button with a pull-down resistor to Pin D2.',
      'Step 3: Connect Status LED to Pin D10 and Alarm Strobe LED to Pin D13.',
      'Step 4: Run simulation, press the Arming Switch to arm the system, and simulate a breach to trigger the alarm strobe!'
    ],
    supportedSimulationType: 'button-led',
    troubleshootingTips: [
      'Verify that the pull-down resistor prevents floating inputs on Pin D2.',
      'Confirm the latching state logic resets properly when the disarm key is held.'
    ],
    quizId: 'quiz-c7-automation',
    initialCircuit: {
      components: [
        { id: 'comp-arduino-1', type: 'arduino', label: 'Arduino Uno', x: 50, y: 50, rotation: 0 },
        { id: 'comp-breadboard-1', type: 'breadboard', label: 'Breadboard', x: 380, y: 50, rotation: 0 },
        { id: 'comp-button-1', type: 'button', label: 'Disarm Key', x: 440, y: 120, rotation: 0, pressed: false },
        { id: 'comp-led-1', type: 'led', label: 'Alarm Strobe', color: 'red', x: 440, y: 200, rotation: 0, state: false },
        { id: 'comp-res-1', type: 'resistor', label: '220Ω Resistor', resistance: 220, x: 440, y: 280, rotation: 0 }
      ],
      connections: [
        { id: 'wire-1', fromComponentId: 'comp-arduino-1', fromPinId: '5V', toComponentId: 'comp-breadboard-1', toPinId: 'power-pos', color: '#ef4444' },
        { id: 'wire-2', fromComponentId: 'comp-arduino-1', fromPinId: 'GND_1', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' },
        { id: 'wire-3', fromComponentId: 'comp-breadboard-1', toPinId: 'power-pos', toComponentId: 'comp-button-1', toPinId: 'pin1', color: '#ef4444' },
        { id: 'wire-4', fromComponentId: 'comp-button-1', toPinId: 'pin2', toComponentId: 'comp-led-1', toPinId: 'anode', color: '#ef4444' },
        { id: 'wire-5', fromComponentId: 'comp-led-1', toPinId: 'cathode', toComponentId: 'comp-res-1', toPinId: 'pin1', color: '#eab308' },
        { id: 'wire-6', fromComponentId: 'comp-res-1', toPinId: 'pin2', toComponentId: 'comp-breadboard-1', toPinId: 'power-neg', color: '#1e293b' }
      ]
    },
    published: true
  }
];
