// ─── Image Gallery Modal ──────────────────────────────────────────────────────
const API_URL = 'http://localhost:3000/api/images';

// ── DOM References ──
const viewAllBtn    = document.querySelector('.view-all-btn');
const modalOverlay  = document.getElementById('modal-overlay');
const modalClose    = document.getElementById('modal-close-btn');
const modalGrid     = document.getElementById('modal-grid');
const sliderTrack   = document.getElementById('slider-track');
const sliderCounter = document.getElementById('slider-counter');
const prevBtn       = document.getElementById('slider-prev');
const nextBtn       = document.getElementById('slider-next');

// ── Slider State ──
let currentIndex = 0;
let totalImages  = 0;
let touchStartX  = 0;
let touchEndX    = 0;

// ── Open Modal ──
viewAllBtn.addEventListener('click', openModal);

async function openModal() {
  // Lock background scroll
  document.body.classList.add('modal-open');
  modalOverlay.classList.add('active');

  // Reset slider position
  currentIndex = 0;
  sliderTrack.style.transform = 'translateX(0)';

  // Show loading state
  modalGrid.innerHTML   = '<p class="modal-loading">Loading images...</p>';
  sliderTrack.innerHTML = '';

  try {
    // Fetch images from backend
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data   = await response.json();
    const images = data.images;

    totalImages = images.length;

    // Build desktop grid
    buildDesktopGrid(images);

    // Build mobile slider
    buildMobileSlider(images);

    // Update counter
    updateCounter();

  } catch (err) {
    modalGrid.innerHTML = `<p class="modal-error">Failed to load images. Please try again.</p>`;
    console.error('Image fetch error:', err);
  }
}

// ── Build Desktop Scrollable Grid ──
function buildDesktopGrid(images) {
  modalGrid.innerHTML = '';

  images.forEach((url, index) => {
    const img     = document.createElement('img');
    img.src       = url;
    img.alt       = `Property image ${index + 1}`;
    img.className = 'grid-image';
    img.loading   = 'lazy';
    modalGrid.appendChild(img);
  });
}

// ── Build Mobile Slider ──
function buildMobileSlider(images) {
  sliderTrack.innerHTML = '';

  images.forEach((url, index) => {
    const slide     = document.createElement('div');
    slide.className = 'slide';

    const img     = document.createElement('img');
    img.src       = url;
    img.alt       = `Property image ${index + 1}`;
    img.loading   = index === 0 ? 'eager' : 'lazy';

    slide.appendChild(img);
    sliderTrack.appendChild(slide);
  });
}

// ── Go To Specific Slide ──
function goToSlide(index) {
  currentIndex = index;

  // Move slider track by percentage
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  updateCounter();
}

// ── Update Image Counter ──
function updateCounter() {
  sliderCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
}

// ── Previous Button ──
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    goToSlide(currentIndex - 1);
  }
});

// ── Next Button ──
nextBtn.addEventListener('click', () => {
  if (currentIndex < totalImages - 1) {
    goToSlide(currentIndex + 1);
  }
});

// ── Touch Swipe Support ──
sliderTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderTrack.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diff = touchStartX - touchEndX;

  // Swipe left → next image
  if (diff > 50 && currentIndex < totalImages - 1) {
    goToSlide(currentIndex + 1);
  }

  // Swipe right → previous image
  if (diff < -50 && currentIndex > 0) {
    goToSlide(currentIndex - 1);
  }
}

// ── Close Modal ──
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Close via X button
modalClose.addEventListener('click', closeModal);

// Close by clicking outside modal box
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close via Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});