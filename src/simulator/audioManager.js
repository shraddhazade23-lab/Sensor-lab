// Browser-compatible Web Audio API sound generator for SensorLab Virtual Lab
// Complies with browser autoplay restrictions by initializing upon student interaction

class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.isMuted = false;
  }

  // Lazily initialize AudioContext after user gesture
  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play continuous or pulsing buzzer tone (default: 880 Hz standard piezo beep)
  playBuzzer(frequency = 880) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    if (!this.isPlaying) {
      try {
        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();

        // Realistic square waveform for electronic piezo buzzer
        this.oscillator.type = 'square';
        this.oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        // Safe, non-jarring volume (0.05 gain)
        this.gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);

        this.oscillator.start();
        this.isPlaying = true;
      } catch (err) {
        console.warn('Virtual Lab audio error:', err);
      }
    }
  }

  // Stop buzzer tone immediately
  stopBuzzer() {
    if (this.isPlaying && this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (err) {
        // Ignore if already stopped
      }
      this.oscillator = null;
      this.isPlaying = false;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopBuzzer();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
