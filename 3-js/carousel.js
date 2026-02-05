document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const visibleCount = 3;

  if (!track || slides.length === 0) return;

  // Clone slides for infinite effect: clone first 3 slides at end, last 3 at beginning
  const origSlides = [...slides];
  const lastThree = origSlides.slice(-visibleCount);
  const firstThree = origSlides.slice(0, visibleCount);

  // Prepend clones of last 3
  lastThree.reverse().forEach(slide => {
    track.insertBefore(slide.cloneNode(true), track.firstChild);
  });

  // Append clones of first 3
  firstThree.forEach(slide => {
    track.appendChild(slide.cloneNode(true));
  });

  const allSlides = Array.from(track.children);
  let index = visibleCount; // Start at first real slide
  let isTransitioning = false;

  const getGap = () => {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap) || 0;
  };

  const updateScales = () => {
    allSlides.forEach((slide, i) => {
      const centerSlideIndex = index + 1;
      const distance = Math.abs(i - centerSlideIndex);
      const scale = distance === 0 ? 1 : 0.7;
      const img = slide.querySelector('img');
      if (img) {
        img.style.transform = `scale(${scale})`;
        img.style.opacity = distance > 1 ? '0' : '1';
      }
    });
  };

  const slide = (smooth = true) => {
    const gap = getGap();
    const slideWidth = allSlides[0].getBoundingClientRect().width;
    const move = (slideWidth + gap) * index;
    
    if (smooth) {
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      isTransitioning = true;
    } else {
      track.style.transition = 'none';
      isTransitioning = false;
    }
    
    track.style.transform = `translateX(-${move}px)`;
    updateScales();
  };

  const handleWrap = () => {
    track.addEventListener('transitionend', function wrapHandler() {
      track.removeEventListener('transitionend', wrapHandler);
      
      let shouldWrap = false;
      let newIndex = index;
      
      // Check if we need to wrap
      if (index >= visibleCount + origSlides.length) {
        shouldWrap = true;
        newIndex = visibleCount;
      } else if (index < visibleCount) {
        shouldWrap = true;
        newIndex = visibleCount + origSlides.length - 1;
      }
      
      if (shouldWrap) {
        // Use requestAnimationFrame to ensure the change happens during the next paint
        requestAnimationFrame(() => {
          index = newIndex;
          const gap = getGap();
          const slideWidth = allSlides[0].getBoundingClientRect().width;
          const move = (slideWidth + gap) * index;
          
          track.style.transition = 'none';
          track.style.transform = `translateX(-${move}px)`;
          
          // Force reflow to ensure the change is applied
          void track.offsetWidth;
          
          // Re-enable transition for next action
          track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          updateScales();
          isTransitioning = false;
        });
      } else {
        isTransitioning = false;
      }
    }, { once: true });
  };

  window.addEventListener('resize', () => slide(false));

  prevBtn.addEventListener('click', () => {
    if (!isTransitioning) {
      index--;
      slide();
      handleWrap();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!isTransitioning) {
      index++;
      slide();
      handleWrap();
    }
  });

  // initialise
  slide(false);
});
