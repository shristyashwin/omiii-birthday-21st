/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 SOFT, LIGHT, BEAUTIFUL & FRESH ROMANTIC SOUNDTRACK ENGINE 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Creates an airy, dreamy, fresh acoustic experience inspired by gentle
 * golden-hour piano, soft harp arpeggios, and warm ambient sunlight.
 * 
 * Features:
 * • Felted acoustic piano & harp physical modeling using Web Audio API
 * • Polyphonic lush chords + high register music-box sparkles
 * • Warm ambient harmonic background pad that breathes with chord changes
 * • Stereo delay & low-pass filtering for a velvety, soft, soothing tone
 * • Supports custom MP3 URLs/files if provided in config
 */

class RomanticMusicPlayer {
  constructor() {
    this.config = window.BIRTHDAY_CONFIG.music;
    this.isPlaying = false;
    this.volume = this.config.defaultVolume || 0.45;
    
    this.audioElement = null;
    this.audioContext = null;
    this.sequenceTimer = null;
    this.currentPatternIndex = 0;
    this.currentStep = 0;

    // Ambient Pad nodes
    this.padOsc1 = null;
    this.padOsc2 = null;
    this.padGain = null;
    this.padFilter = null;
    
    this.initDOM();
    this.setupAudio();
  }

  initDOM() {
    this.disc = document.querySelector('.music-disc');
    this.playBtn = document.querySelector('.btn-music-play');
    this.volumeSlider = document.querySelector('.volume-slider');
    this.titleEl = document.querySelector('.music-title');
    this.artistEl = document.querySelector('.music-artist');

    if (this.titleEl) this.titleEl.textContent = this.config.songTitle || "Sunflower Serenade";
    if (this.artistEl) this.artistEl.textContent = this.config.artist || "Soft, Light & Dreamy";

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (this.disc) {
      this.disc.addEventListener('click', () => this.togglePlay());
    }
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
      this.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }
  }

  setupAudio() {
    if (this.config.audioSrc && this.config.audioSrc.trim() !== '') {
      this.audioElement = new Audio(this.config.audioSrc);
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    if (this.disc) this.disc.classList.add('playing');
    if (this.playBtn) this.playBtn.innerHTML = '❚❚';

    if (this.audioElement) {
      this.audioElement.play().catch(() => {
        this.startFreshAcousticSynth();
      });
    } else {
      this.startFreshAcousticSynth();
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.disc) this.disc.classList.remove('playing');
    if (this.playBtn) this.playBtn.innerHTML = '▶';

    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopFreshAcousticSynth();
  }

  setVolume(val) {
    this.volume = val;
    if (this.audioElement) {
      this.audioElement.volume = val;
    }
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(val * 0.28, this.audioContext.currentTime);
    }
  }

  /**
   * Initializes the Web Audio Graph:
   * Master Gain -> Lowpass Filter (Warmth) -> Stereo Delay (Airy Space) -> Destination
   */
  initAudioContext() {
    if (this.audioContext) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioCtx();

    // Master Gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.setValueAtTime(this.volume * 0.28, this.audioContext.currentTime);

    // Master Warm Felt Filter (removes digital harshness, gives velvety soft warmth)
    this.masterFilter = this.audioContext.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.setValueAtTime(1750, this.audioContext.currentTime);
    this.masterFilter.Q.setValueAtTime(0.65, this.audioContext.currentTime);

    // Airy Stereo Delay / Echo for dreamy floating acoustic ambiance
    this.delayNode = this.audioContext.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.38, this.audioContext.currentTime);

    this.delayFeedback = this.audioContext.createGain();
    this.delayFeedback.gain.setValueAtTime(0.28, this.audioContext.currentTime);

    this.delayFilter = this.audioContext.createBiquadFilter();
    this.delayFilter.type = 'lowpass';
    this.delayFilter.frequency.setValueAtTime(1200, this.audioContext.currentTime);

    // Connect Delay Network
    this.masterFilter.connect(this.delayNode);
    this.delayNode.connect(this.delayFilter);
    this.delayFilter.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // Connect to Master Output
    this.masterFilter.connect(this.masterGain);
    this.delayFilter.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);

    // Warm Ambient Pad Layer
    this.initAmbientPad();
  }

  initAmbientPad() {
    this.padGain = this.audioContext.createGain();
    this.padGain.gain.setValueAtTime(0, this.audioContext.currentTime);

    this.padFilter = this.audioContext.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.setValueAtTime(450, this.audioContext.currentTime);

    this.padOsc1 = this.audioContext.createOscillator();
    this.padOsc1.type = 'sine';
    this.padOsc1.frequency.setValueAtTime(196.00, this.audioContext.currentTime); // G3

    this.padOsc2 = this.audioContext.createOscillator();
    this.padOsc2.type = 'triangle';
    this.padOsc2.frequency.setValueAtTime(293.66, this.audioContext.currentTime); // D4

    this.padOsc1.connect(this.padFilter);
    this.padOsc2.connect(this.padFilter);
    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.masterGain);

    this.padOsc1.start();
    this.padOsc2.start();
  }

  /**
   * Fresh, Light, Romantic Musical Composition
   * G Major / E Minor / C Major 9 / Dsus4 progression with rolling fingerpicked
   * harp arpeggios, soft felt piano chords, and sparkling bell melodies.
   */
  startFreshAcousticSynth() {
    this.initAudioContext();
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Fade in warm background ambient pad softly
    const now = this.audioContext.currentTime;
    this.padGain.gain.linearRampToValueAtTime(0.045, now + 2.5);

    // Musical Song Pattern: Array of Measures
    // Each measure has:
    // • chordPad: [root, fifth]
    // • arpeggio: list of { delayMs, freq, vel, isBell }
    this.songPattern = [
      // Measure 1: G Major 9 (Fresh morning sunrise, hopeful, warm)
      {
        padFreq: [196.00, 293.66], // G3, D4
        notes: [
          { time: 0, freq: 98.00, vel: 0.65 },    // G2 (Bass)
          { time: 100, freq: 293.66, vel: 0.4 },  // D4
          { time: 240, freq: 392.00, vel: 0.45 }, // G4
          { time: 380, freq: 493.88, vel: 0.5 },  // B4
          { time: 540, freq: 587.33, vel: 0.6, isBell: true }, // D5 (Melody spark)
          { time: 780, freq: 659.25, vel: 0.55, isBell: true }, // E5
          { time: 1050, freq: 587.33, vel: 0.45 }, // D5
          { time: 1300, freq: 493.88, vel: 0.4 }  // B4
        ],
        duration: 1600
      },

      // Measure 2: E Minor 9 (Tender, nostalgic, deep intimacy)
      {
        padFreq: [164.81, 246.94], // E3, B3
        notes: [
          { time: 0, freq: 82.41, vel: 0.65 },    // E2 (Bass)
          { time: 110, freq: 246.94, vel: 0.4 },  // B3
          { time: 250, freq: 329.63, vel: 0.45 }, // E4
          { time: 390, freq: 392.00, vel: 0.5 },  // G4
          { time: 550, freq: 739.99, vel: 0.55, isBell: true }, // F#5 (Sweet high note)
          { time: 790, freq: 783.99, vel: 0.6, isBell: true },  // G5
          { time: 1080, freq: 659.25, vel: 0.5, isBell: true }, // E5
          { time: 1320, freq: 493.88, vel: 0.4 }   // B4
        ],
        duration: 1600
      },

      // Measure 3: C Major 9 (Pure warmth, safe haven, sweet smile)
      {
        padFreq: [130.81, 261.63], // C3, C4
        notes: [
          { time: 0, freq: 65.41, vel: 0.7 },     // C2 (Bass)
          { time: 100, freq: 261.63, vel: 0.4 },  // C4
          { time: 230, freq: 329.63, vel: 0.45 }, // E4
          { time: 370, freq: 392.00, vel: 0.5 },  // G4
          { time: 540, freq: 587.33, vel: 0.6, isBell: true },  // D5 (Floating 9th)
          { time: 780, freq: 659.25, vel: 0.55, isBell: true }, // E5
          { time: 1040, freq: 783.99, vel: 0.65, isBell: true },// G5 (Golden bloom)
          { time: 1300, freq: 493.88, vel: 0.45 }  // B4
        ],
        duration: 1600
      },

      // Measure 4: Dsus4 to D (Peaceful resolution, breeze in the sunflowers)
      {
        padFreq: [146.83, 293.66], // D3, D4
        notes: [
          { time: 0, freq: 73.42, vel: 0.65 },    // D2 (Bass)
          { time: 110, freq: 293.66, vel: 0.4 },  // D4
          { time: 240, freq: 392.00, vel: 0.45 }, // G4 (Sus4)
          { time: 380, freq: 440.00, vel: 0.5 },  // A4
          { time: 560, freq: 739.99, vel: 0.55, isBell: true }, // F#5 (Resolution)
          { time: 820, freq: 587.33, vel: 0.5, isBell: true },  // D5
          { time: 1080, freq: 440.00, vel: 0.45 }, // A4
          { time: 1320, freq: 369.99, vel: 0.4 }  // F#4
        ],
        duration: 1600
      },

      // Measure 5: B Minor 7 (Thoughtful, best-friend bond)
      {
        padFreq: [123.47, 246.94], // B2, B3
        notes: [
          { time: 0, freq: 61.74, vel: 0.6 },     // B1 (Bass)
          { time: 110, freq: 246.94, vel: 0.4 },  // B3
          { time: 250, freq: 369.99, vel: 0.45 }, // F#4
          { time: 390, freq: 440.00, vel: 0.5 },  // A4
          { time: 560, freq: 587.33, vel: 0.55, isBell: true }, // D5
          { time: 800, freq: 739.99, vel: 0.6, isBell: true },  // F#5
          { time: 1060, freq: 587.33, vel: 0.45 }, // D5
          { time: 1300, freq: 440.00, vel: 0.4 }   // A4
        ],
        duration: 1600
      },

      // Measure 6: C Major 7 (Playful, laughter together)
      {
        padFreq: [130.81, 261.63], // C3, C4
        notes: [
          { time: 0, freq: 65.41, vel: 0.65 },    // C2 (Bass)
          { time: 100, freq: 261.63, vel: 0.4 },  // C4
          { time: 240, freq: 329.63, vel: 0.45 }, // E4
          { time: 380, freq: 493.88, vel: 0.5 },  // B4
          { time: 540, freq: 659.25, vel: 0.6, isBell: true },  // E5
          { time: 780, freq: 783.99, vel: 0.65, isBell: true }, // G5
          { time: 1060, freq: 987.77, vel: 0.6, isBell: true }, // B5 (High sparkle)
          { time: 1320, freq: 783.99, vel: 0.45 } // G5
        ],
        duration: 1600
      },

      // Measure 7: A Minor 9 (Sincere, gentle holding of hands)
      {
        padFreq: [110.00, 220.00], // A2, A3
        notes: [
          { time: 0, freq: 55.00, vel: 0.6 },     // A1 (Bass)
          { time: 110, freq: 220.00, vel: 0.4 },  // A3
          { time: 250, freq: 329.63, vel: 0.45 }, // E4
          { time: 390, freq: 392.00, vel: 0.5 },  // G4
          { time: 560, freq: 493.88, vel: 0.55, isBell: true }, // B4
          { time: 800, freq: 587.33, vel: 0.6, isBell: true },  // D5
          { time: 1060, freq: 659.25, vel: 0.55, isBell: true },// E5
          { time: 1320, freq: 523.25, vel: 0.4 }  // C5
        ],
        duration: 1600
      },

      // Measure 8: G add9 (Serene, whole heart, golden finale before loop)
      {
        padFreq: [196.00, 293.66], // G3, D4
        notes: [
          { time: 0, freq: 98.00, vel: 0.7 },     // G2 (Bass)
          { time: 120, freq: 293.66, vel: 0.4 },  // D4
          { time: 260, freq: 392.00, vel: 0.45 }, // G4
          { time: 420, freq: 440.00, vel: 0.5 },  // A4 (Add9)
          { time: 620, freq: 587.33, vel: 0.55, isBell: true }, // D5
          { time: 920, freq: 783.99, vel: 0.65, isBell: true }, // G5
          { time: 1260, freq: 880.00, vel: 0.5, isBell: true }  // A5 (Soft whisper)
        ],
        duration: 1900 // Slightly longer gentle pause before restarting
      }
    ];

    this.currentPatternIndex = 0;
    this.playNextMeasure();
  }

  playNextMeasure() {
    if (!this.isPlaying) return;

    const measure = this.songPattern[this.currentPatternIndex % this.songPattern.length];
    
    // Smoothly shift background pad to measure chord
    if (this.padOsc1 && this.padOsc2 && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.padOsc1.frequency.exponentialRampToValueAtTime(measure.padFreq[0], now + 1.2);
      this.padOsc2.frequency.exponentialRampToValueAtTime(measure.padFreq[1], now + 1.2);
    }

    // Schedule all notes in this measure with gentle acoustic touch
    measure.notes.forEach(note => {
      setTimeout(() => {
        if (!this.isPlaying) return;
        this.playAcousticVoice(note.freq, note.vel, note.isBell);
      }, note.time);
    });

    this.currentPatternIndex++;
    this.sequenceTimer = setTimeout(() => {
      this.playNextMeasure();
    }, measure.duration);
  }

  stopFreshAcousticSynth() {
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    if (this.padGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.padGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }
  }

  /**
   * Generates a soft, velvety acoustic felt piano / harp pluck note
   * with natural bell sparkle and rich harmonic decay.
   */
  playAcousticVoice(freq, velocity = 0.5, isBell = false) {
    if (!this.audioContext || this.audioContext.state !== 'running') return;
    const now = this.audioContext.currentTime;

    // 1. Fundamental warm body (Pure Sine)
    const oscFund = this.audioContext.createOscillator();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(freq, now);

    // 2. Harmonic body (Triangle with slight subtle warmth)
    const oscHarm = this.audioContext.createOscillator();
    oscHarm.type = 'triangle';
    oscHarm.frequency.setValueAtTime(freq * (isBell ? 2 : 1), now);
    oscHarm.detune.setValueAtTime(3.5, now); // Sweet acoustic chorus detune

    // Note gain envelope (Soft attack + long velvety acoustic decay)
    const noteGain = this.audioContext.createGain();
    const peakVol = velocity * (isBell ? 0.35 : 0.42);

    noteGain.gain.setValueAtTime(0, now);
    // Soft attack prevents clicks (30ms for standard, 15ms for bells)
    noteGain.gain.linearRampToValueAtTime(peakVol, now + (isBell ? 0.015 : 0.035));
    // Gentle acoustic exponential decay (2.2s for long soothing tail)
    const decayTime = isBell ? 1.8 : 2.4;
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

    // Lowpass filter per note (felt hammer effect)
    const noteFilter = this.audioContext.createBiquadFilter();
    noteFilter.type = 'lowpass';
    const cutoff = isBell ? 3200 : (freq < 150 ? 400 : 1800);
    noteFilter.frequency.setValueAtTime(cutoff, now);

    // Connect node graph
    oscFund.connect(noteFilter);
    oscHarm.connect(noteFilter);
    noteFilter.connect(noteGain);
    noteGain.connect(this.masterFilter);

    // Start & stop nodes
    oscFund.start(now);
    oscHarm.start(now);
    oscFund.stop(now + decayTime + 0.1);
    oscHarm.stop(now + decayTime + 0.1);
  }
}

window.RomanticMusicPlayer = RomanticMusicPlayer;
