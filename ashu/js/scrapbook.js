/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌻 PHOTO MEMORY SCRAPBOOK & PHOTO CUSTOMIZER (6 GALLERIES) 🌻
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class ScrapbookManager {
  constructor() {
    this.scrapbookConfig = window.BIRTHDAY_CONFIG.scrapbook;
    this.customPhotos = JSON.parse(localStorage.getItem('birthday_custom_photos') || '{}');
    
    this.initTabs();
    this.renderAllGalleries();
    this.initLightbox();
  }

  initTabs() {
    const tabs = document.querySelectorAll('.scrapbook-tab-btn');
    const panes = document.querySelectorAll('.gallery-pane');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPane = document.getElementById(`gallery-${target}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  getPhotoSrc(photoId, defaultSrc) {
    return this.customPhotos[photoId] || defaultSrc;
  }

  renderAllGalleries() {
    this.renderPolaroids();
    this.renderGrid();
    this.renderFilm();
    this.renderCandid();
    this.renderForever();
    this.renderFuture();
  }

  // 1. Polaroids Collage
  renderPolaroids() {
    const container = document.getElementById('polaroids-container');
    if (!container) return;
    const g = this.scrapbookConfig.gallery1;

    container.innerHTML = g.photos.map(p => {
      const src = this.getPhotoSrc(p.id, p.src);
      const washiClass = p.rotation > 0 ? 'washi-pink' : 'washi-tape';
      return `
        <div class="polaroid-frame" style="transform: rotate(${p.rotation}deg);" data-id="${p.id}" data-src="${src}" data-caption="${p.caption}">
          <div class="washi-tape ${washiClass}" style="top: -12px; left: 30%;"></div>
          <div class="polaroid-img-wrap">
            <img src="${src}" alt="${p.caption}" loading="lazy">
          </div>
          <p class="polaroid-caption">${p.caption}</p>
          <p class="polaroid-date">♡ ${p.date || 'Sweet Memory'}</p>
        </div>
      `;
    }).join('');

    this.bindPhotoClicks(container);
  }

  // 2. Clean Photo Grid
  renderGrid() {
    const container = document.getElementById('grid-container');
    if (!container) return;
    const g = this.scrapbookConfig.gallery2;

    container.innerHTML = g.photos.map(p => {
      const src = this.getPhotoSrc(p.id, p.src);
      return `
        <div class="grid-photo-card" data-id="${p.id}" data-src="${src}" data-caption="${p.caption}">
          <img class="grid-photo-img" src="${src}" alt="${p.caption}" loading="lazy">
          <div class="grid-photo-info">
            <p class="polaroid-caption" style="font-size: 1.2rem;">${p.caption}</p>
            <p class="polaroid-date">${p.date}</p>
          </div>
        </div>
      `;
    }).join('');

    this.bindPhotoClicks(container);
  }

  // 3. Film Strips (Best Friend Chapter)
  renderFilm() {
    const container = document.getElementById('film-container');
    if (!container) return;
    const g = this.scrapbookConfig.gallery3;

    container.innerHTML = g.photos.map(p => {
      const src = this.getPhotoSrc(p.id, p.src);
      return `
        <div class="film-strip-card" data-id="${p.id}" data-src="${src}" data-caption="${p.caption}">
          <div class="film-perforations">
            <div class="film-hole"></div><div class="film-hole"></div><div class="film-hole"></div>
            <span style="font-size: 0.75rem; color: #F4C95D;">${p.badge}</span>
            <div class="film-hole"></div><div class="film-hole"></div>
          </div>
          <div class="film-img-wrap">
            <img src="${src}" alt="${p.caption}" loading="lazy">
          </div>
          <p class="film-caption">${p.caption}</p>
          <div class="film-perforations" style="margin-top: 10px; margin-bottom: 0;">
            <div class="film-hole"></div><div class="film-hole"></div><div class="film-hole"></div>
            <div class="film-hole"></div><div class="film-hole"></div>
          </div>
        </div>
      `;
    }).join('');

    this.bindPhotoClicks(container);
  }

  // 4. Candid Collage (Us, Being Us)
  renderCandid() {
    const container = document.getElementById('candid-container');
    if (!container) return;
    const g = this.scrapbookConfig.gallery4;

    container.innerHTML = g.photos.map(p => {
      const src = this.getPhotoSrc(p.id, p.src);
      return `
        <div class="candid-item" data-id="${p.id}" data-src="${src}" data-caption="${p.caption}">
          <div class="candid-tag">${p.tag}</div>
          <div class="polaroid-img-wrap" style="aspect-ratio: 4/3;">
            <img src="${src}" alt="${p.caption}" loading="lazy">
          </div>
          <p class="polaroid-caption" style="font-size: 1.15rem;">${p.caption}</p>
        </div>
      `;
    }).join('');

    this.bindPhotoClicks(container);
  }

  // 5. Forever Moments
  renderForever() {
    const container = document.getElementById('forever-container');
    if (!container) return;
    const g = this.scrapbookConfig.gallery5;

    container.innerHTML = g.photos.map(p => {
      const src = this.getPhotoSrc(p.id, p.src);
      return `
        <div class="forever-card" data-id="${p.id}" data-src="${src}" data-caption="${p.caption}">
          <img class="forever-img" src="${src}" alt="${p.caption}" loading="lazy">
          <div class="forever-body">
            <p class="polaroid-caption" style="font-size: 1.35rem; margin-bottom: 6px;">${p.caption}</p>
            <span style="font-family: var(--font-handwritten); font-size: 1.15rem; color: #DE9D26;">feeling: ${p.feeling} ♡</span>
          </div>
        </div>
      `;
    }).join('');

    this.bindPhotoClicks(container);
  }

  // 6. Future Empty Dream Frames
  renderFuture() {
    const container = document.getElementById('future-container');
    if (!container) return;
    const g = this.scrapbookConfig.gallery6;

    container.innerHTML = g.frames.map(f => {
      return `
        <div class="future-frame">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">🌟</div>
          <p class="future-prompt">${f.prompt}</p>
          <p class="future-subtext">${f.subtext}</p>
          <span style="margin-top: 16px; font-size: 0.85rem; color: var(--sunflower-deep); font-weight: 700;">[ Reserved for our future ]</span>
        </div>
      `;
    }).join('');
  }

  bindPhotoClicks(parentEl) {
    parentEl.querySelectorAll('[data-src]').forEach(card => {
      card.addEventListener('click', () => {
        const src = card.dataset.src;
        const caption = card.dataset.caption;
        this.openLightbox(src, caption);
      });
    });
  }

  initLightbox() {
    this.lightbox = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxClose = document.getElementById('lightbox-close');

    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }
  }

  openLightbox(src, caption) {
    if (!this.lightbox) return;
    this.lightboxImg.src = src;
    this.lightboxCaption.textContent = caption || '';
    this.lightbox.classList.add('active');
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
    }
  }

  // Upload/replace photo dynamically
  updatePhoto(photoId, dataUrl) {
    this.customPhotos[photoId] = dataUrl;
    localStorage.setItem('birthday_custom_photos', JSON.stringify(this.customPhotos));
    this.renderAllGalleries();
  }
}

window.ScrapbookManager = ScrapbookManager;
