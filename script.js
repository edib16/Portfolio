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