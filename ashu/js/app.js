/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 MAIN APPLICATION ORCHESTRATOR 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.BIRTHDAY_CONFIG;

  // 1. Initialize Sub-Systems
  window.celebration = new window.CelebrationEngine();
  window.musicPlayer = new window.RomanticMusicPlayer();
  window.garden = new window.SunflowerGarden();
  window.cake = new window.BirthdayCakeController();
  window.greetingCard = new window.GreetingCardController();
  window.openWhen = new window.OpenWhenManager();

  // 2. Setup Cursor Star Trail (Throttled for 60fps smoothness)
  setupCursorStars();

  // 3. Setup Scroll Progress Bar & Sunflower Indicator
  setupScrollProgress();

  // 4. Render All Dynamic Content Sections
  renderHeroAndIntro(config);
  renderLongLoveLetter(config);
  render21Reasons(config);
  renderWorldWishes(config);
  renderTimeline(config);
  renderSecretSurprise(config);
  renderFinalMessage(config);

  // 5. Setup Surprise Envelope Opening Sequence
  setupIntroEnvelope();

  // 6. Setup Celebration Buttons & Poppers
  setupCelebrationButtons();
});

/* ─── INTRO ENVELOPE OPENING ──────────────────────────────────────────────── */
function setupIntroEnvelope() {
  const overlay = document.getElementById('intro-overlay');
  const envelope = document.getElementById('surprise-envelope');
  const openBtn = document.getElementById('btn-open-surprise');

  function openSurprise() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');

    // Confetti burst
    if (window.celebration) {
      window.celebration.triggerConfetti(90);
    }

    // Try starting music box softly
    if (window.musicPlayer && !window.musicPlayer.isPlaying) {
      window.musicPlayer.play();
    }

    // Fade overlay out like opening a storybook
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 1800);
  }

  if (openBtn) openBtn.addEventListener('click', openSurprise);
  if (envelope) envelope.addEventListener('click', openSurprise);

  // Replay Story Button
  const replayBtn = document.getElementById('btn-replay-story');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        envelope.classList.remove('open');
        overlay.classList.remove('hidden');
      }, 600);
    });
  }
}

/* ─── CURSOR STAR TRAIL ───────────────────────────────────────────────────── */
function setupCursorStars() {
  let lastX = 0, lastY = 0;
  const stars = ['✨', '⭐', '🌻', '💛', '🌸'];

  window.addEventListener('pointermove', (e) => {
    // Only spawn if moved at least 25px
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < 28) return;
    lastX = e.clientX;
    lastY = e.clientY;

    const star = document.createElement('span');
    star.className = 'cursor-star';
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.left = `${e.clientX}px`;
    star.style.top = `${e.clientY}px`;
    document.body.appendChild(star);

    setTimeout(() => star.remove(), 750);
  });
}

/* ─── SCROLL PROGRESS INDICATOR ───────────────────────────────────────────── */
function setupScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* ─── RENDER HERO & INTRO CONTENT ─────────────────────────────────────────── */
function renderHeroAndIntro(config) {
  const teaser = document.getElementById('intro-teaser');
  const subtext = document.getElementById('intro-subtext');
  const heroHeading = document.getElementById('hero-heading');
  const heroSub = document.getElementById('hero-subheading');
  const heroQuote = document.getElementById('hero-handwritten-quote');

  if (teaser) teaser.textContent = config.intro.envelopeTeaser;
  if (subtext) subtext.textContent = config.intro.envelopeSubtext;
  if (heroHeading) heroHeading.textContent = config.intro.heroHeading;
  if (heroSub) heroSub.textContent = config.intro.heroSubheading;
  if (heroQuote) heroQuote.textContent = config.intro.heroHandwrittenQuote;
}

/* ─── RENDER THE LOVE LETTER ──────────────────────────────────────────────── */
function renderLongLoveLetter(config) {
  const title = document.getElementById('letter-title');
  const subtitle = document.getElementById('letter-subtitle');
  const bodyContainer = document.getElementById('letter-body-container');

  if (title) title.textContent = config.loveLetter.title;
  if (subtitle) subtitle.textContent = config.loveLetter.subtitle;

  if (bodyContainer) {
    bodyContainer.innerHTML = config.loveLetter.sections.map((sec, idx) => {
      const isLast = idx === config.loveLetter.sections.length - 1;
      return `
        <div class="letter-section-block">
          <h3 class="letter-section-heading">
            <span>Part ${sec.part}. ${sec.heading}</span>
          </h3>
          <div class="letter-section-text">${sec.text}</div>
          ${!isLast ? `
            <div class="letter-divider">
              <span>🌻</span>
              <span>♡</span>
              <span>🌻</span>
            </div>
            <div class="letter-encouragement">keep reading, there's more love here ♡</div>
          ` : ''}
        </div>
      `;
    }).join('');
  }
}

/* ─── RENDER 21 REASONS CARDS ─────────────────────────────────────────────── */
function render21Reasons(config) {
  const container = document.getElementById('reasons-grid-container');
  if (!container) return;

  container.innerHTML = config.reasons.map(r => {
    return `
      <div class="reason-card" data-num="${r.num}">
        <div class="reason-card-top">
          <span class="reason-number">#${r.num} of 21</span>
          <span class="reason-badge">${r.badge}</span>
        </div>
        <h4 class="reason-title">${r.title}</h4>
        <p class="reason-text">${r.text}</p>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.reason-card').forEach(card => {
    card.addEventListener('click', () => {
      if (window.celebration) {
        window.celebration.triggerConfetti(15);
      }
    });
  });
}

/* ─── RENDER IF I COULD GIVE YOU THE WORLD ────────────────────────────────── */
function renderWorldWishes(config) {
  const container = document.getElementById('world-clouds-container');
  const conclusion = document.getElementById('world-conclusion');
  if (!container) return;

  container.innerHTML = config.wishesForWorld.clouds.map(c => {
    return `
      <div class="cloud-wish-card">
        <div class="cloud-card-top">
          <span style="font-size: 1.8rem;">${c.icon}</span>
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--deep-brown);">${c.title}</h4>
        </div>
        <p class="cloud-wish-text">${c.wish}</p>
      </div>
    `;
  }).join('');

  if (conclusion) conclusion.textContent = `"${config.wishesForWorld.conclusion}"`;
}

/* ─── RENDER TIMELINE OF OUR STORY ────────────────────────────────────────── */
function renderTimeline(config) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = config.timeline.events.map(ev => {
    return `
      <div class="timeline-item">
        <div class="timeline-sunflower-node"></div>
        <div class="timeline-card">
          <p class="timeline-date-badge">${ev.date}</p>
          <h4 class="timeline-card-title">${ev.title}</h4>
          <p class="timeline-card-desc">${ev.description}</p>
        </div>
      </div>
    `;
  }).join('');
}

/* ─── RENDER SECRET SURPRISE MODAL & BUTTON ───────────────────────────────── */
function renderSecretSurprise(config) {
  const btn = document.getElementById('btn-secret-sunflower');
  const modal = document.getElementById('secret-modal');
  const modalClose = document.getElementById('secret-modal-close');
  const title = document.getElementById('secret-modal-title');
  const body = document.getElementById('secret-modal-body');
  const jokesList = document.getElementById('secret-modal-jokes');

  if (title) title.textContent = config.secretSurprise.title;
  if (body) body.innerHTML = config.secretSurprise.body.replace(/\n/g, '<br>');

  if (jokesList && config.personal.insideJokes) {
    jokesList.innerHTML = config.personal.insideJokes.map(j => `<li>${j}</li>`).join('');
  }

  if (btn && modal) {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
      if (window.celebration) window.celebration.triggerCelebration();
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

/* ─── RENDER FINAL MESSAGE & SIGNATURE ────────────────────────────────────── */
function renderFinalMessage(config) {
  const heading = document.getElementById('final-heading');
  const paragraphsContainer = document.getElementById('final-paragraphs-container');
  const signature = document.getElementById('final-signature');

  if (heading) heading.textContent = config.finalMessage.heading;
  if (signature) signature.textContent = config.finalMessage.signature;

  if (paragraphsContainer) {
    paragraphsContainer.innerHTML = config.finalMessage.paragraphs.map(p => {
      return `<p>${p}</p>`;
    }).join('');
  }
}

/* ─── SETUP CELEBRATION BUTTONS ───────────────────────────────────────────── */
function setupCelebrationButtons() {
  const popperBtn = document.getElementById('btn-party-popper');
  if (popperBtn) {
    popperBtn.addEventListener('click', () => {
      if (window.celebration) window.celebration.triggerCelebration();
    });
  }
}
