// Enhanced lightbox: supports dynamic galleries with show/hide in a single page
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('#lightbox .close');
const prevBtn = document.querySelector('#lightbox .prev');
const nextBtn = document.querySelector('#lightbox .next');
let currentIndex = 0;

function getVisibleImages() {
  return Array.from(document.querySelectorAll('.gallery img.photo:not(.hidden)'));
}

function bindLightboxToVisible() {
  if (!lightbox || !lightboxImg || !prevBtn || !nextBtn) return;

  const vis = getVisibleImages();
  vis.forEach((img, index) => {
    img.onclick = () => {
      currentIndex = index;
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
    };
  });
  // navigation
  prevBtn.onclick = () => {
    const v = getVisibleImages();
    if (!v.length) return;
    currentIndex = (currentIndex - 1 + v.length) % v.length;
    lightboxImg.src = v[currentIndex].src;
  };
  nextBtn.onclick = () => {
    const v = getVisibleImages();
    if (!v.length) return;
    currentIndex = (currentIndex + 1) % v.length;
    lightboxImg.src = v[currentIndex].src;
  };
}

if (lightbox && lightboxImg && closeBtn && prevBtn && nextBtn) {
  bindLightboxToVisible();

  // Fermer lightbox
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  // Fermer en cliquant sur le fond
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
}

// Progressive photo galleries: toggle extra photos with a button
// Progressive photo galleries: robust toggle for Stool and Backpack
(function initShowAllButtons() {
  function setupGallery(btnId, galleryId) {
    const btn = document.getElementById(btnId);
    const gallery = document.getElementById(galleryId);
    if (!btn || !gallery) return;
    const images = Array.from(gallery.querySelectorAll('img.photo'));
    images.forEach((img, idx) => {
      if (idx < 4) img.classList.remove('hidden');
      else img.classList.add('hidden');
    });
    btn.dataset.expanded = 'false';
    btn.addEventListener('click', () => {
      const show = btn.dataset.expanded === 'false';
      images.forEach((img, idx) => {
        if (idx >= 4) img.classList.toggle('hidden', !show);
      });
      btn.textContent = show ? 'Masquer les photos' : 'Voir toutes les photos';
      btn.setAttribute('aria-expanded', String(show));
      btn.dataset.expanded = String(show);
      bindLightboxToVisible();
    });
  }
  setupGallery('showAllStoolPhotos','stool-gallery');
  setupGallery('showAllBackpackPhotos','backpack-gallery');
})();
