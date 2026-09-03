export class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.5;
    this.bgmOsc = null;
    this.bgmGain = null;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.2, fade = true) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime);

      if (fade) {
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  playNoise(duration = 0.1, gainVal = 0.3) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      whiteNoise.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();
    } catch (e) {}
  }

  playPunch() {
    this.playTone(180, 'square', 0.08, 0.25);
    this.playNoise(0.05, 0.2);
  }

  playKick() {
    this.playTone(120, 'triangle', 0.12, 0.3);
    this.playNoise(0.08, 0.25);
  }

  playHeavy() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.35 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
      this.playNoise(0.18, 0.3);
    } catch (e) {}
  }

  playSpecial() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playDash() {
    this.playNoise(0.12, 0.2);
  }

  playHit() {
    this.playTone(90, 'sawtooth', 0.1, 0.25);
  }

  playEnemyDeath() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
      this.playNoise(0.15, 0.25);
    } catch (e) {}
  }

  playCoin() {
    this.playTone(987.77, 'sine', 0.08, 0.2, false);
    setTimeout(() => this.playTone(1318.51, 'sine', 0.15, 0.2, true), 70);
  }

  playHealth() {
    this.playTone(523.25, 'triangle', 0.1, 0.2);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.2), 80);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.2, 0.2), 160);
  }

  playWarning() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(220, 'sawtooth', 0.2, 0.35);
      }, i * 250);
    }
  }

  playVictory() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((note, idx) => {
      setTimeout(() => this.playTone(note, 'square', 0.25, 0.3), idx * 120);
    });
  }

  playGameOver() {
    const notes = [400, 350, 300, 200];
    notes.forEach((note, idx) => {
      setTimeout(() => this.playTone(note, 'sawtooth', 0.3, 0.3), idx * 180);
    });
  }

  playElectricZap() {
    this.playTone(800, 'sawtooth', 0.15, 0.25);
    this.playNoise(0.1, 0.3);
  }

  playGroundSlam() {
    this.playTone(60, 'square', 0.3, 0.4);
    this.playNoise(0.25, 0.4);
  }

  startBGM(type = 'stage') {
    if (this.isBgmPlaying) this.stopBGM();
    this.isBgmPlaying = true;
    this.init();

    const bpm = type === 'boss' ? 140 : 120;
    const interval = (60 / bpm) * 1000 / 2;
    const stageScale = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63];
    const bossScale = [146.83, 155.56, 174.61, 207.65, 220.00, 246.94];
    const scale = type === 'boss' ? bossScale : stageScale;

    let step = 0;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.isBgmPlaying) return;
      const freq = scale[step % scale.length];
      if (step % 2 === 0) {
        this.playTone(freq, type === 'boss' ? 'sawtooth' : 'square', 0.1, 0.08, true);
      }
      step++;
    }, interval);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const audioManager = new AudioManager();
