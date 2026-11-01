// Comprehensive Educational Modules & Lessons for Classes 5, 6, and 7

export const INITIAL_MODULES = [
  {
    id: 'mod-c5-electronics',
    title: 'Class 5: Introduction to Electronics & Circuits',
    description: 'Discover how electricity moves, understand simple circuits, and meet friendly components like LEDs and resistors!',
    gradeLevels: [5],
    topic: 'Electronics Fundamentals',
    difficulty: 'Beginner',
    thumbnail: '⚡',
    sortOrder: 1,
    lessonIds: ['les-c5-what-is-electronics', 'les-c5-open-closed-circuits', 'les-c5-led-and-resistor'],
    published: true,
  },
  {
    id: 'mod-c6-sensors',
    title: 'Class 6: Sensors & Microcontroller Brains',
    description: 'Learn how sensors give computers senses like seeing light and feeling temperature, and how microcontrollers make decisions!',
    gradeLevels: [6],
    topic: 'Sensors & Controllers',
    difficulty: 'Intermediate',
    thumbnail: '📡',
    sortOrder: 2,
    lessonIds: ['les-c6-what-is-a-sensor', 'les-c6-light-sensing-ldr', 'les-c6-microcontroller-intro'],
    published: true,
  },
  {
    id: 'mod-c7-systems',
    title: 'Class 7: Smart Systems & Automation',
    description: 'Combine inputs and outputs to build automatic night lamps, control LED brightness with PWM, and debug smart gadgets!',
    gradeLevels: [7],
    topic: 'Automation & Systems',
    difficulty: 'Advanced Middle',
    thumbnail: '🤖',
    sortOrder: 3,
    lessonIds: ['les-c7-analog-vs-digital', 'les-c7-pwm-brightness', 'les-c7-automation-thresholds'],
    published: true,
  }
];

export const INITIAL_LESSONS = [
  // Class 5 Lessons
  {
    id: 'les-c5-what-is-electronics',
    moduleId: 'mod-c5-electronics',
    title: 'What is Electronics? The Magic Flow of Electrons',
    sortOrder: 1,
    gradeLevel: 5,
    estimatedMinutes: 10,
    learningObjectives: [
      'Understand what electricity and tiny electrons are.',
      'Differentiate between electrical appliances and electronic gadgets.',
      'Identify basic terms: Voltage, Current, and Resistance.'
    ],
    introduction: 'Have you ever wondered how a video game console, a smartphone, or a flashlight works? They all run on the magic flow of invisible particles called electrons!',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'Electrical vs. Electronic: What is the Difference?',
        body: 'An electric heater or a simple ceiling fan just uses electricity to produce heat or spin blades. But an electronic device (like your phone or a microwave timer) controls the electricity precisely to make decisions and process information!'
      },
      {
        type: 'analogy',
        heading: 'The Water Pipe Analogy',
        body: 'Imagine electricity flowing like water in garden pipes:\n• Voltage (V): The water pressure pushing the water forward.\n• Current (I): The amount of water flowing through the pipe per second.\n• Resistance (R): A squeeze or narrow valve that slows down the water flow.'
      },
      {
        type: 'realLife',
        heading: 'Everyday Example',
        body: 'When you slide the volume button up on your headphones, you are changing the resistance inside the circuit so more audio current can reach your ears!'
      }
    ],
    activityInstructions: 'Look around your room. Name 2 purely electrical items and 2 electronic items. Notice how electronic items usually have screens, buttons, or smart lights!',
    quizId: 'quiz-c5-what-is-electronics',
    relatedProjectIds: ['proj-simple-led'],
    published: true
  },
  {
    id: 'les-c5-open-closed-circuits',
    moduleId: 'mod-c5-electronics',
    title: 'Closed Circuits vs. Open Circuits: Complete the Loop!',
    sortOrder: 2,
    gradeLevel: 5,
    estimatedMinutes: 12,
    learningObjectives: [
      'Learn what makes an electrical circuit work.',
      'Explain why a loop must be closed for electrons to travel.',
      'Discover how switches work to open and close loops safely.'
    ],
    introduction: 'Electrons are team runners—they only move if there is a complete track starting from the battery power terminal (+) and returning all the way back to ground (-).',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'The Unbroken Loop',
        body: 'A "Closed Circuit" is an unbroken circular road. Electrons leave the positive terminal (5V), power up a light bulb, and return to Ground (GND). If the wire is cut or detached, it becomes an "Open Circuit" and the light goes dark instantly!'
      },
      {
        type: 'diagram',
        heading: 'Meet the Switch',
        body: 'A switch is a friendly bridge. When you flip the switch ON, the bridge lowers to close the gap. When you flip it OFF, the bridge lifts up, creating an open circuit to stop electricity without unplugging any wires.'
      }
    ],
    activityInstructions: 'In our Virtual Lab, place a battery, an LED, and a push button. Watch how pressing the button closes the path to light up the LED!',
    quizId: 'quiz-c5-open-closed',
    relatedProjectIds: ['proj-button-led'],
    published: true
  },
  {
    id: 'les-c5-led-and-resistor',
    moduleId: 'mod-c5-electronics',
    title: 'LEDs and Resistors: Best Friends in Electronics',
    sortOrder: 3,
    gradeLevel: 5,
    estimatedMinutes: 15,
    learningObjectives: [
      'Identify the Anode (+) and Cathode (-) of a Light Emitting Diode (LED).',
      'Explain why an LED will burn out if connected directly without a resistor.',
      'Calculate why a 220 Ohm or 330 Ohm resistor protects our components.'
    ],
    introduction: 'LEDs are tiny semiconductors that convert electricity directly into vibrant light. But they are sensitive! Giving them too much current can burn them out in a split second.',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'LED Polarity: Direction Matters!',
        body: 'Unlike a normal light bulb, an LED only allows current to travel in ONE direction.\n• Long leg (Anode): Connects toward positive (+) / 5V.\n• Short leg (Cathode): Connects toward Ground (-) / GND.\nIf you plug it backwards, no current flows and it will not turn on!'
      },
      {
        type: 'concept',
        heading: 'Why We Need a Resistor Bodyguard',
        body: 'An LED has almost no internal resistance once it starts glowing. If connected straight to 5 Volts, a huge surge of current rushes in, destroying the LED! A 220 Ohm resistor acts like a gentle speed-breaker, keeping the current at a safe 15 to 20 milliamps.'
      }
    ],
    activityInstructions: 'Head over to the Virtual Lab! Try running the LED with a 220Ω resistor, and observe the educational validator explain the power path.',
    quizId: 'quiz-c5-led-resistor',
    relatedProjectIds: ['proj-simple-led'],
    published: true
  },

  // Class 6 Lessons
  {
    id: 'les-c6-what-is-a-sensor',
    moduleId: 'mod-c6-sensors',
    title: 'What is a Sensor? Giving Senses to Machines',
    sortOrder: 1,
    gradeLevel: 6,
    estimatedMinutes: 12,
    learningObjectives: [
      'Define what a sensor is and how it detects physical phenomena.',
      'Compare human senses (eyes, skin, ears) to electronic sensors (LDR, thermistor, microphone).',
      'Understand how physical signals get translated into electrical signals.'
    ],
    introduction: 'Humans have five senses: sight, sound, touch, taste, and smell. How can a computer or robot sense the world? That is where sensors come in!',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'Translating the Physical World',
        body: 'A sensor converts physical properties—such as ambient light, room temperature, sound volume, or distance—into a measurable electrical signal (a voltage change or resistance change).'
      },
      {
        type: 'comparison',
        heading: 'Human Sense vs. Sensor Equivalent',
        body: '• Human Eyes → Light-Dependent Resistor (LDR) or Camera Sensor\n• Human Skin (touch/heat) → Thermistor or capacitive touch pad\n• Human Ears → Electret Microphone sensor\n• Human Balance → Gyroscope / Accelerometer'
      }
    ],
    activityInstructions: 'Observe your refrigerator or smartphone: How does the smartphone screen know to turn dark when you hold it against your ear? A proximity sensor!',
    quizId: 'quiz-c6-sensors-intro',
    relatedProjectIds: ['proj-ldr-indicator'],
    published: true
  },
  {
    id: 'les-c6-light-sensing-ldr',
    moduleId: 'mod-c6-sensors',
    title: 'The Light-Dependent Resistor (LDR / Photoresistor)',
    sortOrder: 2,
    gradeLevel: 6,
    estimatedMinutes: 15,
    learningObjectives: [
      'Learn how an LDR changes its resistance when exposed to light.',
      'Understand the rule: More Light = Less Resistance.',
      'Build a light detection circuit that reacts when room lights turn off.'
    ],
    introduction: 'Have you seen streetlights turn on automatically when dusk falls? They use a tiny photoresistor called an LDR to watch the sky!',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'How an LDR Works',
        body: 'An LDR is made of a special semiconductor material (Cadmium Sulfide). In total darkness, its resistance is very high (often over 100,000 Ohms / 100kΩ). When bright light shines on it, photons knock electrons free, dropping the resistance down to just a few hundred Ohms!'
      },
      {
        type: 'rule',
        heading: 'The Golden Rule of LDR',
        body: 'Remember this simple rhyme: "Bright light makes resistance small; dark makes resistance tall!"'
      }
    ],
    activityInstructions: 'In our Virtual Lab, open the Light Sensor project and adjust the Ambient Light slider to see the simulated sensor values change in real time!',
    quizId: 'quiz-c6-ldr-light',
    relatedProjectIds: ['proj-ldr-indicator', 'proj-auto-nightlight'],
    published: true
  },
  {
    id: 'les-c6-microcontroller-intro',
    moduleId: 'mod-c6-sensors',
    title: 'Introduction to Microcontrollers: Meet Arduino Uno',
    sortOrder: 3,
    gradeLevel: 6,
    estimatedMinutes: 18,
    learningObjectives: [
      'Understand what a microcontroller board is.',
      'Identify the main parts of an Arduino Uno (Power pins, Digital pins, Analog pins, ATmega328P chip).',
      'Follow the cycle of a smart device: Input → Processing → Output.'
    ],
    introduction: 'A computer in a tower is huge, but a microcontroller is an entire miniature computer squeezed onto a single silicon chip! The Arduino Uno is the most popular educational board in the world.',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'Input, Processing, Output (IPO)',
        body: 'Every smart gadget works in three steps:\n1. Input: Sensors read the environment (e.g., LDR senses dark).\n2. Processing: The microcontroller brain runs code (e.g., if reading < threshold).\n3. Output: An actuator acts (e.g., turn on LED pin D13).'
      },
      {
        type: 'anatomy',
        heading: 'Key Pins on Arduino Uno',
        body: '• 5V and GND: Provides clean electric power to breadboards.\n• Digital Pins (0–13): Can read HIGH (5V) or LOW (0V), and send HIGH or LOW.\n• Analog Pins (A0–A5): Can read smooth intermediate sensor voltages from 0 to 1023!'
      }
    ],
    activityInstructions: 'Check out the Arduino Uno board in our Virtual Lab! Hover over the pin headers to see their names and functions.',
    quizId: 'quiz-c6-arduino-intro',
    relatedProjectIds: ['proj-auto-nightlight', 'proj-pwm-brightness'],
    published: true
  },

  // Class 7 Lessons
  {
    id: 'les-c7-analog-vs-digital',
    moduleId: 'mod-c7-systems',
    title: 'Digital Signals vs. Analog Signals',
    sortOrder: 1,
    gradeLevel: 7,
    estimatedMinutes: 15,
    learningObjectives: [
      'Distinguish between discrete binary digital states (0 and 1) and continuous analog values.',
      'Understand Analog-to-Digital Conversion (ADC) on Arduino 10-bit inputs (0 to 1023).',
      'Explain when to use a digital input (push button) versus an analog input (light sensor).'
    ],
    introduction: 'The real world is smooth and analog, but computers think in sharp 1s and 0s. How do sensors bridge this gap?',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'Digital: The Light Switch',
        body: 'A digital signal has only two states: ON or OFF, HIGH (5V) or LOW (0V), True or False. A push button is digital because it is either pressed or released.'
      },
      {
        type: 'concept',
        heading: 'Analog: The Dimmer Slider',
        body: 'An analog signal can be any value across a continuous range. For instance, temperature can be 20.1°C, 20.2°C, or 25.7°C. The Arduino uses a 10-bit Analog-to-Digital Converter (ADC) which maps 0V–5V into numbers from 0 to 1023!'
      }
    ],
    activityInstructions: 'Open the Sensor Monitoring project to watch analog readings from 0 to 1023 smoothly adapt as you move the sensor controls.',
    quizId: 'quiz-c7-analog-digital',
    relatedProjectIds: ['proj-ldr-indicator', 'proj-pwm-brightness'],
    published: true
  },
  {
    id: 'les-c7-pwm-brightness',
    moduleId: 'mod-c7-systems',
    title: 'Pulse-Width Modulation (PWM): Controlling Brightness and Speed',
    sortOrder: 2,
    gradeLevel: 7,
    estimatedMinutes: 16,
    learningObjectives: [
      'Learn how microcontrollers fake analog output using Pulse-Width Modulation (PWM).',
      'Understand Duty Cycle (0% to 100%) and the Arduino analogWrite range (0 to 255).',
      'Control LED brightness smoothly without wasting electrical energy.'
    ],
    introduction: 'An Arduino digital pin can only produce 0V or 5V. So how can it make an LED dim or spin a motor at half speed? By blinking super-fast!',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'Blinking Faster Than the Eye Can See',
        body: 'If an LED blinks on and off 500 times every second, your human eye cannot detect the blinks due to "Persistence of Vision." Instead, your brain blends them into a steady glow. If it is on 50% of the time, it looks half as bright!'
      },
      {
        type: 'concept',
        heading: 'Duty Cycle and Values',
        body: '• 0% Duty Cycle (Value 0): Pin stays LOW constantly → LED OFF.\n• 50% Duty Cycle (Value 128): Pin is HIGH half the time → Medium glow.\n• 100% Duty Cycle (Value 255): Pin stays HIGH constantly → Full brightness.'
      }
    ],
    activityInstructions: 'Try our PWM LED Brightness simulation! Slide the PWM value from 0 to 255 and see the simulated LED adjust its glow immediately.',
    quizId: 'quiz-c7-pwm',
    relatedProjectIds: ['proj-pwm-brightness'],
    published: true
  },
  {
    id: 'les-c7-automation-thresholds',
    moduleId: 'mod-c7-systems',
    title: 'Threshold Automation: Making Smart Decisions',
    sortOrder: 3,
    gradeLevel: 7,
    estimatedMinutes: 20,
    learningObjectives: [
      'Understand conditional logic in electronics: IF sensor < threshold THEN actuate.',
      'Implement an Automatic Night Lamp circuit that turns ON only in the dark.',
      'Learn how hysteresis and calibration prevent flickering in smart automation.'
    ],
    introduction: 'What makes a system "smart"? When it can make autonomous decisions based on environmental thresholds without human intervention!',
    contentBlocks: [
      {
        type: 'concept',
        heading: 'What is a Threshold?',
        body: 'A threshold is a trigger boundary value. For example, in an automatic streetlight: IF (ambientLight < 400) { turnStreetLightOn(); } ELSE { turnStreetLightOff(); }'
      },
      {
        type: 'engineering',
        heading: 'Calibrating Your Project',
        body: 'Because sunset is different in winter and summer, smart systems allow users or technicians to calibrate the threshold setting using a potentiometer or software parameter.'
      }
    ],
    activityInstructions: 'Open the Automatic Night Light project in the Virtual Lab. Experiment with different light levels to see the threshold decision trigger!',
    quizId: 'quiz-c7-automation',
    relatedProjectIds: ['proj-auto-nightlight'],
    published: true
  }
];
