const images = document.querySelectorAll('.photo');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

// Ouvrir lightbox
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

// Fermer lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Navigation flèches
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
});

// Fermer en cliquant sur le fond
lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox) lightbox.style.display = 'none';
});
