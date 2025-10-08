export interface PlayConfig {
  frequency: number;
  volume: number;
  binauralBeatFrequency?: number;
  pemfFrequency?: number;
}

class AudioEngine {
  private audioContext: AudioContext | null;
  private masterGain: GainNode | null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private sequenceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      this.audioContext = null;
      this.masterGain = null;
    }
  }
  
  private stopOscillators() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator may already be stopped
      }
      osc.disconnect();
    });
    this.oscillators = [];

    if (this.lfo) {
        try {
          this.lfo.stop();
        } catch(e) {}
        this.lfo.disconnect();
        this.lfo = null;
    }
    if (this.lfoGain) {
        this.lfoGain.disconnect();
        this.lfoGain = null;
    }
  }

  private clearSequence() {
      if (this.sequenceTimer) {
          clearTimeout(this.sequenceTimer);
          this.sequenceTimer = null;
      }
  }

  play({ frequency, volume, binauralBeatFrequency, pemfFrequency }: PlayConfig): void {
    if (!this.audioContext || !this.masterGain) return;

    this.stop(); // This will clear any running sequence

    this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);

    if (binauralBeatFrequency) {
      const leftFreq = frequency - binauralBeatFrequency / 2;
      const rightFreq = frequency + binauralBeatFrequency / 2;

      const oscL = this.audioContext.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(leftFreq, this.audioContext.currentTime);
      const pannerL = this.audioContext.createStereoPanner();
      pannerL.pan.setValueAtTime(-1, this.audioContext.currentTime);
      oscL.connect(pannerL).connect(this.masterGain);
      oscL.start(0);

      const oscR = this.audioContext.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(rightFreq, this.audioContext.currentTime);
      const pannerR = this.audioContext.createStereoPanner();
      pannerR.pan.setValueAtTime(1, this.audioContext.currentTime);
      oscR.connect(pannerR).connect(this.masterGain);
      oscR.start(0);
      
      this.oscillators.push(oscL, oscR);

    } else {
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      if (pemfFrequency) {
        const modulationGain = this.audioContext.createGain();
        modulationGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        
        this.lfo = this.audioContext.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.setValueAtTime(pemfFrequency, this.audioContext.currentTime);
        
        this.lfoGain = this.audioContext.createGain();
        this.lfoGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);

        this.lfo.connect(this.lfoGain).connect(modulationGain.gain);
        
        osc.connect(modulationGain).connect(this.masterGain);
        this.lfo.start(0);
      } else {
        osc.connect(this.masterGain);
      }

      osc.start(0);
      this.oscillators.push(osc);
    }
  }

  playSequence(configs: PlayConfig[], onStepChange: (config: PlayConfig) => void, stepDuration: number = 5000): void {
      this.stop();
      if (!configs.length) return;
      
      let currentIndex = 0;
      
      const playNextStep = () => {
          // Loop the sequence
          if(currentIndex >= configs.length) {
              currentIndex = 0;
          }
          const config = configs[currentIndex];
          this.play(config);
          onStepChange(config);
          
          currentIndex++;
          
          this.sequenceTimer = setTimeout(playNextStep, stepDuration);
      }
      
      playNextStep();
  }

  stop(): void {
    this.clearSequence();
    if (this.oscillators.length > 0) {
      this.stopOscillators();
    }
  }

  setVolume(volume: number): void {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
    }
  }
}

export default AudioEngine;
