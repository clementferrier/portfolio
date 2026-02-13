document.addEventListener('DOMContentLoaded', function() {

  

  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const carouselContainer = document.querySelector('.carousel');

  if (!track || slides.length === 0) return;

  const visibleCount = 3; // nombre visible en desktop
  const origSlides = [...slides];

  /* ================================
     CLONAGE POUR BOUCLE INFINIE
  ================================= */

  const lastClones = origSlides.slice(-visibleCount);
  const firstClones = origSlides.slice(0, visibleCount);

  lastClones.reverse().forEach(slide => {
    track.insertBefore(slide.cloneNode(true), track.firstChild);
  });

  firstClones.forEach(slide => {
    track.appendChild(slide.cloneNode(true));
  });

  const allSlides = Array.from(track.children);
  let index = visibleCount;
  let isTransitioning = false;

  /* ================================
     DOTS NAVIGATION
  ================================= */

  let dots = [];

  function createDots(total) {
    let container = carouselContainer.querySelector('.carousel-dots');
    if (!container) {
      container = document.createElement('div');
      container.className = 'carousel-dots';
      carouselContainer.appendChild(container);
    }

    container.innerHTML = '';

    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot';
      btn.addEventListener('click', () => {
        index = i + visibleCount;
        slide();
        handleWrap();
      });
      container.appendChild(btn);
    }

    dots = Array.from(container.querySelectorAll('.dot'));
  }

  function updateDots() {
    const total = origSlides.length;
    const activeIndex = ((index - visibleCount) % total + total) % total;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  createDots(origSlides.length);

  /* ================================
     CENTRAGE + ACTIVE
  ================================= */

  function updateActive() {
  allSlides.forEach(slide => slide.classList.remove('active'));

  const isMobile = window.innerWidth <= 768;
  const centerOffset = isMobile ? 0 : 1;

  const centerIndex = index + centerOffset;

  if (allSlides[centerIndex]) {
    allSlides[centerIndex].classList.add('active');
  }
}



  function slide(smooth = true) {

  const slideWidth = allSlides[0].getBoundingClientRect().width;
  const move = slideWidth * index;

  track.style.transition = smooth
    ? 'transform 0.5s cubic-bezier(.4,0,.2,1)'
    : 'none';

  track.style.transform = `translateX(-${move}px)`;

  updateActive();
  updateDots();
}


  function handleWrap() {
    track.addEventListener('transitionend', function wrapHandler() {
      track.removeEventListener('transitionend', wrapHandler);

      if (index >= visibleCount + origSlides.length) {
        index = visibleCount;
        slide(false);
      }

      if (index < visibleCount) {
        index = visibleCount + origSlides.length - 1;
        slide(false);
      }

      isTransitioning = false;

    }, { once: true });
  }

  /* ================================
     BOUTONS
  ================================= */

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    index--;
    slide();
    handleWrap();
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    index++;
    slide();
    handleWrap();
  });

  /* ================================
     AUTOPLAY
  ================================= */

  const AUTO_PLAY = true;
  const AUTO_DELAY = 5000;
  let autoplayTimer = null;

  function startAutoplay() {
    if (AUTO_PLAY) {
      autoplayTimer = setInterval(() => {
        nextBtn.click();
      }, AUTO_DELAY);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  carouselContainer.addEventListener('mouseenter', stopAutoplay);
  carouselContainer.addEventListener('mouseleave', startAutoplay);

  /* ================================
     SWIPE MOBILE
  ================================= */

  let startX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  });

  track.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextBtn.click();
      } else {
        prevBtn.click();
      }
    }

    startAutoplay();
  });

  /* ================================
     SCROLL VERS PROJETS AU CLIC
  ================================= */

  track.addEventListener('click', (e) => {
    const slide = e.target.closest('.carousel-slide');
    if (!slide) return;

    const target = document.querySelector('#projets');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ================================
     NAVIGATION CLAVIER
  ================================= */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  /* ================================
     INIT
  ================================= */

  window.addEventListener('resize', () => slide(false));

  slide(false);
  startAutoplay();

});
