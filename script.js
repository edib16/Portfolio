// Affichage dynamique de la date et l'heure dans la sidebar
function updateDateTime() {
  const dateDiv = document.querySelector('.current-date');
  const timeDiv = document.querySelector('.current-time');
  if (!dateDiv || !timeDiv) return;
  const now = new Date();
  // Date en français complet
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  // Heure 24h avec secondes
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  dateDiv.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  timeDiv.textContent = timeStr;
}
document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

// Animation d'apparition des sections au scroll (fade/slide)
document.addEventListener('DOMContentLoaded', () => {
  const animatedSections = document.querySelectorAll('section, #image-container');
  animatedSections.forEach(section => {
    section.classList.add('section-animate');
  });

  function revealSectionsOnScroll() {
    const triggerBottom = window.innerHeight * 0.92;
    animatedSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        section.classList.add('visible');
      } else {
        section.classList.remove('visible');
      }
    });
  }

  window.addEventListener('scroll', revealSectionsOnScroll);
  window.addEventListener('resize', revealSectionsOnScroll);
  revealSectionsOnScroll();
});