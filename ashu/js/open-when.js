/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 OPEN-WHEN LETTERS CONTROLLER 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class OpenWhenManager {
  constructor() {
    this.letters = window.BIRTHDAY_CONFIG.openWhenLetters;
    this.container = document.querySelector('.open-when-grid');
    this.modal = document.getElementById('open-when-modal');
    this.modalTitle = document.getElementById('open-when-modal-title');
    this.modalBadge = document.getElementById('open-when-modal-badge');
    this.modalBody = document.getElementById('open-when-modal-body');
    this.modalClose = document.getElementById('open-when-modal-close');

    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = '';

    this.letters.forEach(letter => {
      const card = document.createElement('div');
      card.className = 'open-when-envelope';
      card.innerHTML = `
        <img class="open-when-seal" src="assets/images/sunflower-sticker.svg" alt="seal">
        <h3 class="open-when-title">${letter.title}</h3>
        <p class="open-when-cta">tap to open letter ♡</p>
      `;

      card.addEventListener('click', () => this.openLetter(letter));
      this.container.appendChild(card);
    });

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeLetter());
    }
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeLetter();
      });
    }
  }

  openLetter(letter) {
    if (!this.modal) return;
    this.modalTitle.textContent = letter.title;
    if (this.modalBadge) this.modalBadge.textContent = letter.badge || '💌';
    this.modalBody.innerHTML = letter.letter.replace(/\n\n/g, '<br><br>');
    this.modal.classList.add('active');

    if (window.celebration) {
      window.celebration.triggerConfetti(20);
    }
  }

  closeLetter() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }
}

window.OpenWhenManager = OpenWhenManager;
