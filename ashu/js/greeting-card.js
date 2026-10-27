/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 INTERACTIVE 3D GREETING CARD & PRINT CONTROLLER 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class GreetingCardController {
  constructor() {
    this.config = window.BIRTHDAY_CONFIG.greetingCard;
    this.cardContainer = document.querySelector('.card-3d-container');
    this.openBtn = document.getElementById('btn-open-card');
    this.printBtn = document.getElementById('btn-print-card');

    this.init();
  }

  init() {
    if (this.cardContainer) {
      this.cardContainer.addEventListener('click', () => this.toggleCard());
    }

    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.toggleCard());
    }

    if (this.printBtn) {
      this.printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    this.populateContent();
  }

  populateContent() {
    const coverTitle = document.getElementById('card-cover-title');
    const insideHeading = document.getElementById('card-inside-heading');
    const insideBody = document.getElementById('card-inside-body');
    const insideSig = document.getElementById('card-inside-signature');

    if (coverTitle) coverTitle.textContent = this.config.coverTitle;
    if (insideHeading) insideHeading.textContent = this.config.insideHeading;
    if (insideBody) insideBody.textContent = this.config.insideBody;
    if (insideSig) insideSig.textContent = this.config.insideSignature;
  }

  toggleCard() {
    if (!this.cardContainer) return;
    this.cardContainer.classList.toggle('flipped');

    const isFlipped = this.cardContainer.classList.contains('flipped');
    if (this.openBtn) {
      this.openBtn.textContent = isFlipped ? 'Close Card ↺' : 'Open Greeting Card ♡';
    }

    if (isFlipped && window.celebration) {
      window.celebration.triggerConfetti(30);
    }
  }
}

window.GreetingCardController = GreetingCardController;
