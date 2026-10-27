/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 INTERACTIVE SUNFLOWER GARDEN CONTROLLER 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class SunflowerGarden {
  constructor() {
    this.gardenContainer = document.querySelector('.garden-meadow');
    this.notes = window.BIRTHDAY_CONFIG.gardenNotes;
    this.modal = document.getElementById('garden-modal');
    this.modalTitle = document.getElementById('garden-modal-title');
    this.modalBody = document.getElementById('garden-modal-body');
    this.closeBtn = document.getElementById('garden-modal-close');

    this.flowers = [];
    this.initFlowers();
    this.setupCursorTracking();
    this.setupModal();
  }

  initFlowers() {
    if (!this.gardenContainer) return;
    this.gardenContainer.innerHTML = '';

    this.notes.forEach((note, index) => {
      const stem = document.createElement('div');
      stem.className = 'interactive-flower-stem';
      stem.dataset.id = note.id;

      // Staggered height and delay
      const height = 140 + (index % 3) * 25;
      const swayDelay = (index * 0.4).toFixed(1);

      stem.innerHTML = `
        <div class="flower-bloom-head sway-sunflower" style="animation-delay: -${swayDelay}s;">
          <img src="assets/images/sunflower-bloom.svg" alt="${note.flowerName}" width="105" height="105">
        </div>
        <div class="flower-stem-graphic" style="height: ${height}px;">
          <div class="flower-leaf left"></div>
          <div class="flower-leaf right"></div>
        </div>
        <div class="flower-tag-bubble">tap for secret note ♡</div>
      `;

      stem.addEventListener('click', () => this.openNote(note));
      this.gardenContainer.appendChild(stem);
      this.flowers.push(stem);
    });

    // Add fluttering butterfly & bee
    const butterfly = document.createElement('div');
    butterfly.className = 'garden-creature animate-butterfly';
    butterfly.style.top = '15%';
    butterfly.style.left = '20%';
    butterfly.innerHTML = '<img src="assets/images/butterfly.svg" alt="butterfly" width="48" height="48">';
    this.gardenContainer.appendChild(butterfly);

    const bee = document.createElement('div');
    bee.className = 'garden-creature float-slow';
    bee.style.top = '35%';
    bee.style.right = '22%';
    bee.innerHTML = '<img src="assets/images/bee.svg" alt="little bee" width="40" height="32">';
    this.gardenContainer.appendChild(bee);
  }

  setupCursorTracking() {
    if (!this.gardenContainer) return;

    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      this.flowers.forEach((flower) => {
        const head = flower.querySelector('.flower-bloom-head');
        if (!head) return;

        const rect = head.getBoundingClientRect();
        const flowerCenterX = rect.left + rect.width / 2;
        const flowerCenterY = rect.top + rect.height / 2;

        const deltaX = mouseX - flowerCenterX;
        const deltaY = mouseY - flowerCenterY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Gentle tilt constrained to -18deg to +18deg
        const clampedTilt = Math.max(-18, Math.min(18, deltaX * 0.05));
        head.style.transform = `rotate(${clampedTilt}deg)`;
      });
    });
  }

  setupModal() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeNote());
    }
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeNote();
      });
    }
  }

  openNote(note) {
    if (!this.modal) return;
    this.modalTitle.textContent = note.flowerName;
    this.modalBody.textContent = `"${note.message}"`;
    this.modal.classList.add('active');

    if (window.celebration) {
      window.celebration.triggerConfetti(25);
    }
  }

  closeNote() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }
}

window.SunflowerGarden = SunflowerGarden;
