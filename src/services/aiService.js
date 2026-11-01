// AI Learning Assistant Service for SensorLab (Sparky)

const SYSTEM_PROMPT = `You are Sparky, the encouraging and friendly educational AI companion for SensorLab.
Your students are young learners in Classes 5, 6, and 7 (ages 10-13).
Your guidelines:
1. Tone: Friendly, inspiring, curious, and respectful.
2. Vocabulary: Clear, simple English. Always define technical words (like Anode, Cathode, Resistance, PWM, Microcontroller) using everyday analogies.
3. Analogies: Use real-world analogies (water pipes for circuits, drawbridges for switches, eyes for light sensors, dimmers for PWM).
4. Problem Solving: When a student asks about a circuit mistake, guide them with step-by-step hints instead of giving away the entire solution instantly.
5. Safety & Honesty: Remind them that SensorLab is a safe virtual software simulation, and physical electronics experiments should always be done with an adult or teacher.
6. Length: Keep explanations concise (2 to 4 friendly paragraphs or bullet points).`;

export const aiService = {
  isConfigured() {
    return Boolean(
      import.meta.env.VITE_GEMINI_API_KEY &&
      import.meta.env.VITE_GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'
    );
  },

  async askAssistant(userMessage, context = {}) {
    const { grade = 6, currentLesson = null, currentProject = null, simulatorErrors = [] } = context;

    // Build context description
    const contextInfo = [];
    if (grade) contextInfo.push(`Student is in Class ${grade}.`);
    if (currentLesson) contextInfo.push(`Active Lesson: "${currentLesson.title}".`);
    if (currentProject) contextInfo.push(`Active Project: "${currentProject.title}".`);
    if (simulatorErrors.length > 0) {
      contextInfo.push(`Current Circuit Issues: ${simulatorErrors.join('; ')}`);
    }

    const contextPrefix = contextInfo.length > 0 ? `[Context: ${contextInfo.join(' ')}]\n\n` : '';
    const fullPrompt = `${contextPrefix}Student: ${userMessage}`;

    // If Gemini API Key is configured, make a live API call
    if (this.isConfigured()) {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${SYSTEM_PROMPT}\n\n${fullPrompt}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600
            }
          })
        });

        if (!response.ok) {
          throw new Error(`AI service responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return {
            text: reply,
            isLiveAi: true
          };
        }
      } catch (err) {
        console.warn('Gemini API call error, falling back to educational responder:', err);
      }
    }

    // High quality contextual educational fallback
    return {
      text: this.getEducationalFallback(userMessage, context),
      isLiveAi: false,
      configuredStatus: 'Local Educational Knowledge Mode (Add VITE_GEMINI_API_KEY to .env for live Gemini model)'
    };
  },

  getEducationalFallback(userMessage, context) {
    const q = userMessage.toLowerCase();

    if (q.includes('sensor') || q.includes('what is a sensor')) {
      return `Great question! 📡 A sensor is like an electronic sense organ. Just like your eyes detect light and your skin feels warmth, an electronic sensor turns physical things from the outside world into electrical signals.\n\nFor example, an **LDR (Light Dependent Resistor)** senses whether a room is bright or dark, and a **Thermistor** senses temperature changes!`;
    }

    if (q.includes('resistor') || q.includes('why resistor') || q.includes('led burn')) {
      return `Think of a resistor as a friendly bodyguard for your LED! 🛡️\n\nAn LED has almost zero resistance once it starts glowing. If you connect it directly to a 5V battery, a huge rush of electrons charges through at once and burns out the delicate semiconductor inside. A **220Ω resistor** slows down the current to a safe 15–20 milliamps so your LED glows brightly without getting hurt!`;
    }

    if (q.includes('analog') && q.includes('digital')) {
      return `Here is the easiest way to remember:\n\n• **Digital** is like an ordinary room light switch: it has only TWO states—either ON (HIGH, 5V) or OFF (LOW, 0V).\n\n• **Analog** is like a smooth dimmer knob: it can take ANY value across a continuous range. On an Arduino, analog sensors (like an LDR) produce values from **0 to 1023**!`;
    }

    if (q.includes('polarity') || q.includes('anode') || q.includes('cathode')) {
      return `Polarity means direction matters! 💡\n\nAn LED is a *diode*, which is like a one-way street for electricity. The **Anode (longer leg)** must always connect toward the positive (+) 5V power, and the **Cathode (shorter leg)** connects toward Ground (GND). If you flip it backwards, no current flows!`;
    }

    if (q.includes('mistake') || q.includes('error') || q.includes('help me find') || q.includes('broken')) {
      if (context.simulatorErrors && context.simulatorErrors.length > 0) {
        return `I checked your circuit workspace! Here is what we need to fix:\n\n${context.simulatorErrors.map(e => `• ${e}`).join('\n')}\n\nHint: Check that your wires form an unbroken loop starting from 5V and returning all the way back to GND!`;
      }
      return `To debug your circuit, follow the 3 Golden Rules:\n1. Is the **5V power wire** firmly connected to the breadboard?\n2. Is the **GND return wire** connected to the other side?\n3. Is your LED oriented correctly (Anode to power)?`;
    }

    if (q.includes('pwm') || q.includes('brightness')) {
      return `PWM stands for **Pulse-Width Modulation**! 🎛️\n\nDigital pins can only output 0V or 5V—they cannot output 2.5V directly. So instead, the Arduino switches the pin ON and OFF hundreds of times every second! Your human eye blends these quick flashes together into a smooth dimmer glow. Value 0 is off, 128 is half brightness, and 255 is full brightness!`;
    }

    if (q.includes('arduino') || q.includes('microcontroller')) {
      return `An **Arduino Uno** is a miniature computer on a single board! 🤖\n\nIt has digital pins (D0-D13) to control LEDs or read switches, analog pins (A0-A5) to read continuous sensor voltages, and a microcontroller chip (ATmega328P) that acts as the brain executing your commands!`;
    }

    return `Hello there, young inventor! ⚡ I am Sparky, your SensorLab learning companion. You can ask me how any electronic component works (like LEDs, resistors, LDRs, or push buttons), how to connect a circuit on the breadboard, or what a sensor reading means. How can I help you learn today?`;
  }
};
