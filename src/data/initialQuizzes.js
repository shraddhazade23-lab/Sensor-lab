// Comprehensive Educational Quizzes for SensorLab Lessons

export const INITIAL_QUIZZES = [
  {
    id: 'quiz-c5-what-is-electronics',
    lessonId: 'les-c5-what-is-electronics',
    title: 'Quiz: Discovering Electricity & Electronics',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'Which of the following tiny invisible particles moves inside wires to create electricity?',
        options: ['Protons', 'Electrons', 'Neutrons', 'Photons'],
        correctIndex: 1,
        explanation: 'Electrons carry a negative electrical charge and their movement through conductors creates electric current!'
      },
      {
        id: 'q2',
        question: 'In the water pipe analogy, what represents Voltage?',
        options: [
          'The water pressure pushing the liquid forward',
          'A filter catching dirt',
          'The color of the water',
          'The plastic material of the pipe'
        ],
        correctIndex: 0,
        explanation: 'Voltage is the electrical pressure (potential difference) that drives electrons through a circuit.'
      },
      {
        id: 'q3',
        question: 'What makes an electronic device different from a simple electrical appliance?',
        options: [
          'It is always heavier',
          'It controls electricity precisely to make decisions and process data',
          'It does not use any wires at all',
          'It can only run in the daytime'
        ],
        correctIndex: 1,
        explanation: 'Electronic devices use semiconductors and microcontrollers to control electrical signals and make logical decisions.'
      }
    ]
  },
  {
    id: 'quiz-c5-open-closed',
    lessonId: 'les-c5-open-closed-circuits',
    title: 'Quiz: Open and Closed Circuits',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'What happens to a light bulb in an "Open Circuit"?',
        options: [
          'It shines twice as bright',
          'It stays dark because the electron loop is broken',
          'It explodes safely',
          'It flashes different colors'
        ],
        correctIndex: 1,
        explanation: 'Electrons can only flow through an unbroken, closed loop. When the circuit is open, current stops immediately.'
      },
      {
        id: 'q2',
        question: 'How does an ordinary push button or light switch work?',
        options: [
          'By making the battery stronger',
          'By changing the color of the copper wires',
          'By physically connecting or disconnecting the conductive path',
          'By absorbing all the electricity like a sponge'
        ],
        correctIndex: 2,
        explanation: 'A switch acts like a drawbridge, closing the gap when turned ON and opening the gap when turned OFF.'
      },
      {
        id: 'q3',
        question: 'Where must electrons return in order to keep circulating?',
        options: [
          'To the sky',
          'Back to the Ground (GND) / negative terminal of the power source',
          'To the kitchen',
          'Into the insulation plastic'
        ],
        correctIndex: 1,
        explanation: 'Circuits require a complete return path back to the reference ground (GND) or negative terminal.'
      }
    ]
  },
  {
    id: 'quiz-c5-led-resistor',
    lessonId: 'les-c5-led-and-resistor',
    title: 'Quiz: LED Polarity and Resistor Protection',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'Which leg of an LED is the positive Anode?',
        options: ['The shorter leg', 'The longer leg', 'Both legs are identical', 'The middle leg'],
        correctIndex: 1,
        explanation: 'The longer leg is the Anode (+), and the shorter leg (or flat edge on the plastic body) is the Cathode (-).'
      },
      {
        id: 'q2',
        question: 'Why do we always put a resistor in series with an LED?',
        options: [
          'To make the LED heavier so it does not float',
          'To limit the electric current and prevent the LED from burning out',
          'To change the LED color from red to blue',
          'Because the Arduino will refuse to turn on otherwise'
        ],
        correctIndex: 1,
        explanation: 'An LED has very little resistance once illuminated. Without a current-limiting resistor (e.g. 220Ω), excessive current would destroy it.'
      },
      {
        id: 'q3',
        question: 'What unit do we use to measure electrical resistance?',
        options: ['Volts (V)', 'Amperes (A)', 'Ohms (Ω)', 'Litres (L)'],
        correctIndex: 2,
        explanation: 'Resistance is measured in Ohms, represented by the Greek letter omega (Ω).'
      }
    ]
  },
  {
    id: 'quiz-c6-sensors-intro',
    lessonId: 'les-c6-what-is-a-sensor',
    title: 'Quiz: The World of Sensors',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary job of an electronic sensor?',
        options: [
          'To turn physical phenomena (light, sound, heat) into electrical signals',
          'To generate high-voltage electricity for homes',
          'To heat up food in microwaves',
          'To erase computer memory'
        ],
        correctIndex: 0,
        explanation: 'Sensors detect physical properties from the environment and convert them into measurable electrical voltages or currents.'
      },
      {
        id: 'q2',
        question: 'Which electronic sensor works most like the human eye?',
        options: ['Thermistor', 'Light-Dependent Resistor (LDR)', 'Buzzer', 'Push button'],
        correctIndex: 1,
        explanation: 'An LDR detects incoming light levels, behaving similarly to the photoreceptors in our eyes!'
      },
      {
        id: 'q3',
        question: 'Why does your smartphone turn off its screen when you bring it close to your ear?',
        options: [
          'It gets tired',
          'A proximity sensor detects that an object is nearby and disables the touchscreen',
          'The battery runs out instantly',
          'Sound waves push the screen down'
        ],
        correctIndex: 1,
        explanation: 'A proximity sensor near the top speaker senses your ear and turns off the display to prevent accidental cheek presses.'
      }
    ]
  },
  {
    id: 'quiz-c6-ldr-light',
    lessonId: 'les-c6-light-sensing-ldr',
    title: 'Quiz: Light-Dependent Resistors (LDR)',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'When bright light shines directly on an LDR, what happens to its electrical resistance?',
        options: [
          'Its resistance drops drastically (becomes very low)',
          'Its resistance shoots up to infinite',
          'It changes into a battery',
          'Its resistance stays exactly 10,000 Ohms'
        ],
        correctIndex: 0,
        explanation: 'In bright light, photons free up electrons in the semiconductor material, making it much easier for current to flow—so resistance drops!'
      },
      {
        id: 'q2',
        question: 'In total darkness, what is typical for an LDR?',
        options: [
          'It glows in the dark',
          'It has a very high resistance (often 100kΩ or more)',
          'It produces 100 Volts',
          'It melts'
        ],
        correctIndex: 1,
        explanation: 'In the dark, few charge carriers are free, resulting in extremely high resistance.'
      },
      {
        id: 'q3',
        question: 'Why do we pair an LDR with a fixed resistor (like 10kΩ) when connecting to an Arduino pin?',
        options: [
          'To make a Voltage Divider that converts changing resistance into a changing voltage',
          'To make the LDR waterproof',
          'To increase the volume of sound',
          'To stop the Arduino from overheating'
        ],
        correctIndex: 0,
        explanation: 'An Arduino analog pin reads voltage, not direct resistance. A voltage divider converts changing resistance into readable voltage.'
      }
    ]
  },
  {
    id: 'quiz-c6-arduino-intro',
    lessonId: 'les-c6-microcontroller-intro',
    title: 'Quiz: Arduino Microcontroller Basics',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'What are the three core steps in the cycle of any smart microcontroller system?',
        options: [
          'Sleep, Eat, Play',
          'Input, Processing, Output',
          'Download, Upload, Delete',
          'Heat, Cool, Freeze'
        ],
        correctIndex: 1,
        explanation: 'Smart devices take Input from sensors, Process the logic in their microcontroller, and send Output to actuators!'
      },
      {
        id: 'q2',
        question: 'On an Arduino Uno, what voltage does the 5V pin supply?',
        options: ['0 Volts', '3.3 Volts', '5 Volts DC', '220 Volts AC'],
        correctIndex: 2,
        explanation: 'The 5V pin provides a steady 5-Volt direct current supply suitable for sensors, LEDs, and breadboard circuits.'
      },
      {
        id: 'q3',
        question: 'What does GND stand for on an Arduino board?',
        options: ['General Network Device', 'Ground (0V reference)', 'Great New Diode', 'Green Neon Display'],
        correctIndex: 1,
        explanation: 'GND stands for Ground, the 0-Volt reference point where current returns.'
      }
    ]
  },
  {
    id: 'quiz-c7-analog-digital',
    lessonId: 'les-c7-analog-vs-digital',
    title: 'Quiz: Analog vs. Digital Signals',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'How many states does a basic digital input have?',
        options: ['Infinite states', 'Only two: HIGH (1) and LOW (0)', 'Ten states', 'Five states'],
        correctIndex: 1,
        explanation: 'Digital signals are binary—they are either HIGH (5V / ON) or LOW (0V / OFF).'
      },
      {
        id: 'q2',
        question: 'What range of numbers does the Arduino 10-bit Analog-to-Digital Converter (ADC) produce?',
        options: ['0 to 1', '0 to 100', '0 to 1023', '0 to 9999'],
        correctIndex: 2,
        explanation: 'A 10-bit ADC provides 2^10 = 1024 discrete steps, yielding values from 0 (0 Volts) to 1023 (5 Volts).'
      },
      {
        id: 'q3',
        question: 'Which of the following is an analog signal in nature?',
        options: [
          'The continuous temperature of a cup of hot cocoa',
          'A simple on/off doorbell button',
          'A computer file containing 1s and 0s',
          'A coin flip (heads or tails)'
        ],
        correctIndex: 0,
        explanation: 'Temperature varies continuously across a smooth spectrum, making it an analog phenomenon.'
      }
    ]
  },
  {
    id: 'quiz-c7-pwm',
    lessonId: 'les-c7-pwm-brightness',
    title: 'Quiz: Pulse-Width Modulation (PWM)',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'How does PWM control LED brightness if digital pins can only output 0V or 5V?',
        options: [
          'By switching rapidly between HIGH and LOW so the eye perceives an average brightness',
          'By changing the physical size of the LED',
          'By making the wires colder',
          'By converting electrons into sound'
        ],
        correctIndex: 0,
        explanation: 'PWM pulses the voltage rapidly. Changing the ratio of ON-time vs. OFF-time (Duty Cycle) changes the perceived brightness.'
      },
      {
        id: 'q2',
        question: 'If you set an Arduino PWM output to value 128 (out of 255), what is the Duty Cycle?',
        options: ['0%', '25%', 'Approximately 50%', '100%'],
        correctIndex: 2,
        explanation: '128 / 255 is approximately 50%, meaning the pin is ON half the time and OFF half the time.'
      },
      {
        id: 'q3',
        question: 'How are PWM-capable pins indicated on the Arduino Uno silk screen?',
        options: ['With a star (*)', 'With a tilde wave (~)', 'With a circle (o)', 'With red paint'],
        correctIndex: 1,
        explanation: 'Arduino Uno marks PWM pins (3, 5, 6, 9, 10, 11) with a tilde symbol (~).'
      }
    ]
  },
  {
    id: 'quiz-c7-automation',
    lessonId: 'les-c7-automation-thresholds',
    title: 'Quiz: Threshold-Based Automation',
    passingScore: 70,
    maxPoints: 30,
    questions: [
      {
        id: 'q1',
        question: 'In an automatic night light, what role does the "Threshold" play?',
        options: [
          'It is the boundary number where the system decides to turn the light ON or OFF',
          'It is the battery weight',
          'It is the length of the wire',
          'It is the name of the Arduino chip'
        ],
        correctIndex: 0,
        explanation: 'A threshold is the decision trigger point: if the sensor reading is below this value, the light activates.'
      },
      {
        id: 'q2',
        question: 'If an LDR circuit produces 800 in bright day and 200 in pitch darkness, which threshold makes sense for sunset?',
        options: ['50', '450', '950', '1500'],
        correctIndex: 1,
        explanation: '450 sits comfortably between the bright daytime value (800) and dark nighttime value (200).'
      },
      {
        id: 'q3',
        question: 'Why do engineers add a small delay or gap (hysteresis) around threshold triggers in real systems?',
        options: [
          'To prevent rapid, annoying flickering when the reading hovers right at the border',
          'To make the circuit consume more power',
          'Because computers get confused easily',
          'To allow the wires to rest'
        ],
        correctIndex: 0,
        explanation: 'Hysteresis prevents noisy readings from rapidly turning a device on and off when near the border.'
      }
    ]
  }
];
