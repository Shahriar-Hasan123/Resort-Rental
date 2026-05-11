// ─── About Section: Show More / Show Less ─────────────────────────────────────
const aboutToggle = document.getElementById('about-toggle');
const aboutText   = document.getElementById('about-text');

if (aboutToggle && aboutText) {

  aboutToggle.addEventListener('click', (e) => {
    e.preventDefault();

    aboutText.classList.toggle('expanded');

    aboutToggle.textContent = aboutText.classList.contains('expanded')
      ? 'Show less'
      : 'Show more';

  });

}