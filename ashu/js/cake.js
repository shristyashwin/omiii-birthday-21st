/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 21ST BIRTHDAY CAKE & CANDLE WISH CONTROLLER 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class BirthdayCakeController {
  constructor() {
    this.config = window.BIRTHDAY_CONFIG.cake;
    this.cakeContainer = document.querySelector('.cake-interaction-box');
    this.wishBtn = document.getElementById('btn-make-wish');
    this.wishReveal = document.getElementById('cake-wish-reveal');
    this.wishText = document.getElementById('cake-wish-text');

    this.candlesBlown = false;
    this.init();
  }

  init() {
    if (this.wishText && this.config.wishGrantedMessage) {
      this.wishText.textContent = this.config.wishGrantedMessage;
    }

    if (this.wishBtn) {
      this.wishBtn.addEventListener('click', () => this.makeWish());
    }

    // Allow clicking the 21 candles to toggle them manually
    const flames = document.querySelectorAll('.cake-candle-21');
    flames.forEach(candle => {
      candle.style.cursor = 'pointer';
      candle.addEventListener('click', () => {
        candle.classList.toggle('candle-blown-out');
      });
    });
  }

  makeWish() {
    if (this.candlesBlown) {
      // Re-light candles if clicked again
      this.relight();
      return;
    }

    this.candlesBlown = true;
    if (this.wishBtn) {
      this.wishBtn.innerHTML = 'Wish Sent to the Stars ✨ (Click to Relight)';
      this.wishBtn.disabled = true;
    }

    const cakeSvg = document.querySelector('.cake-illustration-svg');
    if (cakeSvg) {
      cakeSvg.style.filter = 'brightness(1.15) drop-shadow(0 0 25px rgba(244, 201, 93, 0.8))';
    }

    // Play chime sound if audioContext is available
    this.playWishChime();

    setTimeout(() => {
      // Blow out flames
      const candles = document.querySelectorAll('.cake-candle-21');
      candles.forEach(c => c.classList.add('candle-blown-out'));

      // Spawn cute smoke puffs
      this.createSmokePuff();

      if (cakeSvg) {
        cakeSvg.style.filter = 'drop-shadow(0 10px 20px rgba(117, 91, 74, 0.14))';
      }

      // Reveal wish message
      if (this.wishReveal) {
        this.wishReveal.classList.add('show');
      }

      // Celebratory Confetti & Balloons!
      if (window.celebration) {
        window.celebration.triggerCelebration();
      }

      if (this.wishBtn) {
        this.wishBtn.disabled = false;
      }
    }, 1200);
  }

  createSmokePuff() {
    const cakeBox = document.querySelector('.cake-interaction-box');
    if (!cakeBox) return;

    for (let i = 0; i < 6; i++) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-puff';
      smoke.style.left = `${45 + (Math.random() * 10)}%`;
      smoke.style.top = `${25 + (Math.random() * 10)}%`;
      smoke.style.animationDelay = `${i * 0.15}s`;
      cakeBox.appendChild(smoke);

      setTimeout(() => smoke.remove(), 1500);
    }
  }

  relight() {
    this.candlesBlown = false;
    const candles = document.querySelectorAll('.cake-candle-21');
    candles.forEach(c => c.classList.remove('candle-blown-out'));

    if (this.wishReveal) {
      this.wishReveal.classList.remove('show');
    }
    if (this.wishBtn) {
      this.wishBtn.innerHTML = this.config.buttonText || 'Make a Birthday Wish 🎂';
    }
  }

  playWishChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch (e) {
      // AudioContext not permitted or supported; safe to ignore
    }
  }
}

window.BirthdayCakeController = BirthdayCakeController;
