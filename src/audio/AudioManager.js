export class AudioManager {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicPlaying = false;
    this.musicNodes = [];
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.15;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.25;
      this.sfxGain.connect(this.ctx.destination);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not available');
    }
  }

  playShoot() {
    if (!this.initialized) return;
    this._playTone(880, 0.05, 'square', 0.15);
  }

  playEnemyShoot() {
    if (!this.initialized) return;
    this._playTone(440, 0.06, 'sawtooth', 0.1);
  }

  playExplosion() {
    if (!this.initialized) return;
    this._playNoise(0.15, 0.3);
    this._playTone(100, 0.15, 'sawtooth', 0.2);
  }

  playBigExplosion() {
    if (!this.initialized) return;
    this._playNoise(0.3, 0.5);
    this._playTone(60, 0.3, 'sawtooth', 0.3);
    this._playTone(40, 0.4, 'square', 0.2);
  }

  playJump() {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playDeath() {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playPowerUp() {
    if (!this.initialized) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const t = this.ctx.currentTime + i * 0.08;
      this._playToneAt(freq, t, 0.08, 'square', 0.15);
    });
  }

  playBossWarning() {
    if (!this.initialized) return;
    for (let i = 0; i < 3; i++) {
      this._playToneAt(200, this.ctx.currentTime + i * 0.3, 0.15, 'square', 0.2);
    }
  }

  playLevelComplete() {
    if (!this.initialized) return;
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((freq, i) => {
      this._playToneAt(freq, this.ctx.currentTime + i * 0.12, 0.12, 'square', 0.15);
    });
  }

  // Simple chiptune music loop
  startMusic() {
    if (!this.initialized || this.musicPlaying) return;
    this.musicPlaying = true;
    this._playMusicLoop();
  }

  stopMusic() {
    this.musicPlaying = false;
    this.musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    this.musicNodes = [];
  }

  _playMusicLoop() {
    if (!this.musicPlaying) return;

    // Simple contra-inspired melody (bass + lead)
    const bpm = 140;
    const beatLen = 60 / bpm;
    const now = this.ctx.currentTime;

    // Bass line
    const bassNotes = [82, 82, 110, 110, 98, 98, 82, 82, 73, 73, 82, 82, 98, 98, 110, 110];
    bassNotes.forEach((freq, i) => {
      const n = this._createNote(freq, now + i * beatLen * 0.5, beatLen * 0.45, 'square', 0.08);
      if (n) this.musicNodes.push(n);
    });

    // Lead melody
    const leadNotes = [330, 0, 392, 440, 330, 0, 294, 330, 262, 0, 330, 392, 440, 392, 330, 294];
    leadNotes.forEach((freq, i) => {
      if (freq === 0) return;
      const n = this._createNote(freq, now + i * beatLen * 0.5, beatLen * 0.4, 'square', 0.06);
      if (n) this.musicNodes.push(n);
    });

    // Schedule next loop
    const loopLen = bassNotes.length * beatLen * 0.5;
    this._musicTimeout = setTimeout(() => {
      this.musicNodes = [];
      this._playMusicLoop();
    }, loopLen * 1000 - 50);
  }

  _createNote(freq, time, dur, type, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.setValueAtTime(vol, time + dur * 0.8);
    gain.gain.linearRampToValueAtTime(0, time + dur);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + dur);
    return osc;
  }

  _playTone(freq, dur, type = 'square', vol = 0.1) {
    this._playToneAt(freq, this.ctx.currentTime, dur, type, vol);
  }

  _playToneAt(freq, time, dur, type, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.linearRampToValueAtTime(0, time + dur);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + dur);
  }

  _playNoise(dur, vol) {
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + dur);
    source.connect(gain);
    gain.connect(this.sfxGain);
    source.start();
  }
}
