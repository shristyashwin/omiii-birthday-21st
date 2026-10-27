/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 PASTEL CONFETTI, FLOATING HEARTS & BALLOONS CELEBRATION ENGINE 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class CelebrationEngine {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'particles-canvas';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.balloons = [];
    this.isAnimating = false;
    this.heartsTimer = null;

    this.colors = [
      '#F8E7A1', // Butter yellow
      '#F4C95D', // Sunflower gold
      '#F6DCE1', // Soft blush
      '#EAA6B3', // Deep blush
      '#F4C8AD', // Warm peach
      '#B7C9A5', // Sage green
      '#FFF9EF'  // Cream
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startFallingHeartsTimer(30000);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  triggerConfetti(count = 70) {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const shapeType = Math.random() > 0.6 ? 'petal' : (Math.random() > 0.4 ? 'heart' : 'confetti');

      this.particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 9 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.14,
        drag: 0.98,
        opacity: 1,
        fadeSpeed: 0.005 + Math.random() * 0.006,
        shape: shapeType
      });
    }

    if (!this.isAnimating) {
      this.isAnimating = true;
      this.loop();
    }
  }

  triggerBalloons(count = 12) {
    for (let i = 0; i < count; i++) {
      this.balloons.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50 + Math.random() * 100,
        vy: -(Math.random() * 2 + 1.8),
        vx: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 14 + 22,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        stringLength: 45,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.04
      });
    }

    if (!this.isAnimating) {
      this.isAnimating = true;
      this.loop();
    }
  }

  triggerCelebration() {
    this.triggerConfetti(140);
    this.triggerBalloons(16);
  }

  startFallingHeartsTimer(intervalMs = 30000) {
    if (this.heartsTimer) clearInterval(this.heartsTimer);

    // Initial gentle shower 2.5 seconds after loading
    setTimeout(() => {
      this.triggerFallingHearts(28);
    }, 2500);

    // Repeated every 30 seconds
    this.heartsTimer = setInterval(() => {
      this.triggerFallingHearts(30);
    }, intervalMs);
  }

  triggerFallingHearts(count = 30) {
    const heartColors = [
      '#FF7597', // Romantic soft rose
      '#FFAEC8', // Pastel pink
      '#F4C8AD', // Warm peach
      '#F6DCE1', // Soft blush
      '#EAA6B3', // Warm blush
      '#F4C95D', // Sunflower gold
      '#FF85A1'  // Vibrant sweet pink
    ];

    for (let i = 0; i < count; i++) {
      const startX = Math.random() * window.innerWidth;
      const startY = -25 - Math.random() * 200; // Staggered start heights
      const size = Math.random() * 8 + 10; // Cute little hearts (10px to 18px)
      const speedY = Math.random() * 1.1 + 1.0; // Gentle floating speed
      const swaySpeed = Math.random() * 0.025 + 0.015;
      const swayWidth = Math.random() * 1.8 + 1.2;

      this.particles.push({
        x: startX,
        y: startY,
        startX: startX,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: swaySpeed,
        swayWidth: swayWidth,
        vy: speedY,
        vx: 0,
        size: size,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: (Math.random() - 0.5) * 35,
        rotationSpeed: (Math.random() - 0.5) * 1.4,
        gravity: 0,
        drag: 1,
        opacity: Math.random() * 0.3 + 0.7,
        fadeSpeed: 0.0005,
        shape: 'heart',
        isFallingHeart: true
      });
    }

    if (!this.isAnimating) {
      this.isAnimating = true;
      this.loop();
    }
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.fill();
    ctx.restore();
  }

  drawPetal(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.45, size * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.isFallingHeart) {
        p.swayOffset += p.swaySpeed;
        p.x = p.startX + Math.sin(p.swayOffset) * (p.swayWidth * 16);
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        if (p.y > this.canvas.height - 90) {
          p.opacity -= 0.015;
        }
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeSpeed;
      }

      if (p.opacity <= 0 || p.y > this.canvas.height + 60) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.shape === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else if (p.shape === 'petal') {
        this.drawPetal(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else {
        // Confetti Ribbon
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        this.ctx.restore();
      }
    }

    // Update and draw balloons
    for (let i = this.balloons.length - 1; i >= 0; i--) {
      const b = this.balloons[i];
      b.y += b.vy;
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 1.2 + b.vx;

      if (b.y < -100) {
        this.balloons.splice(i, 1);
        continue;
      }

      this.ctx.save();
      // Balloon body
      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.ellipse(b.x, b.y, b.radius * 0.85, b.radius, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Balloon highlight
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.beginPath();
      this.ctx.ellipse(b.x - b.radius * 0.3, b.y - b.radius * 0.4, b.radius * 0.25, b.radius * 0.4, -0.4, 0, Math.PI * 2);
      this.ctx.fill();

      // Balloon knot
      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.moveTo(b.x - 4, b.y + b.radius);
      this.ctx.lineTo(b.x + 4, b.y + b.radius);
      this.ctx.lineTo(b.x, b.y + b.radius + 6);
      this.ctx.fill();

      // String
      this.ctx.strokeStyle = '#8C705E';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(b.x, b.y + b.radius + 6);
      this.ctx.quadraticCurveTo(
        b.x + Math.sin(b.wobble) * 10,
        b.y + b.radius + 25,
        b.x,
        b.y + b.radius + b.stringLength
      );
      this.ctx.stroke();

      this.ctx.restore();
    }

    if (this.particles.length > 0 || this.balloons.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.isAnimating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.CelebrationEngine = CelebrationEngine;
