// ========================================
// DATE ET HEURE
// ========================================

function updateDateTime() {
  const dateDivs = document.querySelectorAll('.current-date');
  const timeDivs = document.querySelectorAll('.current-time');
  
  if (dateDivs.length === 0 || timeDivs.length === 0) return;
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  });
  
  dateDivs.forEach(div => {
    div.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  });
  
  timeDivs.forEach(div => {
    div.textContent = timeStr;
  });
}

// ========================================
// PARTICULES INTERACTIVES - HERO
// ========================================

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 100;
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.resize();
    this.init();
    
    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
  }
  
  resize() {
    // Utiliser la taille de la section hero parent
    const heroSection = this.canvas.parentElement;
    if (heroSection) {
      this.canvas.width = heroSection.offsetWidth;
      this.canvas.height = heroSection.offsetHeight;
      console.log('Canvas redimensionné:', this.canvas.width, 'x', this.canvas.height);
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      console.log('Canvas redimensionné (fallback):', this.canvas.width, 'x', this.canvas.height);
    }
    
    // Recréer les particules après redimensionnement
    if (this.particles.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const speedX = (Math.random() - 0.5) * 1;  // Augmenté de 0.5 à 1
      const speedY = (Math.random() - 0.5) * 1;  // Augmenté de 0.5 à 1
      
      this.particles.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: size,
        speedX: speedX,
        speedY: speedY,
        density: (Math.random() * 30) + 1
      });
    }
  }
  
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }
  
  handleMouseLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dessiner les connections entre particules
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    // Dessiner et mettre à jour les particules
    this.particles.forEach(particle => {
      // Interaction avec la souris - les particules bougent UNIQUEMENT au contact
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          // Repousser les particules quand la souris est proche
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = this.mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * particle.density;
          const directionY = forceDirectionY * force * particle.density;
          
          particle.x -= directionX;
          particle.y -= directionY;
        } else {
          // Retour progressif à la position de base
          if (Math.abs(particle.x - particle.baseX) > 0.1) {
            particle.x += (particle.baseX - particle.x) * 0.05;
          }
          if (Math.abs(particle.y - particle.baseY) > 0.1) {
            particle.y += (particle.baseY - particle.y) * 0.05;
          }
        }
      } else {
        // Pas de souris : retour à la position de base
        if (Math.abs(particle.x - particle.baseX) > 0.1) {
          particle.x += (particle.baseX - particle.x) * 0.05;
        }
        if (Math.abs(particle.y - particle.baseY) > 0.1) {
          particle.y += (particle.baseY - particle.y) * 0.05;
        }
      }
      
      // Dessiner la particule
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();
    });
  }
  
  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialiser les particules au chargement
let particleSystem;

// Forcer le scroll en haut au chargement
window.addEventListener('load', () => {
  // Scroll immédiat en haut de la page
  window.scrollTo(0, 0);
  
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    console.log('Canvas trouvé:', canvas);
    console.log('Taille du canvas:', canvas.width, 'x', canvas.height);
    particleSystem = new ParticleSystem(canvas);
    console.log('ParticleSystem créé avec', particleSystem.particles.length, 'particules');
    particleSystem.animate();
    console.log('Animation démarrée');
  } else {
    console.error('Canvas non trouvé !');
  }
});

// Aussi au cas où la page se recharge
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Forcer immédiatement au chargement du script
if (document.readyState === 'loading') {
  window.scrollTo(0, 0);
}

// ========================================
// SMOOTH SCROLL AVEC NAVIGATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Smooth scroll pour tous les liens d'ancre
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      e.preventDefault();
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        // Fermer le menu mobile si ouvert
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMenu'));
        if (offcanvas) {
          offcanvas.hide();
        }
        
        // Scroll fluide vers la section
        const offsetTop = target.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Mettre à jour le lien actif
        updateActiveNavLink(targetId);
      }
    });
  });
});

// ========================================
// COMPÉTENCES - ANIMATION D'APPARITION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const competencesSection = document.getElementById('competences');
  if (!competencesSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        competencesSection.classList.add('is-visible');
      }
    });
  }, { threshold: 0.25 });

  observer.observe(competencesSection);
});

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================

function updateActiveNavLink(activeId = null) {
  const navLinks = document.querySelectorAll('.nav-link-custom, .sidebar a, .offcanvas-body a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    if (activeId) {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    }
  });
}

// Détection automatique de la section visible
let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      detectVisibleSection();
      ticking = false;
    });
    ticking = true;
  }
}

function detectVisibleSection() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  
  let currentSection = null;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  if (currentSection) {
    updateActiveNavLink(currentSection);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ========================================
// INTERSECTION OBSERVER - ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observer toutes les sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Observer les cartes pour les animer
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in', 'visible');
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.add('fade-in');
    cardObserver.observe(card);
  });
});

// ========================================
// PROGRESS BARS ANIMATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.style.width;
        
        // Reset à 0
        progressBar.style.width = '0';
        
        // Animer vers la valeur cible
        setTimeout(() => {
          progressBar.style.width = targetWidth;
        }, 200);
        
        progressObserver.unobserve(progressBar);
      }
    });
  }, { threshold: 0.5 });
  
  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });
});

// ========================================
// FORMULAIRE DE CONTACT - VALIDATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('form[action*="formspree"]');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      
      let isValid = true;
      
      // Validation du nom
      if (name && name.value.trim() === '') {
        showFieldError(name, 'Veuillez entrer votre nom');
        isValid = false;
      } else if (name) {
        clearFieldError(name);
      }
      
      // Validation de l'email
      if (email && !isValidEmail(email.value)) {
        showFieldError(email, 'Veuillez entrer une adresse email valide');
        isValid = false;
      } else if (email) {
        clearFieldError(email);
      }
      
      // Validation du message
      if (message && message.value.trim().length < 10) {
        showFieldError(message, 'Votre message doit contenir au moins 10 caractères');
        isValid = false;
      } else if (message) {
        clearFieldError(message);
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
    
    // Validation en temps réel
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && this.value.trim() === '') {
          showFieldError(this, 'Ce champ est obligatoire');
        } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
          showFieldError(this, 'Adresse email invalide');
        } else {
          clearFieldError(this);
        }
      });
      
      input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          clearFieldError(this);
        }
      });
    });
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFieldError(field, message) {
  clearFieldError(field);
  
  field.classList.add('is-invalid');
  field.style.borderColor = '#dc3545';
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback d-block';
  errorDiv.textContent = message;
  errorDiv.style.color = '#dc3545';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '0.25rem';
  
  field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.style.borderColor = '';
  
  const errorDiv = field.parentNode.querySelector('.invalid-feedback');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// ========================================
// NAVIGATION CLAVIER (Accessibilité)
// ========================================

document.addEventListener('keydown', (e) => {
  // Page Down / Espace = Section suivante
  if (e.key === 'PageDown' || (e.key === ' ' && e.target === document.body)) {
    e.preventDefault();
    scrollToNextSection();
  }
  
  // Page Up = Section précédente
  if (e.key === 'PageUp') {
    e.preventDefault();
    scrollToPreviousSection();
  }
  
  // Home = Retour en haut
  if (e.key === 'Home' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // End = Aller en bas
  if (e.key === 'End' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

function scrollToNextSection() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const currentScroll = window.scrollY + 100;
  
  const nextSection = sections.find(section => section.offsetTop > currentScroll);
  
  if (nextSection) {
    window.scrollTo({
      top: nextSection.offsetTop,
      behavior: 'smooth'
    });
  }
}

function scrollToPreviousSection() {
  const sections = Array.from(document.querySelectorAll('section[id]')).reverse();
  const currentScroll = window.scrollY - 100;
  
  const prevSection = sections.find(section => section.offsetTop < currentScroll);
  
  if (prevSection) {
    window.scrollTo({
      top: prevSection.offsetTop,
      behavior: 'smooth'
    });
  }
}

// ========================================
// PRELOAD IMAGES
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[src]');
  
  images.forEach(img => {
    if (!img.complete) {
      img.classList.add('loading');
      
      img.addEventListener('load', () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
      });
    }
  });
});

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c👋 Portfolio Edib Saoud', 'font-size: 20px; font-weight: bold; color: #007bff;');
console.log('%c✨ Transitions fluides activées', 'font-size: 14px; color: #6c757d;');
console.log('%c🎓 BTS SIO - Option SISR', 'font-size: 12px; color: #6c757d;');

// ========================================
// MODAL RÉALISATIONS PROFESSIONNELLES
// ========================================

// Données des RPs (structure à remplir)
const rpData = {
  // ========== 1ÈRE ANNÉE ==========
  'rp5': {
    badge: 'Système',
    badgeClass: 'rp-badge-infra',
    title: 'RP01 - Borne interactive NutriFit (Mode Kiosk)',
    period: '11/2024 - 12/2024',
    context: 'IRIS Mediaschool - Projet Inter-spécialités',
    useStructuredTemplate: true,
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Projet inter-spécialités BTS SIO mené entre les pôles <strong>SISR</strong> et <strong>SLAM</strong> pour déployer une borne NutriFit utilisable en libre-service.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>Le besoin était de fournir une borne dédiée, stable et sécurisée, qui lance automatiquement l'application au démarrage sans accès au système pour l'utilisateur final.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment concevoir un poste Linux en mode kiosk fiable, sécurisé et simple d'usage dans un environnement public ?</p>
    `,
    analyse: `
      <p>J'ai analysé les contraintes principales : matériel limité, nécessité d'une session verrouillée et exigence de continuité de service pendant les démonstrations.</p>
      <p>Les risques identifiés étaient le contournement du mode kiosk, les crashs navigateur et l'indisponibilité de la borne en cas d'incident.</p>
    `,
    solution: `
      <p>La solution retenue combine :</p>
      <ul class="rp-objectifs-list">
        <li>un système <strong>Xubuntu</strong> optimisé pour une borne interactive,</li>
        <li>un mode <strong>Chromium Kiosk</strong> verrouillé avec autostart,</li>
        <li>des scripts Bash pour la relance automatique et la maintenance.</li>
      </ul>
    `,
    realisation: `
      <p><strong>Phase 1 - Installation :</strong> déploiement Xubuntu, mise à jour système et configuration d'une session dédiée.</p>
      <p><strong>Phase 2 - Sécurisation :</strong> blocage des raccourcis, restrictions d'accès système et autostart de Chromium en plein écran.</p>
      <p><strong>Phase 3 - Stabilisation :</strong> mise en place d'un watchdog de relance et validation sur plusieurs cycles de redémarrage.</p>
    `,
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Période</span><strong>11/2024 - 12/2024</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode</span><strong>Agile (itérative)</strong></div>
        <div class="rp-pm-meta-item"><span>Rôle</span><strong>Technicien SISR</strong></div>
        <div class="rp-pm-meta-item"><span>Durée</span><strong>7 semaines</strong></div>
      </div>
      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Présentation de l'équipe et rôles</h4>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>SISR (moi)</strong> : système, sécurité, scripts et exploitation.</li>
            <li><strong>SLAM</strong> : application métier et tests fonctionnels.</li>
            <li><strong>Encadrement</strong> : validation des jalons et de la qualité finale.</li>
          </ul>
        </div>
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Parties prenantes</h4>
          <ul class="rp-objectifs-list mb-0">
            <li>Référent pédagogique</li>
            <li>Équipe projet SISR/SLAM</li>
            <li>Utilisateurs de test</li>
          </ul>
        </div>
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Planification et suivi de projet</h4>
          <p class="mb-1">Pilotage en phases : cadrage, installation, hardening, intégration, recette.</p>
          <p class="mb-0">Suivi Kanban (To Do / Doing / Testing / Done) pour prioriser les tâches critiques.</p>
        </div>
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Gestion des risques</h4>
          <div class="table-responsive">
            <table class="table table-sm table-bordered bg-white">
              <thead class="table-light"><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Sortie du mode kiosk</td><td>Élevé</td><td>Restrictions session + verrouillage raccourcis</td></tr>
                <tr><td>Crash navigateur</td><td>Moyen</td><td>Watchdog et relance automatique</td></tr>
                <tr><td>Panne poste</td><td>Élevé</td><td>Image système et procédure de restauration</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 7;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage & Analyse</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 1; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Installation & Hardening</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 2; --length: 2;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Intégration applicative</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-cyan" style="--start: 4; --length: 2;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Tests & Recette</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 6; --length: 2;"></span></div>
          </div>
          <div class="rp-gantt-chronology">
            <span><strong>S1</strong><small>Nov</small></span>
            <span><strong>S2</strong><small>Nov</small></span>
            <span><strong>S3</strong><small>Nov</small></span>
            <span><strong>S4</strong><small>Nov</small></span>
            <span><strong>S5</strong><small>Déc</small></span>
            <span><strong>S6</strong><small>Déc</small></span>
            <span><strong>S7</strong><small>Déc</small></span>
          </div>
        </div>
      </div>
    `,
    testsValidation: `
      <p><strong>Tests fonctionnels :</strong> lancement auto de l'application, navigation fluide et persistance après redémarrage.</p>
      <p><strong>Tests sécurité :</strong> vérification de l'impossibilité d'accéder au bureau et aux paramètres système.</p>
      <p><strong>Tests robustesse :</strong> simulation de crash Chromium et contrôle de la relance automatique.</p>
      <p><strong>Résultat :</strong> borne stable, sécurisée et prête pour une utilisation en libre-service.</p>
    `,
    objectifs: [
      "Déployer un OS Linux optimisé (Xubuntu) pour matériel à ressources limitées",
      "Configurer le mode Kiosk inviolable (Autostart Chromium restricted)",
      "Mettre en œuvre une gestion de projet agile (Méthode Kanban)",
      "Assurer la traçabilité des besoins entre le CDC et la livraison"
    ],
    technologies: [
      "Linux Xubuntu", "Bash Scripting", "Hardening", "Trello (Agile)", "GitHub"
    ],
    methodologieTitle: 'Gestion de projet et organisation',
    methodologie: `
      <div class="rp-pm-box" style="background:linear-gradient(180deg,#f8fbff 0%,#f8fafc 100%);padding:20px;border-radius:12px;border:1px solid #dbe7ff;border-left:4px solid #3b82f6;">
        <h4 class="mt-0 mb-3">Gestion de projet</h4>
        <p class="mb-0" style="background:#eef4ff;border:1px solid #d6e5ff;padding:10px 12px;border-radius:8px;">
          Le projet a été piloté en mode collaboratif entre les pôles SISR et SLAM, avec une organisation structurée autour de jalons intermédiaires, d'une planification définie en amont et d'un suivi continu via un outil Kanban.
          Cette organisation a permis d'assurer la coordination des tâches, le respect des délais et la validation progressive des livrables.
        </p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #3b82f6;">
        <h5 class="mb-2">Cartographie des parties prenantes</h5>
        <div style="border:1px solid #dbe3ef;border-radius:10px;overflow:hidden;">
          <table class="table table-sm table-bordered mb-0 small bg-white align-middle">
            <thead style="background:#eaf2ff;">
              <tr><th>Acteur</th><th>Rôle</th><th>Attentes</th><th>Implication</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>MOA (enseignant)</strong></td><td>Expression du besoin / validation</td><td>Solution fonctionnelle et sécurisée</td><td><span class="badge bg-primary-subtle text-primary-emphasis">Élevée</span></td></tr>
              <tr><td><strong>Utilisateurs finaux</strong></td><td>Utilisation de la borne</td><td>Simplicité et rapidité</td><td><span class="badge bg-secondary-subtle text-secondary-emphasis">Moyenne</span></td></tr>
              <tr><td><strong>Équipe SLAM</strong></td><td>Développement application</td><td>Fonctionnalités opérationnelles</td><td><span class="badge bg-primary-subtle text-primary-emphasis">Élevée</span></td></tr>
              <tr><td><strong>Edib Saoud (SISR)</strong></td><td>Infrastructure & sécurité</td><td>Système stable et sécurisé</td><td><span class="badge bg-primary-subtle text-primary-emphasis">Élevée</span></td></tr>
            </tbody>
          </table>
        </div>
        <p class="small text-muted mt-2 mb-0"><strong>Emplacement visuel :</strong> schéma des parties prenantes (diagramme).</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #10b981;">
        <h5 class="mb-2">Rôles et responsabilités (RACI simplifié)</h5>
        <div style="border:1px solid #dbe3ef;border-radius:10px;overflow:hidden;">
          <table class="table table-sm table-bordered mb-0 small bg-white align-middle">
            <thead style="background:#eafbf4;">
              <tr><th>Tâche</th><th>Responsable</th><th>Contributeur</th><th>Validateur</th></tr>
            </thead>
            <tbody>
              <tr><td>Analyse du besoin</td><td>MOA</td><td>Équipe projet</td><td>MOA</td></tr>
              <tr><td>Développement application</td><td>SLAM</td><td>-</td><td>MOA</td></tr>
              <tr><td>Installation système</td><td>SISR</td><td>-</td><td>MOE</td></tr>
              <tr><td>Sécurisation (hardening)</td><td>SISR</td><td>-</td><td>MOE</td></tr>
              <tr><td>Tests et validation</td><td>SISR + SLAM</td><td>-</td><td>MOA</td></tr>
            </tbody>
          </table>
        </div>
        <p class="small text-muted mt-2 mb-0"><strong>Emplacement visuel :</strong> diagramme RACI.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #6366f1;">
        <h5 class="mb-2">Organisation de l'équipe</h5>
        <ul class="mb-2">
          <li><strong>SISR :</strong> infrastructure, sécurité, scripts</li>
          <li><strong>SLAM :</strong> développement de l'application</li>
        </ul>
        <p class="mb-1">Coordination par points hebdomadaires, Trello (Kanban) et suivi continu des tâches.</p>
        <p class="mb-0">Cette organisation a permis une séparation claire des responsabilités tout en assurant une collaboration efficace entre les deux pôles.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #0ea5e9;">
        <h5 class="mb-2">Méthodologie de gestion de projet</h5>
        <p class="mb-0">Approche Agile inspirée de Kanban, combinant planification globale (phases et jalons) et exécution itérative.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #8b5cf6;">
        <h5 class="mb-2">Planification et contraintes temporelles</h5>
        <p class="mb-1"><strong>Période :</strong> début novembre 2024 -> fin décembre 2024 (échéance semaine 7).</p>
        <p class="mb-1">Chaque jalon faisait l'objet d'une validation par la MOA simulée, permettant de vérifier la conformité aux besoins exprimés.</p>
        <ul class="mb-2">
          <li>S1 : Analyse du besoin</li>
          <li>S2-S3 : Installation et hardening</li>
          <li>S4-S5 : Intégration</li>
          <li>S6 : Tests</li>
          <li>S7 : Recette et livraison</li>
        </ul>
        <div style="border:1px solid #dbe3ef;border-radius:10px;overflow:hidden;">
          <table class="table table-sm table-bordered mb-0 small bg-white align-middle">
            <thead style="background:#eef2ff;">
              <tr><th>Jalon</th><th>Échéance</th><th>Statut</th></tr>
            </thead>
            <tbody>
              <tr><td>Besoin validé</td><td>Fin S1</td><td><span class="badge bg-success-subtle text-success-emphasis">Atteint</span></td></tr>
              <tr><td>Système sécurisé</td><td>Fin S3</td><td><span class="badge bg-success-subtle text-success-emphasis">Atteint</span></td></tr>
              <tr><td>Application fonctionnelle</td><td>Fin S5</td><td><span class="badge bg-success-subtle text-success-emphasis">Atteint</span></td></tr>
              <tr><td>Tests validés</td><td>S6</td><td><span class="badge bg-success-subtle text-success-emphasis">Atteint</span></td></tr>
              <tr><td>Livraison finale</td><td>S7</td><td><span class="badge bg-success-subtle text-success-emphasis">Atteint</span></td></tr>
            </tbody>
          </table>
        </div>
        <p class="small text-muted mt-2 mb-2"><strong>Emplacement visuel :</strong> capture du diagramme de Gantt.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #f59e0b;">
        <h5 class="mb-2">Contraintes du projet</h5>
        <ul class="mb-0">
          <li>Budget matériel limité (&lt; 200 EUR)</li>
          <li>Matériel à faibles ressources (mini-PC)</li>
          <li>Environnement public (borne en libre accès)</li>
          <li>Utilisateurs non techniques</li>
          <li>Exigences fortes de sécurité</li>
          <li>Délai contraint (8 semaines)</li>
        </ul>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #ef4444;">
        <h5 class="mb-2">Analyse et gestion des risques</h5>
        <p class="mb-2">Les risques ont été évalués selon leur probabilité et leur impact afin de prioriser les actions correctives.</p>
        <div style="border:1px solid #dbe3ef;border-radius:10px;overflow:hidden;">
          <table class="table table-sm table-bordered mb-0 small bg-white align-middle">
            <thead style="background:#fff5f5;">
              <tr><th>Risque</th><th>Probabilité</th><th>Impact</th><th>Solution</th></tr>
            </thead>
            <tbody>
              <tr><td>Accès système utilisateur</td><td><span class="badge bg-danger-subtle text-danger-emphasis">Élevée</span></td><td><span class="badge bg-danger-subtle text-danger-emphasis">Critique</span></td><td>Hardening XFCE</td></tr>
              <tr><td>Crash application</td><td><span class="badge bg-warning-subtle text-warning-emphasis">Moyenne</span></td><td><span class="badge bg-warning-subtle text-warning-emphasis">Moyen</span></td><td>Watchdog Bash</td></tr>
              <tr><td>Coupure brutale</td><td><span class="badge bg-secondary-subtle text-secondary-emphasis">Faible</span></td><td><span class="badge bg-warning-subtle text-warning-emphasis">Moyen</span></td><td>Vérification au boot</td></tr>
              <tr><td>Mauvaise utilisation</td><td><span class="badge bg-warning-subtle text-warning-emphasis">Moyenne</span></td><td><span class="badge bg-secondary-subtle text-secondary-emphasis">Faible</span></td><td>Interface simplifiée</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #14b8a6;">
        <h5 class="mb-2">Cahier des charges</h5>
        <p class="mb-1">Le CDC formalise les besoins fonctionnels (consultation nutrition), les contraintes techniques (Linux + kiosk), budgétaires et les exigences de sécurité.</p>
        <p class="mb-1">Le cahier des charges précisait notamment l'obligation d'un environnement inviolable empêchant toute sortie du mode kiosk.</p>
        <p class="small text-muted mb-0"><strong>Emplacement visuel :</strong> extrait ou capture du cahier des charges.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #0ea5e9;">
        <h5 class="mb-2">Collecte et traçabilité des besoins</h5>
        <p class="mb-1">Besoins collectés par échanges avec la MOA simulée puis transformés en tâches Trello.</p>
        <p class="mb-1">Traçabilité assurée par backlog structuré et suivi des tickets.</p>
        <p class="small text-muted mb-0"><strong>Emplacement visuel :</strong> capture du backlog Trello.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #06b6d4;">
        <h5 class="mb-2">Ressources mobilisées</h5>
        <div style="border:1px solid #dbe3ef;border-radius:10px;overflow:hidden;">
          <table class="table table-sm table-bordered mb-0 small bg-white align-middle">
            <thead style="background:#f0f9ff;">
              <tr><th>Type</th><th>Ressources</th></tr>
            </thead>
            <tbody>
              <tr><td>Humaines</td><td>1 étudiant SISR, 1 étudiant SLAM</td></tr>
              <tr><td>Matérielles</td><td>Mini-PC, écran tactile, support borne</td></tr>
              <tr><td>Logicielles</td><td>Linux Xubuntu, Bash, Chromium (kiosk), Trello, GitHub</td></tr>
              <tr><td>Temps</td><td>7 semaines (environ 6 à 8 heures par semaine)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #7c3aed;">
        <h5 class="mb-2">Tests et validation</h5>
        <p class="mb-1">Une phase de tests a été réalisée incluant :</p>
        <ul class="mb-0">
          <li>des tests fonctionnels (accès à l'application),</li>
          <li>des tests de sécurité (résistance aux manipulations utilisateur),</li>
          <li>des tests de robustesse (redémarrage, crash application).</li>
        </ul>
        <p class="mt-2 mb-0">Ces tests ont permis de valider la robustesse et la sécurité de la solution avant sa mise en production.</p>
      </div>

      <div class="rp-pm-box mt-3" style="background:#ffffff;padding:16px;border-radius:12px;border:1px solid #dbe3ef;border-top:3px solid #22c55e;">
        <h5 class="mb-2">Suivi du projet - Kanban</h5>
        <p class="mb-1">Colonnes utilisées : <strong>To Do / Doing / Testing / Done</strong>.</p>
        <p class="mb-1">Ce suivi a permis une meilleure organisation, un pilotage en temps réel et une priorisation efficace.</p>
        <p class="mb-1">Les tâches étaient priorisées en fonction de leur criticité (sécurité, fonctionnement) afin de garantir la livraison d'un produit stable dans les délais.</p>
        <p class="small text-muted mb-0"><strong>Emplacement visuel :</strong> capture du tableau Kanban.</p>
      </div>
    `,
    competences: [
      { num: "1.1", text: "Gérer le patrimoine informatique : Installation et sécurisation d'un système Linux kiosk." },
      { num: "1.4", text: "Travailler en mode projet : Coordination inter-spécialités SISR/SLAM." },
      { num: "1.5", text: "Mettre à disposition un service informatique : Livraison d'une borne stable et exploitable." }
    ],
    resultats: `
      <p><strong>Résultat :</strong> une borne fonctionnelle, sécurisée et stable a été livrée dans les délais, répondant aux exigences du cahier des charges, notamment en termes de sécurité et d'accessibilité.</p>
      <p><strong>Bilan :</strong> ce projet m'a permis de comprendre que la réussite d'une infrastructure ne repose pas uniquement sur les aspects techniques, mais également sur une organisation rigoureuse, une gestion des risques anticipée et une coordination efficace entre les différents acteurs du projet.</p>
      <p>Ce projet a également mis en évidence l'importance de la sécurisation des environnements accessibles au public.</p>
      <h5 class="mt-3 mb-2">Difficultés rencontrées</h5>
      <ul class="mb-0">
        <li>Sécurisation complète de XFCE (blocage des raccourcis)</li>
        <li>Gestion des crashs Chromium</li>
        <li>Coordination SISR / SLAM</li>
      </ul>
      <p class="mt-2 mb-0">Des solutions techniques (scripts Bash, watchdog, hardening) ont été mises en place pour répondre à ces problématiques.</p>
      <p class="mt-2 mb-0"><strong>Amélioration possible :</strong> l'ajout d'un système de supervision à distance afin de faciliter la maintenance et le suivi de la borne.</p>
    `,
    projectInfo: {
      duration: '7 semaines',
      team: 'Binôme inter-spécialités (SISR/SLAM)',
      context: 'Formation BTS SIO',
      status: 'Terminé',
      technologies: ['Xubuntu', 'Chromium Kiosk', 'Bash', 'Hardening Linux'],
      links: [
        { label: 'Documentation GitHub', href: 'https://github.com/edib16/RP01-Borne-interactive-NutriFit' }
      ]
    },
    images: [
      { src: "images/Nutrifit.png", caption: "Aperçu NutriFit côté client" }
    ]
  },
  'rp6': {
    badge: 'Réseau',
    badgeClass: 'rp-badge-network',
    title: 'RP02 - Infrastructure serveur Classcord',
    period: '06/2025',
    context: 'Projet inter-spécialités / IRIS Mediaschool',
    useStructuredTemplate: true,
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Projet réalisé en BTS SIO dans un contexte de collaboration <strong>SISR / SLAM</strong> pour mettre en service une messagerie interne type Classcord sur le réseau pédagogique.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>L'équipe de développement avait besoin d'une infrastructure stable pour héberger l'application et sa base de données, avec accès contrôlé depuis les postes du campus.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment fournir un serveur fiable, sécurisé et maintenable permettant aux développeurs de livrer l'application, tout en respectant les contraintes réseau de l'école ?</p>
    `,
    analyse: `
      <p>J'ai identifié les prérequis techniques : adressage IP fixe, règles de filtrage minimales, disponibilité du service applicatif et supervision de base.</p>
      <p>L'analyse des risques a aussi mis en évidence les points critiques : indisponibilité serveur, mauvaise exposition réseau, et incohérences entre besoins SLAM et contraintes d'infrastructure.</p>
    `,
    solution: `
      <p>La solution retenue combine :</p>
      <ul class="rp-objectifs-list">
        <li>un serveur <strong>Debian</strong> dédié à l'hébergement applicatif,</li>
        <li>un durcissement réseau via <strong>UFW</strong> et segmentation contrôlée des flux,</li>
        <li>une supervision légère pour le suivi de charge et la stabilité en phase de tests.</li>
      </ul>
    `,
    realisation: `
      <p><strong>Phase 1 - Préparation système :</strong> installation du serveur Debian, configuration IP statique, mise à jour, sécurisation SSH et création des comptes d'administration.</p>
      <p><strong>Phase 2 - Mise en service :</strong> ouverture des ports strictement nécessaires, déploiement des composants backend attendus par l'équipe SLAM et validation de la connectivité LAN.</p>
      <p><strong>Phase 3 - Stabilisation :</strong> supervision des ressources, ajustements de configuration réseau, documentation d'exploitation pour la continuité de service.</p>
    `,
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Période</span><strong>04/2025</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode</span><strong>Agile (itérative)</strong></div>
        <div class="rp-pm-meta-item"><span>Rôle</span><strong>Administrateur SISR</strong></div>
        <div class="rp-pm-meta-item"><span>Durée</span><strong>5 jours</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Présentation de l'équipe et rôles</h4>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>SISR (moi)</strong> : conception infra, sécurité réseau, déploiement serveur.</li>
            <li><strong>SLAM</strong> : développement applicatif, intégration fonctionnelle, tests côté client.</li>
            <li><strong>Encadrement</strong> : validation des choix techniques et suivi pédagogique.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Parties prenantes</h4>
          <ul class="rp-objectifs-list mb-0">
            <li>Équipe projet SISR/SLAM</li>
            <li>Référent pédagogique</li>
            <li>Utilisateurs test (étudiants)</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Planification et suivi de projet</h4>
          <p class="mb-1">Découpage en phases journalières : cadrage, déploiement, intégration, validation.</p>
          <p class="mb-0">Suivi opérationnel avec logique Kanban (<em>To Do / Doing / Testing / Done</em>) et points d'avancement réguliers.</p>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Gestion des risques</h4>
          <div class="table-responsive">
            <table class="table table-sm table-bordered bg-white">
              <thead class="table-light"><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Indisponibilité serveur</td><td>Élevé</td><td>Procédure de redémarrage + supervision active</td></tr>
                <tr><td>Ouverture excessive des ports</td><td>Élevé</td><td>Politique pare-feu minimale et revue de règles</td></tr>
                <tr><td>Conflit infra/applicatif</td><td>Moyen</td><td>Validation conjointe SISR/SLAM avant recette</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 5;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage & Préparation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 1; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Déploiement Serveur</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 2; --length: 2;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Intégration applicative</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-cyan" style="--start: 4; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Tests & Validation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 5; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-chronology">
            <span><strong>J1</strong><small>16/06</small></span>
            <span><strong>J2</strong><small>17/06</small></span>
            <span><strong>J3</strong><small>18/06</small></span>
            <span><strong>J4</strong><small>19/06</small></span>
            <span><strong>J5</strong><small>20/06</small></span>
          </div>
        </div>
      </div>
    `,
    testsValidation: `
      <p><strong>Tests fonctionnels :</strong> disponibilité du service, connectivité des clients au serveur, accès applicatif stable sur le LAN.</p>
      <p><strong>Tests sécurité :</strong> vérification des ports ouverts, tentative d'accès non autorisé, contrôle des journaux.</p>
      <p><strong>Tests de charge légère :</strong> observation CPU/RAM/disque pendant utilisation simultanée de plusieurs clients.</p>
      <p><strong>Résultat :</strong> infrastructure opérationnelle, stable et exploitable par l'équipe de développement jusqu'à la recette finale.</p>
    `,
    objectifs: [
      'Déployer un serveur Debian dédié au projet Classcord',
      'Sécuriser l\'exposition réseau avec un pare-feu minimal',
      'Garantir l\'accessibilité des composants backend pour l\'équipe SLAM',
      'Assurer un suivi technique pendant les phases de tests',
      'Documenter l\'exploitation et les procédures de maintenance'
    ],
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Administration système Linux et configuration réseau.' },
      { num: '1.4', text: 'Travailler en mode projet : Coordination inter-spécialités SISR/SLAM.' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Infrastructure serveur sécurisée et disponible.' }
    ],
    technologies: ['Debian Linux', 'UFW', 'Réseau TCP/IP', 'Supervision système', 'CLI Linux'],
    resultats: `
      <p>L'infrastructure mise en place a permis un déploiement applicatif fluide avec une connectivité stable pour les développeurs et les utilisateurs de test.</p>
      <p>Le serveur est resté disponible sur toute la phase projet avec des règles réseau maîtrisées et une documentation d'exploitation exploitable.</p>
    `,
    projectInfo: {
      duration: '5 jours',
      team: 'Binôme inter-spécialités (SISR/SLAM)',
      context: 'Formation BTS SIO',
      status: 'Terminé',
      technologies: ['Debian Linux', 'UFW', 'TCP/IP', 'Supervision', 'CLI Linux'],
      links: [
        { label: 'Documentation GitHub', href: 'https://github.com/edib16/RP02-Infrastructure-serveur-Classcord' }
      ]
    },
    images: [
      { src: "images/classcordclient.png", caption: "Interface client Classcord en phase de test" }
    ]
  },
  'rp7': {
    badge: '1ère Année',
    badgeClass: 'rp-badge-system',
    title: 'RP03 - Annuaire d\'entreprise (Active Directory)',
    period: '01/2025',
    context: 'IRIS Mediaschool',
    useStructuredTemplate: true,
    
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Projet réalisé en première année BTS SIO option SISR au sein de l'infrastructure de l'école, mettant en place une solution d'authentification centralisée utilisant les technologies Microsoft.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>L'école disposait de postes client dispersés sans authentification centralisée. Chaque utilisateur gérait ses identifiants localement, ce qui causait une gestion manuelle des droits d'accès et une traçabilité inexistante des connexions réseau.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment mettre en place une authentification centralisée et une gestion cohérente des accès pour les utilisateurs (étudiants, formateurs, administrateurs) du réseau pédagogique ?</p>
    `,
    
    analyse: `
      <p>J'ai analysé l'infrastructure existante et identifié les risques : absence de traçabilité des accès, duplication de comptes sur chaque poste, pas de politiques de sécurité globales, et difficulté à gérer les droits d'accès aux ressources partagées.</p>
      <p>Cette analyse m'a orienté vers une architecture centralisée basée sur <strong>Active Directory Domain Services (AD DS)</strong>, permettant une authentification par utilisateur sur un domaine unique et l'application de politiques de groupe cohérentes.</p>
    `,
    
    solution: `
      <p>La solution retenue combine :</p>
      <ul class="rp-objectifs-list">
        <li><strong>Windows Server 2022</strong> en contrôleur de domaine,</li>
        <li><strong>Active Directory Domain Services (AD DS)</strong> pour l'authentification centralisée,</li>
        <li><strong>Politiques de groupe (GPO)</strong> pour l'application automatisée des règles de sécurité par profil utilisateur.</li>
      </ul>
    `,
    
    realisation: `
      <p><strong>Phase 1 - Installation & Configuration :</strong> Installation de Windows Server 2022, activation des rôles AD DS et DNS intégré.</p>
      <p><strong>Phase 2 - Structure d'annuaire :</strong> création de la hiérarchie organisationnelle avec UO par profil (étudiants, formateurs, administrateurs), création des groupes de sécurité et des comptes utilisateurs.</p>
      <p><strong>Phase 3 - Stratégies de groupe :</strong> mise en place de GPO pour appliquer les politiques de sécurité (mots de passe, restrictions d'accès, mappages réseau) selon le profil.</p>
      <p><strong>Phase 4 - Intégration réseau :</strong> jonction des postes clients Windows au domaine et validation des authentifications AD.</p>
    `,
    
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Début projet</span><strong>05/01/2025</strong></div>
        <div class="rp-pm-meta-item"><span>Fin projet</span><strong>25/01/2025</strong></div>
        <div class="rp-pm-meta-item"><span>Équipe</span><strong>SISR (individuel)</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode de gestion</span><strong>Traditionnelle (Cycle en V)</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Cartographie des parties prenantes</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Partie prenante</th><th>Fonction</th><th>Rôle projet</th></tr></thead>
              <tbody>
                <tr><td>Référent pédagogique</td><td>MOA</td><td>Cadrage, validation, arbitrage</td></tr>
                <tr><td>Administrateur IT école</td><td>MOE</td><td>Contraintes techniques, infrastructure</td></tr>
                <tr><td>Utilisateurs finaux</td><td>Usagers</td><td>Authentification et accès ressources</td></tr>
                <tr><td>Étudiant SISR (moi)</td><td>Réalisateur</td><td>Conception AD, déploiement, recette</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Rôles & responsabilités</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Lot</th><th>Responsable</th><th>Validateur</th></tr></thead>
              <tbody>
                <tr><td>Analyse et conception AD</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
                <tr><td>Configuration infrastructure</td><td>Étudiant SISR</td><td>Administrateur IT</td></tr>
                <tr><td>Tests & validation</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Organisation équipes & missions</h4>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>Pôle technique SISR :</strong> architecture AD, structuration de l'annuaire, design des GPO.</li>
            <li><strong>Encadrement :</strong> validation des choix techniques et conformité au besoin métier.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Contraintes identifiées</h4>
          <ul class="rp-objectifs-list mb-0">
            <li>Standards Microsoft pour la sécurité (principes du moindre privilège).</li>
            <li>Maintien de continuité de service DNS pendant le déploiement.</li>
            <li>Gestion cohérente des droits d'accès entre les profils utilisateurs.</li>
            <li>Compatibilité des clients Windows 10/11 avec le domaine AD.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Gestion des risques</h4>
          <div class="table-responsive">
            <table class="table table-sm table-bordered bg-white">
              <thead class="table-light"><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Erreur GPO bloquante</td><td>Élevé</td><td>Tests sur OU pilote avant généralisation</td></tr>
                <tr><td>Conflit DNS</td><td>Moyen</td><td>Plan d'adressage validé, tests de résolution</td></tr>
                <tr><td>Droits insuffisants/excessifs</td><td>Élevé</td><td>Audit RBAC, principe du moindre privilège</td></tr>
                <tr><td>Perte de service AD</td><td>Critique</td><td>Sauvegarde AD, documentations procédures</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Planification (Grandes phases)</h4>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 3;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage & Analyse</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 1; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Mise en œuvre AD / GPO</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 2; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Tests & Validation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 3; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Recette & Documentation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-amber" style="--start: 3.5; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-chronology">
            <span><strong>S1</strong><small>05-11/01</small></span>
            <span><strong>S2</strong><small>12-18/01</small></span>
            <span><strong>S3</strong><small>19-25/01</small></span>
          </div>
        </div>
      </div>
    `,
    
    testsValidation: `
      <p><strong>Tests fonctionnels :</strong> authentification réussie et échouée via console Windows, jonction de postes au domaine, résolution DNS du contrôleur de domaine.</p>
      <p><strong>Tests de sécurité :</strong> validation des droits d'accès par profil utilisateur, blocage des accès non autorisés, audit des tentatives échouées dans l'event viewer.</p>
      <p><strong>Tests de performance :</strong> latence d'authentification AD, temps de réplication SYSVOL, application des GPO sur les clients.</p>
      <p><strong>Résultat :</strong> tous les tests sont concluants. L'authentification est centralisée, tracée et sécurisée. Les politiques de groupe s'appliquent correctement sur tous les clients joints au domaine.</p>
    `,
    
    objectifs: [
      'Installer Windows Server 2022 et configurer le rôle AD DS',
      'Structurer l\'annuaire avec UO par profil utilisateur (étudiants, formateurs, admin)',
      'Créer les groupes de sécurité et les comptes utilisateurs',
      'Mettre en place des stratégies de groupe (GPO) pour la sécurité',
      'Intégrer et tester les postes clients Windows au domaine'
    ],
    
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Configuration d\'un serveur Microsoft et infrastructure AD.' },
      { num: '1.2', text: 'Répondre aux incidents et demandes d\'assistance : Gestion des comptes et droits utilisateurs.' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Service d\'authentification centralisé et sécurisé.' }
    ],
    
    technologies: ['Windows Server 2022', 'Active Directory Domain Services', 'DNS', 'Politiques de groupe (GPO)', 'Windows 10/11'],
    
    resultats: `
      <p>Centralisation réussie de l'authentification utilisateur. Service AD stable et disponible. Traçabilité complète des connexions via Event Viewer. Gestion simplifiée des droits d'accès via groupes de sécurité.</p>
      <p>Compréhension approfondie de l'administration centralisée Windows, de la sécurité réseau en environnement Microsoft, et des meilleures pratiques RBAC (Role-Based Access Control).</p>
    `,
    
    projectInfo: {
      duration: '3 semaines',
      team: 'Projet individuel (SISR)',
      context: 'Formation BTS SIO',
      status: 'Terminé',
      technologies: ['Windows Server 2022', 'Active Directory', 'DNS', 'GPO', 'Windows 10/11'],
      links: [
        { label: 'Documentation GitHub', href: 'https://github.com/edib16/RP03-Annuaire-Active-Directory' }
      ]
    },
    
    images: [
      { src: "images/Usersws.png", caption: "Gestion des utilisateurs dans l'annuaire AD" },
      { src: "images/WSou1.png", caption: "Première Organisational Unit (SISR)" },
      { src: "images/WSou2.png", caption: "Deuxième Organisational Unit (SLAM)" }
    ]
  },
  'rp8': {
    badge: '1ère Année',
    badgeClass: 'rp-badge-system',
    title: 'RP04 - Services d\'infrastructure Linux (DHCP & Web)',
    period: '02/2025 - 03/2025',
    context: 'École IRIS',
    useStructuredTemplate: true,
    
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Projet réalisé en première année BTS SIO option SISR portant sur le déploiement de services d'infrastructure réseau critiques sous environnement Linux.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>L'école disposait de postes clients dispersés nécessitant une attribution d'adresses IP centralisée et automatisée. Le besoin était également de mettre en place un intranet accessible pour faciliter la communication et le partage d'information au sein du réseau pédagogique.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment automatiser l'adressage IP et mettre en place un service web fiable sur une infrastructure Linux, tout en garantissant la disponibilité et la facilité d'administration ?</p>
    `,
    
    analyse: `
      <p>J'ai identifié les besoin critiques : absence de service DHCP centralisé causant une gestion manuelle des adresses, absence d'intranet accessible limitant la communication, et nécessité d'une solution open-source maintenable à long terme.</p>
      <p>Cette analyse a orienté le choix vers Debian Linux avec Kea DHCP pour l'automatisation et Apache2 pour le service web, permettant une gestion efficace et peu coûteuse.</p>
    `,
    
    solution: `
      <p>La solution retenue combine :</p>
      <ul class="rp-objectifs-list">
        <li><strong>Debian Server</strong> comme système d'exploitation performant et sécurisé,</li>
        <li><strong>Kea DHCP</strong> pour l'attribution automatique d'adresses IP avec gestion des baux,</li>
        <li><strong>Apache2</strong> pour déployer un intranet accessible sur le réseau local.</li>
      </ul>
    `,
    
    realisation: `
      <p><strong>Phase 1 - Installation système :</strong> Déploiement d'une machine virtuelle Debian Server, configuration réseau de base et accès SSH.</p>
      <p><strong>Phase 2 - Configuration DHCP :</strong> Installation de Kea DHCP (service kea-dhcp4-server), définition des plages d'adressage, création de réservations pour les postes critiques.</p>
      <p><strong>Phase 3 - Déploiement Web :</strong> Installation et configuration d'Apache2, création de pages HTML pour l'intranet, test d'accessibilité depuis les clients.</p>
      <p><strong>Phase 4 - Validation :</strong> Tests d'attribution IP, tests d'accès web, configuration de la journalisation pour la traçabilité.</p>
    `,
    
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Début projet</span><strong>12/02/2025</strong></div>
        <div class="rp-pm-meta-item"><span>Fin projet</span><strong>03/03/2025</strong></div>
        <div class="rp-pm-meta-item"><span>Équipe</span><strong>SISR (individuel)</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode de gestion</span><strong>Traditionnelle (Cycle en V)</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Cartographie des parties prenantes</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Partie prenante</th><th>Fonction</th><th>Rôle projet</th></tr></thead>
              <tbody>
                <tr><td>Référent pédagogique</td><td>MOA</td><td>Cadrage, validation, arbitrage</td></tr>
                <tr><td>Technicien SISR</td><td>Réalisateur</td><td>Configuration et implémentation (moi)</td></tr>
                <tr><td>Utilisateurs finaux</td><td>Usagers</td><td>Tests d'accès et retours</td></tr>
                <tr><td>Support IT</td><td>Opérationnel</td><td>Maintenance post-déploiement</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Rôles & responsabilités</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Lot</th><th>Responsable</th><th>Validateur</th></tr></thead>
              <tbody>
                <tr><td>Installation & configuration DHCP</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
                <tr><td>Déploiement Apache2</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
                <tr><td>Tests & validation</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Organisation équipes & missions</h4>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>Pôle technique :</strong> architecture DHCP, configuration Apache, scripting et documentation.</li>
            <li><strong>Encadrement :</strong> validation des configurations et conformité au besoin.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Contraintes identifiées</h4>
          <ul class="rp-objectifs-list mb-0">
            <li>Équipement limité du laboratoire (nombre de VMs et de clients de test).</li>
            <li>Maintien de disponibilité du réseau pédagogique pendant les manipulations.</li>
            <li>Performance acceptable pour accès concurrent multiples.</li>
            <li>Documentation minimale pour la maintenance future.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Gestion des risques</h4>
          <div class="table-responsive">
            <table class="table table-sm table-bordered bg-white">
              <thead class="table-light"><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Conflit DHCP sur le réseau</td><td>Élevé</td><td>Plages réservées et tests en isolation</td></tr>
                <tr><td>Erreur de configuration Apache</td><td>Moyen</td><td>Validation syntaxe et tests par scénarios</td></tr>
                <tr><td>Perte d'accès réseau</td><td>Élevé</td><td>Rollback plan et documentation procédures</td></tr>
                <tr><td>Indisponibilité intranet</td><td>Moyen</td><td>Redondance et monitoring d'activité</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 3;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage & Préparation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 1; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Configuration DHCP</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 2; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Déploiement Apache</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-cyan" style="--start: 3; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Tests & Validation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 3.5; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-chronology">
            <span><strong>S1</strong><small>12-16/02</small></span>
            <span><strong>S2</strong><small>17-23/02</small></span>
            <span><strong>S3</strong><small>24/02-03/03</small></span>
          </div>
        </div>
      </div>
    `,
    
    testsValidation: `
      <p><strong>Tests fonctionnels DHCP :</strong> attribution automatique d'adresses, vérification des baux, test des réservations, renouvellement des baux.</p>
      <p><strong>Tests web :</strong> accessibilité de l'intranet depuis clients variés, test de performance sous charge, validation du contenu HTML.</p>
      <p><strong>Tests d'intégration :</strong> coexistence DHCP/Apache sans conflits, persistance après redémarrage du serveur.</p>
      <p><strong>Résultat :</strong> tous les tests sont concluants. Service DHCP stable et fiable. Intranet accessible et performant. Documentation d'exploitation validée.</p>
    `,
    
    objectifs: [
      'Configurer un service DHCP automatisé sous Debian',
      'Définir les plages d\'adressage et les réservations',
      'Déployer un serveur Web Apache2 opérationnel',
      'Créer un intranet accessible sur le réseau local',
      'Effectuer les tests d\'intégration et de performance'
    ],
    
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Administration Linux et services réseau.' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Automation DHCP et intranet web.' }
    ],
    
    technologies: ['Debian Server', 'Kea DHCP', 'Apache2', 'HTML/CSS', 'CLI Linux'],
    
    resultats: `
      <p>Adressage IP dynamique entièrement fonctionnel et fiable. Intranet accessible et performant. Service stable et maintenable à long terme.</p>
      <p>Consolidation de l'administration système Linux, compréhension profonde des services réseau critiques, et meilleures pratiques de déploiement infrastructure.</p>
    `,
    
    projectInfo: {
      duration: '3 semaines',
      team: 'Projet individuel (SISR)',
      context: 'Formation BTS SIO',
      status: 'Terminé',
      technologies: ['Debian Server', 'Kea DHCP', 'Apache2', 'HTML', 'CSS'],
      links: [
        { label: 'Documentation GitHub', href: 'https://github.com/edib16/RP04-Services-infrastructure-Linux' }
      ]
    },
    
    images: [
      { src: "images/dhcpimg.png", caption: "Aperçu de la configuration DHCP sur Debian" }
    ]
  },

  // ========== 2ÈME ANNÉE ==========
  'rp1': {
    badge: 'Sécurité',
    badgeClass: 'rp-badge-security',
    title: 'RP06 - Sécurisation des accès réseau 802.1X (Standard Microsoft)',
    period: '10/11/2025 - 12/04/2026',
    context: 'IRIS Mediaschool',
    useStructuredTemplate: true,
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Projet réalisé dans le réseau de l'école <strong>IRIS Mediaschool</strong>, sur un environnement Microsoft en BTS SIO SISR.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>Les accès Wi-Fi et filaires reposaient sur des mécanismes trop permissifs (clés partagées, faible traçabilité des connexions). Le besoin était de mettre en place une authentification <strong>individuelle</strong> et centralisée avec le protocole 802.1X adossé à l'Active Directory.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment verrouiller les accès réseau pour qu'un utilisateur non autorisé ne puisse plus se connecter, tout en conservant une administration claire et traçable ?</p>
    `,
    analyse: `
      <p>J'ai analysé les points de faiblesse existants : partage de secrets Wi-Fi, absence d'identification utilisateur sur le réseau filaire, et manque de journalisation exploitable pour l'équipe IT.</p>
      <p>Cette analyse a orienté l'architecture vers un modèle AAA centralisé : équipements Cisco comme clients RADIUS, serveur Windows Server 2022 avec rôle NPS, et contrôles d'accès basés sur les comptes AD.</p>
    `,
    solution: `
      <p>La solution retenue combine :</p>
      <ul class="rp-objectifs-list">
        <li>le protocole <strong>802.1X</strong> pour l'authentification par utilisateur,</li>
        <li>un serveur <strong>NPS (Network Policy Server)</strong> sur Windows Server 2022,</li>
        <li>l'intégration avec <strong>Active Directory</strong> pour appliquer des politiques réseau centralisées.</li>
      </ul>
    `,
    realisation: `
      <p><strong>Infrastructure :</strong> routeur/switch Cisco et borne AP Cisco connectés au serveur d'authentification.</p>
      <p><strong>Service d'authentification :</strong> installation et configuration du rôle NPS sur Windows Server 2022.</p>
      <p><strong>Configuration AAA :</strong> paramétrage du secret partagé Cisco ↔ NPS et activation du contrôle d'accès 802.1X sur les ports du switch.</p>
      <p><strong>Configuration système :</strong> création des stratégies de demande de connexion et des stratégies réseau (dont VLAN dynamique selon les profils).</p>
    `,
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Début projet</span><strong>10/11/2025</strong></div>
        <div class="rp-pm-meta-item"><span>Fin projet</span><strong>12/04/2026</strong></div>
        <div class="rp-pm-meta-item"><span>Équipe</span><strong>SISR (individuel)</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode de gestion</span><strong>Agile (itérative)</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Cartographie des parties prenantes</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Partie prenante</th><th>Fonction</th><th>Rôle projet</th></tr></thead>
              <tbody>
                <tr><td>Référent pédagogique</td><td>MOA</td><td>Cadre, validation, arbitrage</td></tr>
                <tr><td>Administration IT école</td><td>MOE</td><td>Contraintes techniques, conformité réseau</td></tr>
                <tr><td>Utilisateur final</td><td>Usager</td><td>Authentification AD sur accès filaire/Wi-Fi</td></tr>
                <tr><td>Étudiant SISR (moi)</td><td>Réalisateur</td><td>Conception, déploiement NPS/AAA, recette</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Rôles & responsabilités</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Lot</th><th>Responsable</th><th>Validateur</th></tr></thead>
              <tbody>
                <tr><td>Analyse du besoin</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
                <tr><td>Configuration NPS/AAA</td><td>Étudiant SISR</td><td>Administration IT</td></tr>
                <tr><td>Tests & recette</td><td>Étudiant SISR</td><td>Référent pédagogique</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Organisation équipes & missions</h4>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>Pôle SISR :</strong> architecture d'authentification, configuration Cisco, politiques NPS.</li>
            <li><strong>Encadrement :</strong> validation de jalons et conformité au besoin exprimé.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Contraintes identifiées</h4>
          <ul class="rp-objectifs-list mb-0">
            <li>Compatibilité Cisco / NPS / Active Directory.</li>
            <li>Maintien de service pendant la bascule de sécurité.</li>
            <li>Traçabilité complète des accès authentifiés.</li>
          </ul>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Gestion des risques</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Erreur de politique NPS</td><td>Élevé</td><td>Tests en maquette avant déploiement</td></tr>
                <tr><td>Blocage utilisateurs légitimes</td><td>Moyen</td><td>Déploiement progressif + rollback</td></tr>
                <tr><td>Mauvaise traçabilité</td><td>Moyen</td><td>Journalisation NPS et vérifications régulières</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Collecte des besoins & traçabilité</h4>
          <p class="mb-0">Besoins collectés en points de cadrage avec le référent puis traduits en exigences techniques. Chaque exigence est reliée à une preuve de configuration (NPS/Cisco) et à un test de validation.</p>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Ressources mobilisées</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Type</th><th>Détail</th></tr></thead>
              <tbody>
                <tr><td>Humaines</td><td>1 étudiant SISR + encadrement pédagogique</td></tr>
                <tr><td>Matérielles</td><td>Windows Server 2022, Cisco switch/AP, postes clients</td></tr>
                <tr><td>Financières</td><td>Infrastructure pédagogique existante (coût additionnel nul)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 6;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage & Analyse</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 1; --length: 1.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Mise en œuvre NPS / AAA</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 2.5; --length: 2.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Tests & Validation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 5; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Recette & Documentation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-amber" style="--start: 6; --length: 1;"></span></div>
          </div>
        </div>
        <div class="rp-gantt-chronology">
          <span><strong>M1</strong><small>11/2025</small></span>
          <span><strong>M2</strong><small>12/2025</small></span>
          <span><strong>M3</strong><small>01/2026</small></span>
          <span><strong>M4</strong><small>02/2026</small></span>
          <span><strong>M5</strong><small>03/2026</small></span>
          <span><strong>M6</strong><small>04/2026</small></span>
        </div>
        <div class="rp-gantt-footer">
          <span><i class="fa-regular fa-calendar"></i>Début : 10/11/2025</span>
          <span><i class="fa-regular fa-flag-checkered"></i>Fin : 12/04/2026</span>
        </div>
      </div>
    `,
    testsValidation: `
      <p>Des tests d'authentification ont été effectués avec des comptes AD valides et invalides, en Wi-Fi et sur ports filaires, afin de vérifier les stratégies NPS et le comportement des équipements Cisco.</p>
      <p><strong>Résultat :</strong> un utilisateur non authentifié dans l'AD ne peut pas obtenir d'adresse IP. Le port reste bloqué en couche 2 tant que l'authentification n'est pas conforme.</p>
    `,
    objectifs: [
      'Mettre en œuvre 802.1X sur les accès Wi-Fi et filaires',
      'Déployer et configurer NPS sur Windows Server 2022',
      'Centraliser les règles d\'accès sur l\'Active Directory'
    ],
    technologies: [
      'Windows Server 2022', 'NPS', 'Active Directory', 'Cisco Switch/AP', '802.1X / RADIUS'
    ],
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Administration réseau Cisco et service NPS.' },
      { num: '1.4', text: 'Travailler en mode projet : Cadrage, planification et validation technique.' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Contrôle d\'accès 802.1X sécurisé.' }
    ],
    resultats: `
      <p>Le réseau est verrouillé et les accès sont centralisés sur l'AD. Cette RP m'a permis de maîtriser la sécurisation des accès réseau en environnement propriétaire Microsoft.</p>
    `,
    images: [
      { src: "images/Apperc%C3%A7uRP01.png", caption: "NPS - Clients RADIUS enregistrés" },
      { src: "images/Shéma-Réseau-RP01.png", caption: "Schéma réseau global RP06" }
    ],
    projectInfo: {
      duration: '6 mois',
      team: 'Projet individuel (SISR)',
      context: 'Réseau école - IRIS Mediaschool',
      status: 'Terminé',
      technologies: ['Windows Server 2022', 'NPS', 'Active Directory', 'Cisco Switch/AP', '802.1X / RADIUS'],
      links: [
        { label: 'Documentation GitHub', href: 'https://github.com/edib16/RP06-Securisation-reseau-8021X' }
      ]
    }
  },
  'rp2': {
    badge: 'Souveraineté',
    badgeClass: 'rp-badge-infra',
    title: 'RP07 - Migration souveraine Open Source (FreeRADIUS/OpenLDAP)',
    period: '02/03/2026 - 30/04/2026',
    context: 'IRIS Mediaschool - Mediaschool Group',
    useStructuredTemplate: true,
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Suite à une décision stratégique de souveraineté numérique du groupe Mediaschool, j'ai été chargé de remplacer les composants d'authentification propriétaires par une stack libre et maîtrisée.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>L'objectif était de migrer vers <strong>FreeRADIUS + OpenLDAP</strong> sous Debian 12, puis de déployer une supervision autonome sous Docker (Prometheus/Loki/Grafana) pour ne plus dépendre d'éditeurs tiers.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment assurer une transition fiable vers une infrastructure 100% Open Source, sans perte de sécurité ni de visibilité sur l'état du réseau ?</p>
    `,
    analyse: `
      <p>J'ai commencé par inventorier les dépendances au socle propriétaire existant (authentification, annuaire, supervision) puis défini une trajectoire de migration progressive.</p>
      <p>Les risques principaux identifiés étaient la rupture d'authentification, l'incohérence des comptes et une absence de monitoring durant la transition.</p>
    `,
    solution: `
      <p>La solution mise en place repose sur :</p>
      <ul class="rp-objectifs-list">
        <li>un serveur Debian 12 avec <strong>FreeRADIUS + OpenLDAP</strong> pour l'identité et l'authentification,</li>
        <li>la migration des équipements Cisco (switch / borne Wi-Fi) vers le nouveau serveur RADIUS,</li>
        <li>une supervision conteneurisée <strong>Prometheus / Loki / Grafana</strong> avec remontée SNMP et Node Exporter.</li>
      </ul>
    `,
    realisation: `
      <p>J'ai installé Debian 12 sur une VM dédiée, puis déployé FreeRADIUS et OpenLDAP afin de construire un annuaire utilisateurs souverain.</p>
      <p>J'ai ensuite reconfiguré les équipements Cisco pour qu'ils interrogent exclusivement le serveur RADIUS Debian (.100), puis validé les connexions via le nouvel annuaire.</p>
      <p>Pour la supervision, j'ai déployé la stack Docker (Prometheus, Loki, Grafana), activé SNMP sur les équipements Cisco et installé Node Exporter sur Debian pour la remontée des métriques en temps réel.</p>
    `,
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Début projet</span><strong>02/03/2026</strong></div>
        <div class="rp-pm-meta-item"><span>Fin projet</span><strong>30/04/2026</strong></div>
        <div class="rp-pm-meta-item"><span>Équipe</span><strong>SISR (individuel)</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode de gestion</span><strong>Agile (itérative)</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Cartographie des parties prenantes</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Partie prenante</th><th>Fonction</th><th>Rôle projet</th></tr></thead>
              <tbody>
                <tr><td>Direction technique groupe</td><td>MOA</td><td>Orientation souveraineté, validation</td></tr>
                <tr><td>Administration IT campus</td><td>MOE</td><td>Contraintes de production et exploitation</td></tr>
                <tr><td>Étudiant SISR (moi)</td><td>Réalisateur</td><td>Migration RADIUS/LDAP + supervision</td></tr>
                <tr><td>Utilisateurs campus</td><td>Usagers</td><td>Validation des accès et continuité de service</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Rôles & responsabilités</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Lot</th><th>Responsable</th><th>Validateur</th></tr></thead>
              <tbody>
                <tr><td>Migration FreeRADIUS/OpenLDAP</td><td>Étudiant SISR</td><td>Admin IT campus</td></tr>
                <tr><td>Bascule équipements Cisco</td><td>Étudiant SISR</td><td>Admin IT campus</td></tr>
                <tr><td>Supervision Docker</td><td>Étudiant SISR</td><td>Direction technique</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Contraintes & risques</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Rupture d'authentification</td><td>Élevé</td><td>Bascule progressive + tests de non-régression</td></tr>
                <tr><td>Incohérence annuaire</td><td>Moyen</td><td>Validation des comptes et groupes OpenLDAP</td></tr>
                <tr><td>Absence de visibilité monitoring</td><td>Moyen</td><td>Déploiement Prometheus/Grafana avant généralisation</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Collecte des besoins & ressources</h4>
          <p class="mb-2">Les besoins ont été collectés via cadrage avec la direction technique puis traduits en exigences vérifiables (authentification, supervision, autonomie d'exploitation).</p>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>Humaines :</strong> 1 étudiant SISR + encadrement IT.</li>
            <li><strong>Matérielles :</strong> VM Debian, équipements Cisco, poste d'administration.</li>
            <li><strong>Financières :</strong> composants Open Source (coût logiciel nul).</li>
          </ul>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 2;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage & préparation Debian</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 1; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Déploiement FreeRADIUS/OpenLDAP</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 1.5; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Migration Cisco vers RADIUS Debian</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 2; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Supervision Docker & validation</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-amber" style="--start: 2.5; --length: 0.5;"></span></div>
          </div>
        </div>
        <div class="rp-gantt-chronology">
          <span><strong>M1</strong><small>03/2026</small></span>
          <span><strong>M2</strong><small>04/2026</small></span>
        </div>
        <div class="rp-gantt-footer">
          <span><i class="fa-regular fa-calendar"></i>Début : 02/03/2026</span>
          <span><i class="fa-regular fa-flag-checkered"></i>Fin : 30/04/2026</span>
        </div>
      </div>
    `,
    testsValidation: `
      <p>Les tests ont validé la connexion des utilisateurs via OpenLDAP/FreeRADIUS et confirmé la sortie de l'écosystème propriétaire sans perte de contrôle d'accès.</p>
      <p>La supervision Grafana affiche correctement les métriques Cisco (SNMP) et serveur Debian (Node Exporter), permettant un monitoring proactif en continu.</p>
    `,
    objectifs: [
      'Remplacer l\'authentification propriétaire par FreeRADIUS/OpenLDAP',
      'Migrer les équipements Cisco vers le nouveau serveur RADIUS Debian',
      'Déployer une supervision autonome Prometheus/Loki/Grafana'
    ],
    technologies: [
      'Debian 12', 'FreeRADIUS', 'OpenLDAP', 'Docker', 'Prometheus', 'Loki', 'Grafana', 'SNMP', 'Node Exporter'
    ],
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Migration d\'infrastructure vers des solutions libres.' },
      { num: '1.4', text: 'Travailler en mode projet : Planification et conduite de migration progressive.' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Authentification et supervision pérennes.' }
    ],
    resultats: `
      <p>La migration vers une infrastructure libre est validée : authentification opérationnelle, supervision active, et autonomie renforcée de l'établissement.</p>
    `,
    images: [
      { src: "images/Shéma-Réseau-RP02.png", caption: "Schéma réseau global RP07" },
      { src: "images/free-radius.png", caption: "Extrait de la configuration FreeRadius" },
      { src: "images/Dashboard Grafana.png", caption: "Dashboard de supervision Grafana" }
    ],
    projectInfo: {
      duration: '2 mois',
      team: 'Projet individuel (SISR)',
      context: 'Souveraineté numérique - Mediaschool',
      status: 'Terminé',
      technologies: ['Debian 12', 'FreeRADIUS', 'OpenLDAP', 'Docker', 'Prometheus', 'Grafana', 'SNMP'],
      links: [
        { label: 'Documentation GitHub', href: 'https://github.com/edib16/RP07-Migration-Open-Source' }
      ]
    }
  },
  'rp3': {
    badge: 'Support',
    badgeClass: 'rp-badge-support',
    title: 'RP08 - Support technique (Stage ActifAzur)',
    period: '05/01/2026 - 13/02/2026',
    context: 'Stage ActifAzur - Antibes',
    useStructuredTemplate: true,
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Cette RP correspond à mon stage de 2ème année chez <strong>ActifAzur</strong>, spécialisé dans le support et la maintenance informatique.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>Le besoin principal était d'assurer le traitement rapide des incidents matériels et logiciels, tout en garantissant une restitution claire aux clients et une traçabilité des interventions.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment standardiser le diagnostic et la résolution d'incidents hétérogènes, avec un niveau de qualité constant et des délais maîtrisés ?</p>
    `,
    analyse: `
      <p>J'ai analysé les typologies de pannes récurrentes (démarrage, stockage, RAM, OS corrompu, malware) pour structurer une démarche de diagnostic progressive.</p>
      <p>Cette phase a permis de prioriser les interventions et de fiabiliser les procédures de prise en charge selon la criticité.</p>
    `,
    solution: `
      <p>La démarche adoptée repose sur :</p>
      <ul class="rp-objectifs-list">
        <li>un protocole de diagnostic standardisé (vérifications hardware puis software),</li>
        <li>des procédures de réparation/remastérisation documentées,</li>
        <li>un suivi des interventions pour assurer la traçabilité client.</li>
      </ul>
    `,
    realisation: `
      <p>J'ai réalisé des diagnostics complets sur des postes clients (pannes matérielles et logicielles), puis mis en œuvre les actions correctives adaptées.</p>
      <p>Les interventions ont inclus remplacement de composants, réinstallation système, nettoyage et tests de validation avant restitution.</p>
      <p>Chaque intervention a été tracée avec un compte rendu technique pour capitaliser les solutions et améliorer la qualité du support.</p>
    `,
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Début projet</span><strong>05/01/2026</strong></div>
        <div class="rp-pm-meta-item"><span>Fin projet</span><strong>13/02/2026</strong></div>
        <div class="rp-pm-meta-item"><span>Équipe</span><strong>Atelier support + stagiaire SISR</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode de gestion</span><strong>Agile (flux d'incidents)</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Parties prenantes & rôles</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Partie prenante</th><th>Fonction</th><th>Rôle</th></tr></thead>
              <tbody>
                <tr><td>Responsable atelier</td><td>Référent</td><td>Priorisation et validation des interventions</td></tr>
                <tr><td>Technicien stagiaire SISR</td><td>Exécutant</td><td>Diagnostic, réparation, reporting</td></tr>
                <tr><td>Clients finaux</td><td>Usagers</td><td>Expression du besoin et validation restitution</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Contraintes & risques</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Erreur de diagnostic initial</td><td>Moyen</td><td>Tests croisés et validation N2</td></tr>
                <tr><td>Délai de résolution trop long</td><td>Élevé</td><td>Priorisation par criticité</td></tr>
                <tr><td>Perte de données</td><td>Élevé</td><td>Sauvegarde avant intervention lourde</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Collecte des besoins & ressources</h4>
          <p class="mb-2">Les besoins étaient collectés via tickets et échanges directs avec les clients. La traçabilité était assurée dans les fiches d'intervention.</p>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>Humaines :</strong> équipe atelier + technicien stagiaire.</li>
            <li><strong>Matérielles :</strong> banc de test, pièces SAV, outils de diagnostic.</li>
            <li><strong>Financières :</strong> stock atelier et budget SAV.</li>
          </ul>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 2;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Prise en main & cadrage</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 1; --length: 0.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Interventions support</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 1.5; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Standardisation & bilan</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 2.5; --length: 0.5;"></span></div>
          </div>
        </div>
        <div class="rp-gantt-chronology">
          <span><strong>M1</strong><small>01/2026</small></span>
          <span><strong>M2</strong><small>02/2026</small></span>
        </div>
      </div>
    `,
    testsValidation: `
      <p>Chaque poste réparé a été validé par une batterie de tests fonctionnels (démarrage, stabilité, connectivité, absence d'erreurs système).</p>
      <p>Les résultats ont montré une amélioration du temps moyen de traitement et une meilleure fiabilité des restitutions clients.</p>
    `,
    objectifs: [
      'Diagnostiquer rapidement les pannes matérielles et logicielles',
      'Appliquer des procédures de réparation standardisées',
      'Assurer la traçabilité des interventions de support'
    ],
    technologies: [
      'Windows 10/11', 'Outils de diagnostic hardware', 'Rufus'
    ],
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Maintenance matérielle et logicielle du parc.' },
      { num: '1.2', text: 'Répondre aux incidents : Diagnostic, résolution et communication client.' },
      { num: '1.4', text: 'Travailler en mode projet : Organisation des interventions et suivi des priorités.' }
    ],
    resultats: `
      <p>Optimisation du temps de diagnostic, amélioration du taux de résolution et satisfaction client renforcée.</p>
    `,
    images: [
      { src: "images/D%C3%A9pannage.JPG", caption: "Intervention de dépannage sur poste client" }
    ],
    projectInfo: {
      duration: '2 mois',
      team: 'Équipe support + stagiaire SISR',
      context: 'Stage 2ème année - ActifAzur',
      status: 'Terminé',
      technologies: ['Windows 10/11', 'Outils de diagnostic', 'Rufus', 'Procédures SAV']
    }
  },
  'rp4': {
    badge: 'Web',
    badgeClass: 'rp-badge-web',
    title: 'RP09 - Conception du portfolio professionnel',
    period: '10/10/2024 - 03/05/2026',
    context: 'Projet personnel',
    useStructuredTemplate: true,
    description: `
      <h4 class="rp-subsection-title">Situation</h4>
      <p>Dans le cadre de ma préparation BTS SIO SISR, j'ai conçu un portfolio pour présenter mes réalisations, compétences et preuves techniques de manière exploitable en soutenance.</p>
      <h4 class="rp-subsection-title">Contexte & Besoin</h4>
      <p>Le besoin était de disposer d'un support clair, professionnel et évolutif, capable de démontrer à la fois mes compétences techniques et ma méthode de travail en mode projet.</p>
      <h4 class="rp-subsection-title">Problématique</h4>
      <p>Comment construire une vitrine professionnelle qui ne soit pas seulement descriptive, mais réellement démonstrative et utile à l'oral comme à la lecture autonome ?</p>
    `,
    analyse: `
      <p>J'ai identifié les attentes principales : lisibilité rapide, structure pédagogique, accessibilité mobile et cohérence visuelle entre les différentes rubriques (RP, compétences, veille, stages).</p>
      <p>L'analyse des retours enseignants m'a conduit à renforcer la partie gestion de projet et à privilégier des preuves visuelles ciblées plutôt qu'un texte trop dense.</p>
    `,
    solution: `
      <p>La solution retenue repose sur :</p>
      <ul class="rp-objectifs-list">
        <li>une architecture en sections claires orientées présentation orale,</li>
        <li>une interface responsive et moderne,</li>
        <li>une logique de preuves (captures, schémas, documentation liée) pour chaque RP.</li>
      </ul>
    `,
    realisation: `
      <p>J'ai conçu puis développé le portfolio en HTML/CSS/JavaScript avec Bootstrap, en itérant sur l'UX et la hiérarchie de l'information.</p>
      <p>J'ai intégré des modales détaillées pour chaque RP, des composants visuels de planification (Gantt), ainsi qu'une organisation cohérente des éléments de preuve.</p>
      <p>Le déploiement et les mises à jour sont versionnés pour assurer un suivi régulier et une amélioration continue.</p>
    `,
    projectManagement: `
      <div class="rp-pm-meta">
        <div class="rp-pm-meta-item"><span>Début projet</span><strong>10/10/2024</strong></div>
        <div class="rp-pm-meta-item"><span>Fin projet</span><strong>03/05/2026</strong></div>
        <div class="rp-pm-meta-item"><span>Équipe</span><strong>Projet individuel</strong></div>
        <div class="rp-pm-meta-item"><span>Méthode de gestion</span><strong>Agile (itérative)</strong></div>
      </div>

      <div class="rp-pm-grid">
        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Parties prenantes & rôles</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Partie prenante</th><th>Fonction</th><th>Rôle</th></tr></thead>
              <tbody>
                <tr><td>Étudiant SISR (moi)</td><td>Porteur</td><td>Conception, développement, maintenance</td></tr>
                <tr><td>Enseignants / jury</td><td>Évaluateurs</td><td>Retours et validation pédagogique</td></tr>
                <tr><td>Recruteurs / lecteurs</td><td>Utilisateurs</td><td>Consultation des compétences et réalisations</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Contraintes & risques</h4>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 rp-pm-table">
              <thead><tr><th>Risque</th><th>Impact</th><th>Traitement</th></tr></thead>
              <tbody>
                <tr><td>Contenu trop descriptif</td><td>Élevé</td><td>Structuration orientée preuves & démonstration</td></tr>
                <tr><td>Surcharge visuelle</td><td>Moyen</td><td>Hiérarchie claire et sections homogènes</td></tr>
                <tr><td>Manque de traçabilité</td><td>Élevé</td><td>Documentation liée à chaque RP</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rp-pm-card">
          <h4 class="rp-subsection-title">Collecte des besoins & ressources</h4>
          <p class="mb-2">Les besoins ont été collectés via référentiel BTS SIO, retours enseignants et auto-revue continue après chaque évolution.</p>
          <ul class="rp-objectifs-list mb-0">
            <li><strong>Humaines :</strong> projet solo avec feedback pédagogique.</li>
            <li><strong>Matérielles :</strong> poste de développement et hébergement GitHub.</li>
            <li><strong>Financières :</strong> coûts maîtrisés (outils open source / gratuits).</li>
          </ul>
        </div>
      </div>

      <h4 class="rp-subsection-title mt-3">Planification (grandes phases)</h4>
      <div class="rp-gantt-card" style="--gantt-units: 6;">
        <h4 class="rp-subsection-title rp-gantt-title"><i class="fa-solid fa-chart-gantt"></i>Diagramme de Gantt (Phases)</h4>
        <div class="rp-gantt-rows">
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Cadrage initial</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-blue" style="--start: 1; --length: 1;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Conception UI/UX</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-indigo" style="--start: 2; --length: 1.5;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Développement cœur du site</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-green" style="--start: 3.5; --length: 2;"></span></div>
          </div>
          <div class="rp-gantt-row">
            <span class="rp-gantt-label">Intégration des preuves RP</span>
            <div class="rp-gantt-track"><span class="rp-gantt-bar is-amber" style="--start: 5.5; --length: 1.5;"></span></div>
          </div>
        </div>
        <div class="rp-gantt-chronology">
          <span><strong>P1</strong><small>10/2024</small></span>
          <span><strong>P2</strong><small>01/2025</small></span>
          <span><strong>P3</strong><small>06/2025</small></span>
          <span><strong>P4</strong><small>10/2025</small></span>
          <span><strong>P5</strong><small>01/2026</small></span>
          <span><strong>P6</strong><small>04/2026</small></span>
        </div>
      </div>
    `,
    testsValidation: `
      <p>La validation a été réalisée par tests multi-supports (desktop/mobile), vérification de l'accessibilité des sections et revue de cohérence des contenus.</p>
      <p>Les retours utilisateurs/enseignants ont permis d'améliorer la lisibilité globale et la pertinence des preuves présentées.</p>
    `,
    objectifs: [
      'Design UI/UX épuré et moderne',
      'Développement Responsive (Bootstrap 5)',
      'Déploiement automatisé (GitHub Pages)'
    ],
    technologies: [
      'HTML5', 'CSS3', 'JS', 'Bootstrap 5', 'GitHub'
    ],
    competences: [
      { num: '1.3', text: 'Développer la présence en ligne.' },
      { num: '1.4', text: 'Travailler en mode projet.' },
      { num: '1.6', text: 'Organiser son développement professionnel.' }
    ],
    resultats: `
      <p>Portfolio interactif et sécurisé en ligne.</p>
    `,
    images: [
      { src: "images/portfolioimg2.png", caption: "Aperçu de la réalisation du portfolio" }
    ],
    projectInfo: {
      duration: '18 mois',
      team: 'Projet individuel',
      context: 'Projet personnel - BTS SIO',
      status: 'Terminé',
      links: [
        { label: 'Portfolio GitHub', href: 'https://github.com/edib16/Portfolio' }
      ]
    }
  }
};

// Éléments du DOM
const rpModal = document.getElementById('rpModal');
const rpModalContent = document.getElementById('rpModalContent');
const rpModalClose = document.querySelector('.rp-modal-close');
const rpModalOverlay = document.querySelector('.rp-modal-overlay');

// Fonction pour générer le contenu du modal
function generateRPContent(rp) {
  const competencesHTML = rp.competences.map(c => `
    <div class="rp-detail-competence-item">
      <div class="rp-detail-competence-num">${c.num}</div>
      <span class="rp-detail-competence-text">${c.text}</span>
    </div>
  `).join('');

  const objectifsHTML = rp.objectifs.map(obj => `<li>${obj}</li>`).join('');
  const techsHTML = rp.technologies.map(tech => `<span class="rp-tech-tag">${tech}</span>`).join('');
  
  // Méthodologie (optionnel)
  const methodologieHTML = rp.methodologie ? `
    <div class="rp-detail-section">
      <h3 class="rp-detail-section-title">${rp.methodologieTitle || 'Méthodologie & Démarche'}</h3>
      ${rp.methodologie}
    </div>
  ` : '';

  // Images (optionnel)
  const imagesHTML = rp.images && rp.images.length > 0 ? `
    <div class="rp-detail-section">
      <h3 class="rp-detail-section-title">📸 Illustrations & Preuves</h3>
      <div class="rp-images-grid">
        ${rp.images.map(img => `
          <div class="rp-image-item">
            <img src="${img.src}" alt="${img.caption}" class="rp-image lightbox-trigger" data-caption="${img.caption}" onerror="this.parentElement.innerHTML='<div class=\\'rp-image-placeholder\\'><i class=\\'fa-solid fa-image\\'></i><span>${img.caption}</span></div>'">
            <p class="rp-image-caption">${img.caption}</p>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  if (rp.useStructuredTemplate) {
    const info = rp.projectInfo || {};
    const sidebarTechs = (info.technologies || rp.technologies || []).map(tech =>
      `<span class="tech-tag-sidebar">${tech}</span>`
    ).join('');
    const sidebarLinks = (info.links || []).map(link =>
      `<a class="sidebar-link-item" href="${link.href}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-link"></i>${link.label}</a>`
    ).join('');

    const visualPreviewHTML = rp.images && rp.images.length > 0 ? `
      <div class="rp-images-grid">
        ${rp.images.map(img => `
          <div class="rp-image-item">
            <img src="${img.src}" alt="${img.caption}" class="rp-image lightbox-trigger" data-caption="${img.caption}" onerror="this.parentElement.innerHTML='<div class=\\'rp-image-placeholder\\'><i class=\\'fa-solid fa-image\\'></i><span>${img.caption}</span></div>'">
            <p class="rp-image-caption">${img.caption}</p>
          </div>
        `).join('')}
      </div>
    ` : `<div class="rp-visual-placeholder">Aperçu visuel à insérer</div>`;

    return `
      <div class="rp-modal-layout">
        <div class="rp-modal-main">
          <div class="rp-detail-header">
            <span class="rp-detail-badge ${rp.badgeClass}">${rp.badge}</span>
            <h2 class="rp-detail-title">${rp.title}</h2>
            <div class="rp-detail-meta">
              <span><i class="fa-regular fa-calendar"></i>${rp.period}</span>
              <span><i class="fa-regular fa-building"></i>${rp.context}</span>
            </div>
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-building-shield"></i></span><span class="rp-step-number">1.</span> Contexte</h3>
            ${rp.description}
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-magnifying-glass-chart"></i></span><span class="rp-step-number">2.</span> Démarche d'Analyse</h3>
            ${rp.analyse || '<p>Contenu en cours d\'ajout.</p>'}
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-lightbulb"></i></span><span class="rp-step-number">3.</span> Solution Proposée</h3>
            ${rp.solution || '<p>Contenu en cours d\'ajout.</p>'}
            <h4 class="rp-subsection-title">Aperçu visuel</h4>
            ${visualPreviewHTML}
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-screwdriver-wrench"></i></span><span class="rp-step-number">4.</span> Réalisation</h3>
            ${rp.realisation || rp.resultats}
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-calendar-check"></i></span><span class="rp-step-number">5.</span> Cadrage et Gestion de Projet</h3>
            ${rp.projectManagement || '<p>Contenu en cours d\'ajout.</p>'}
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-vial-circle-check"></i></span><span class="rp-step-number">6.</span> Tests & Validation</h3>
            ${rp.testsValidation || '<p>Contenu en cours d\'ajout.</p>'}
          </div>

          <div class="rp-step-section">
            <h3 class="rp-step-title"><span class="rp-step-icon"><i class="fa-solid fa-graduation-cap"></i></span><span class="rp-step-number">7.</span> Compétences du Bloc 1 couvertes</h3>
            <div class="rp-detail-competences">
              <div class="rp-detail-competences-grid">
                ${competencesHTML}
              </div>
            </div>
          </div>
        </div>

        <aside class="rp-modal-sidebar">
          <h4 class="sidebar-title"><i class="fa-solid fa-circle-info"></i>Informations</h4>
          <div class="info-item"><span class="info-label">Durée</span><span class="info-value">${info.duration || rp.period}</span></div>
          <div class="info-item"><span class="info-label">Équipe</span><span class="info-value">${info.team || 'Non précisé'}</span></div>
          <div class="info-item"><span class="info-label">Contexte</span><span class="info-value">${info.context || rp.context}</span></div>
          <div class="info-item"><span class="info-label">Statut</span><span class="info-value">${info.status || 'Terminé'}</span></div>
          <div class="info-item">
            <span class="info-label">Technologies</span>
            <div class="tech-tags-container">${sidebarTechs}</div>
          </div>
          ${sidebarLinks ? `<div class="info-item sidebar-links"><span class="info-label">Liens</span>${sidebarLinks}</div>` : ''}
        </aside>
      </div>
    `;
  }

  return `
    <div class="rp-detail-header">
      <span class="rp-detail-badge ${rp.badgeClass}">${rp.badge}</span>
      <h2 class="rp-detail-title">${rp.title}</h2>
      <div class="rp-detail-meta">
        <span><i class="fa-regular fa-calendar"></i>${rp.period}</span>
        <span><i class="fa-regular fa-building"></i>${rp.context}</span>
      </div>
    </div>

    <div class="rp-detail-section">
      <h3 class="rp-detail-section-title">Contexte & Description</h3>
      ${rp.description}
    </div>

    <div class="rp-detail-section">
      <h3 class="rp-detail-section-title">Objectifs</h3>
      <ul class="rp-objectifs-list">${objectifsHTML}</ul>
    </div>

    <div class="rp-detail-section">
      <h3 class="rp-detail-section-title">Technologies utilisées</h3>
      <div class="rp-tech-grid">${techsHTML}</div>
    </div>

    ${methodologieHTML}

    <div class="rp-detail-section">
      <div class="rp-detail-competences">
        <h4 class="rp-detail-competences-title">Compétences du Bloc 1 mobilisées</h4>
        <div class="rp-detail-competences-grid">
          ${competencesHTML}
        </div>
      </div>
    </div>

    <div class="rp-detail-section">
      <h3 class="rp-detail-section-title">Résultats & Bilan</h3>
      ${rp.resultats}
    </div>

    ${imagesHTML}
  `;
}

// Ouvrir le modal
function openRPModal(rpId) {
  const rp = rpData[rpId];
  if (!rp) return;
  
  rpModalContent.innerHTML = generateRPContent(rp);
  rpModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Empêcher le scroll du body

  // Reset du scroll vers le haut à chaque ouverture
  rpModalContent.scrollTop = 0;
  if (rpModal.querySelector('.rp-modal-body')) {
    rpModal.querySelector('.rp-modal-body').scrollTop = 0;
  }
  rpModal.scrollTop = 0;
}

// Fermer le modal
function closeRPModal() {
  rpModal.classList.remove('active');
  document.body.style.overflow = ''; // Réactiver le scroll
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Clic sur les cartes RP
  const rpCards = document.querySelectorAll('.rp-card');
  rpCards.forEach(card => {
    card.addEventListener('click', () => {
      const rpId = card.dataset.rpId;
      openRPModal(rpId);
    });
  });

  // Boutons "Voir le détail"
  const rpButtons = document.querySelectorAll('.rp-card-btn');
  rpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Éviter le double déclenchement
      const card = btn.closest('.rp-card');
      const rpId = card.dataset.rpId;
      openRPModal(rpId);
    });
  });

  // Fermer le modal
  if (rpModalClose) {
    rpModalClose.addEventListener('click', closeRPModal);
  }

  if (rpModalOverlay) {
    rpModalOverlay.addEventListener('click', closeRPModal);
  }

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rpModal && rpModal.classList.contains('active')) {
      closeRPModal();
    }
  });
});

// ========================================
// PERFORMANCE MONITORING (Dev)
// ========================================

if (window.performance && console.table) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log(`%c⚡ Page chargée en ${pageLoadTime}ms`, 'color: #28a745; font-weight: bold;');
    }, 0);
  });
}

// ========================================
// LIGHTBOX POUR SCREENSHOTS (Veille + RP)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!lightboxModal || !lightboxImage) return;

  // Délégation d'événements pour gérer les images dynamiques (RP modal)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-trigger')) {
      const img = e.target;
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = img.dataset.caption || img.alt;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Fermer le lightbox
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Clic sur le bouton fermer
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Clic en dehors de l'image
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
});

// ========================================
// DEEP LINKS — Ouverture automatique des RP
// ========================================
// Permet d'envoyer un lien comme: tonsite.com/#RP06
// La page scrolle vers la section projets et ouvre le modal correspondant.

(function() {
  // Mapping nom RP visible → ID interne utilisé par openRPModal
  const rpDeepLinkMap = {
    'RP01': 'rp5',
    'RP02': 'rp6',
    'RP03': 'rp7',
    'RP04': 'rp8',
    'RP06': 'rp1',
    'RP07': 'rp2',
    'RP08': 'rp3',
    'RP09': 'rp4'
  };

  function handleDeepLink() {
    const hash = window.location.hash.replace('#', '').toUpperCase();
    const rpInternalId = rpDeepLinkMap[hash];
    
    if (!rpInternalId) return; // Pas un lien RP, laisser le comportement normal

    // Attendre que la page soit prête puis scroll + ouvrir le modal
    setTimeout(() => {
      // Scroll vers la section réalisations
      const realisationsSection = document.getElementById('realisations');
      if (realisationsSection) {
        realisationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Ouvrir le modal après le scroll
      setTimeout(() => {
        openRPModal(rpInternalId);
      }, 600);
    }, 500);
  }

  // Au chargement de la page
  if (document.readyState === 'complete') {
    handleDeepLink();
  } else {
    window.addEventListener('load', handleDeepLink);
  }

  // Si le hash change dynamiquement (ex: clic sur un lien interne)
  window.addEventListener('hashchange', handleDeepLink);
})();
