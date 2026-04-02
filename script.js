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
  rp1: {
    badge: 'Sécurité',
    badgeClass: 'rp-badge-security',
    title: 'Déploiement d\'une infrastructure réseau sécurisée (802.1X)',
    period: '2ème année BTS SIO',
    context: 'IRIS Mediaschool',
    description: `
      <h4>Contexte</h4>
      <p>Le réseau interne de notre établissement nécessitait une refonte sécuritaire. Jusqu'ici, les accès filaires et Wi-Fi étaient vulnérables (absence d'authentification forte, mots de passe partagés).</p>
      <p>Pour protéger l'infrastructure, le besoin était de s'assurer que <strong>seuls les étudiants et professeurs légitimes</strong> puissent se connecter, avec une authentification individuelle et centralisée.</p>
    `,
    objectifs: [
      'Concevoir une topologie réseau fiable (LAN et WLAN)',
      'Configurer les équipements d\'interconnexion',
      'Déployer un serveur d\'authentification (RADIUS)',
      'Verrouiller l\'accès aux ports physiques et sans fil via le protocole 802.1X'
    ],
    technologies: [
      'Routeur Cisco',
      'Switch Cisco',
      'Point d\'Accès Cisco',
      'Debian 12',
      'FreeRADIUS',
      '802.1X / EAP'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Réalisation d'un schéma d'architecture préalable</li>
        <li>Paramétrage du service AAA sur le matériel Cisco</li>
        <li>Installation et configuration de FreeRADIUS sur Debian 12</li>
        <li>Liaison avec la base de données utilisateurs du serveur RADIUS</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Intégration et configuration des équipements réseau (Cisco) et du serveur FreeRADIUS sous Debian' },
      { num: '1.4', text: 'Travailler en mode projet : Conception de l\'architecture de bout en bout, du maquettage aux tests finaux' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Fourniture d\'un accès réseau sécurisé et fonctionnel pour les utilisateurs de l\'école' }
    ],
    resultats: `
      <p>Le déploiement est un <strong>succès</strong>. Les tests de validation prouvent que si une machine non autorisée se branche sur une prise réseau ou tente de rejoindre le Wi-Fi, le port reste bloqué au niveau 2 (Switch).</p>
      <p>L'accès n'est libéré qu'après validation des identifiants par le serveur RADIUS.</p>
      <p><strong>Apport personnel :</strong> Cette réalisation m'a permis de maîtriser les mécanismes avancés de la sécurité des accès réseau.</p>
    `
  },
  rp2: {
    badge: 'Infrastructure',
    badgeClass: '',
    title: 'Déploiement d\'un portail de virtualisation WebVirtCloud',
    period: '2ème année BTS SIO',
    context: 'IRIS Mediaschool',
    description: `
      <h4>Contexte</h4>
      <p>Pour la réalisation de leurs Travaux Pratiques (TP), les étudiants des filières SLAM et SISR avaient besoin de créer et manipuler des machines virtuelles (VM).</p>
      <p>Cependant, faire tourner ces VM localement sur les PC des étudiants posait des <strong>problèmes de performances et de ressources matérielles</strong>.</p>
      <p>L'objectif de ma mission était donc de centraliser cette charge de travail en mettant en place un <strong>portail web sécurisé</strong> sur le serveur de l'école, permettant aux étudiants de gérer leurs VM de manière autonome.</p>
    `,
    objectifs: [
      'Installer et configurer un environnement de virtualisation robuste sur un serveur dédié',
      'Déployer une interface web d\'administration claire et intuitive (WebVirtCloud)',
      'Sécuriser les accès à la plateforme et cloisonner les environnements pour chaque étudiant ou groupe de TP',
      'Mettre à disposition des ressources (ISO, templates) pour faciliter le déploiement rapide des VM'
    ],
    technologies: [
      'Debian 12',
      'KVM / QEMU',
      'libvirt',
      'WebVirtCloud',
      'Traefik',
      'Linux Bridges'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Préparation du serveur Debian en ligne de commande (CLI)</li>
        <li>Installation des dépendances et configuration de Traefik (reverse proxy)</li>
        <li>Configuration de l'hyperviseur KVM</li>
        <li>Déploiement de WebVirtCloud et création des comptes utilisateurs</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Administration du serveur physique sous Debian 12 et gestion des ressources virtuelles' },
      { num: '1.4', text: 'Travailler en mode projet : Réponse au besoin spécifique de l\'équipe pédagogique et déploiement par étapes' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Ouverture du portail web aux étudiants pour la création et la gestion de leurs propres VM en libre-service' }
    ],
    resultats: `
      <p>La plateforme a été <strong>mise en production avec succès</strong> sur le serveur de l'école.</p>
      <p>Les étudiants SLAM et SISR peuvent désormais se connecter via un simple navigateur web pour démarrer, éteindre ou recréer leurs machines virtuelles sans saturer leurs ordinateurs personnels.</p>
      <p><strong>Apport personnel :</strong> Ce projet m'a permis de consolider mes compétences en administration système Linux, en gestion d'hyperviseurs bare-metal (KVM), et en mise en production de services web.</p>
    `
  },
  rp3: {
    badge: 'Support',
    badgeClass: 'rp-badge-support',
    title: 'Support technique, remastérisation et gestion des incidents',
    period: '2ème année BTS SIO (Stage)',
    context: 'ActifAzur - Antibes',
    description: `
      <h4>Contexte</h4>
      <p>Lors de mon stage en entreprise au sein d'un atelier informatique, j'ai été confronté à la <strong>gestion quotidienne des pannes matérielles et logicielles</strong>.</p>
      <p>L'objectif principal était d'assurer la continuité de service pour les clients finaux en traitant leurs demandes d'assistance, allant du simple dysfonctionnement logiciel à la panne matérielle nécessitant un remplacement de composants et une réinstallation complète du système.</p>
    `,
    objectifs: [
      'Diagnostiquer de manière méthodique les pannes matérielles (RAM, disques durs, cartes mères) et logicielles (systèmes corrompus, infections virales)',
      'Réaliser la maintenance préventive et curative des équipements informatiques',
      'Procéder à la remastérisation des postes clients (installation propre de l\'OS) en assurant la sauvegarde et la restauration des données critiques',
      'Assurer le suivi des interventions et la communication avec les utilisateurs pour leur expliquer les réparations effectuées'
    ],
    technologies: [
      'Composants PC',
      'Windows 10/11',
      'Rufus',
      'Outils de clonage',
      'CrystalDiskInfo'
    ],
    methodologie: `
      <p><strong>Méthodologie de Troubleshooting :</strong></p>
      <ul>
        <li>Prise en charge de la machine et écoute du client</li>
        <li>Isolation du problème (tests croisés matériels ou boot sur environnement Live)</li>
        <li>Réparation ou remplacement du composant défaillant</li>
        <li>Installation des pilotes et logiciels de base</li>
        <li>Tests finaux et clôture de l'intervention</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Manipulation du matériel, installation d\'OS et gestion du cycle de vie des postes' },
      { num: '1.2', text: 'Répondre aux incidents et aux demandes d\'assistance et d\'évolution : Diagnostic, résolution de pannes (Niveau 1 et 2) et relation client' }
    ],
    resultats: `
      <p>Ce stage m'a permis d'acquérir de <strong>solides réflexes de diagnostic</strong> (troubleshooting) et d'augmenter considérablement ma rapidité d'exécution sur le traitement des pannes.</p>
      <p>J'ai également appris à <strong>vulgariser des problèmes techniques complexes</strong> pour les expliquer clairement aux clients.</p>
      <p><strong>Apport personnel :</strong> Cette expérience concrète du terrain est un atout majeur pour mon futur rôle de technicien ou d'administrateur système.</p>
    `
  },
  rp4: {
    badge: 'Web',
    badgeClass: 'rp-badge-web',
    title: 'Conception et déploiement du portfolio professionnel',
    period: '2ème année BTS SIO',
    context: 'Projet personnel / IRIS Mediaschool',
    description: `
      <h4>Contexte</h4>
      <p>Dans le cadre de la validation de mon cursus en BTS SIO et de mon entrée sur le marché du travail, il était indispensable de créer une <strong>identité numérique professionnelle</strong>.</p>
      <p>L'objectif était de concevoir une plateforme web centralisant mon CV, mes réalisations techniques (RP) et ma veille technologique, afin de servir de <strong>support interactif</strong> pour les jurys d'examen et les futurs recruteurs.</p>
    `,
    objectifs: [
      'Concevoir l\'arborescence et le design (UI/UX) d\'un site web clair et ergonomique',
      'Développer et intégrer les différentes sections (Accueil, Profil, Projets, Veille, Contact) en s\'assurant que le site soit totalement "Responsive" (adapté aux mobiles et tablettes)',
      'Déployer et héberger le site en ligne de manière sécurisée et le rendre accessible via une URL publique'
    ],
    technologies: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'Bootstrap 5',
      'GitHub Pages (Hébergement)'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Création d'une maquette mentale et définition de la structure du site</li>
        <li>Intégration du code Front-end (HTML/CSS/JS) avec un framework responsive</li>
        <li>Structuration des fenêtres modales pour la présentation des projets</li>
        <li>Tests de compatibilité multi-supports (desktop, tablette, mobile)</li>
        <li>Mise en production sur GitHub Pages avec certificat HTTPS</li>
      </ul>
    `,
    competences: [
      { num: '1.3', text: 'Développer la présence en ligne de l\'organisation : Création de A à Z d\'un site web accessible publiquement, valorisant une identité professionnelle' },
      { num: '1.4', text: 'Travailler en mode projet : Respect du cahier des charges de l\'examen et livraison du site dans les délais impartis' },
      { num: '1.6', text: 'Organiser son développement professionnel : Création d\'un portfolio structuré pour valoriser ses compétences et suivre son évolution' }
    ],
    resultats: `
      <p>Le portfolio est aujourd'hui <strong>en ligne, sécurisé (HTTPS)</strong> et parfaitement fonctionnel sur tous les supports (desktop, tablette, mobile).</p>
      <p>Ce projet m'a permis de sortir de ma zone de confort "Réseau/Système" pour toucher au <strong>développement web (Front-end)</strong> et à la gestion de noms de domaine/hébergement.</p>
      <p><strong>Apport personnel :</strong> Il est devenu mon outil de communication principal pour la valorisation de mes compétences auprès des jurys et recruteurs.</p>
    `
  },
  rp5: {
    badge: 'Système',
    badgeClass: 'rp-badge-infra',
    title: 'Déploiement système d\'une borne interactive (NutriFit)',
    period: '1ère année BTS SIO',
    context: 'Projet inter-spécialités / IRIS Mediaschool',
    description: `
      <h4>Contexte</h4>
      <p>Dans le cadre d'un projet de création d'une <strong>borne interactive destinée aux salles de sport</strong> (calcul de la masse graisseuse, génération de programmes et de diètes), j'ai collaboré avec un étudiant de la spécialité SLAM (développement).</p>
      <p>Mon rôle en tant que profil SISR était de fournir l'<strong>environnement système</strong> de cette borne : un système d'exploitation léger, rapide, et surtout <strong>totalement verrouillé</strong> pour que les utilisateurs ne puissent pas quitter l'application ou dérégler la machine.</p>
    `,
    objectifs: [
      'Choisir et installer un système d\'exploitation Linux optimisé pour les petites configurations matérielles',
      'Configurer l\'environnement en "Mode Kiosk" (lancement automatique de l\'application en plein écran au démarrage)',
      'Sécuriser et durcir le système en désactivant les raccourcis clavier (Alt+F4, Ctrl+Alt+Suppr) et en masquant l\'interface du bureau'
    ],
    technologies: [
      'Xubuntu (Linux XFCE)',
      'Scripts Bash',
      'Configuration autostart XFCE',
      'Hardening système'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Installation de l'OS Xubuntu (distribution légère)</li>
        <li>Déploiement de l'exécutable fourni par le développeur SLAM</li>
        <li>Création de scripts Bash pour l'auto-démarrage (autostart)</li>
        <li>Modification des fichiers de configuration XFCE pour le verrouillage des touches</li>
        <li>Tests de robustesse (tentatives de "casser" l'interface)</li>
        <li>Mise en production sur la machine cible</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Installation et paramétrage d\'un système d\'exploitation client (Linux)' },
      { num: '1.4', text: 'Travailler en mode projet : Collaboration directe avec un développeur (SLAM) pour répondre à un cahier des charges commun' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Fourniture d\'une borne prête à l\'emploi et sécurisée pour le public' }
    ],
    resultats: `
      <p>Le projet a été une <strong>grande réussite technique et humaine</strong>. La borne démarrait directement sur l'application NutriFit sans jamais afficher le bureau Linux, et il était impossible pour un utilisateur de fermer le programme.</p>
      <p>Cette expérience m'a appris à <strong>durcir un système d'exploitation (Hardening)</strong> et m'a prouvé l'importance d'une bonne communication entre les équipes d'infrastructure et de développement.</p>
    `
  },
  rp6: {
    badge: 'Réseau',
    badgeClass: 'rp-badge-network',
    title: 'Infrastructure serveur pour une messagerie locale (Classcord)',
    period: '1ère année BTS SIO',
    context: 'Projet inter-spécialités / IRIS Mediaschool',
    description: `
      <h4>Contexte</h4>
      <p>Le projet "Classcord" avait pour but de créer un <strong>clone sécurisé de Discord</strong>, réservé aux étudiants, hébergé en local sur le réseau de l'école.</p>
      <p>Les étudiants SLAM étaient en charge du développement de l'interface client et de la base de données. En tant que technicien SISR, ma mission était de concevoir, déployer et administrer le <strong>serveur backend</strong> capable d'héberger cette solution et de gérer les connexions entrantes des clients.</p>
    `,
    objectifs: [
      'Déployer un serveur local sous Linux',
      'Configurer l\'environnement réseau pour rendre le serveur accessible depuis les postes des étudiants (adressage IP, ouvertures de ports)',
      'Héberger les composants nécessaires au fonctionnement de l\'application (serveur web/applicatif et base de données)',
      'Administrer et monitorer le serveur pendant les phases de tests des développeurs'
    ],
    technologies: [
      'Debian Linux (Serveur)',
      'Configuration IP statique',
      'Pare-feu UFW/Iptables',
      'Monitoring système (htop)'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Déploiement de la machine virtuelle serveur</li>
        <li>Configuration IP statique et paramétrage du pare-feu</li>
        <li>Ouverture des ports nécessaires (80, 443, 3306)</li>
        <li>Installation des paquets prérequis pour les développeurs</li>
        <li>Tests de ping et de connectivité depuis les postes clients</li>
        <li>Surveillance des ressources (CPU/RAM) lors des tests de charge</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Administration d\'un serveur applicatif et configuration réseau' },
      { num: '1.4', text: 'Travailler en mode projet : Rôle d\'administrateur système en support d\'une équipe de développement' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Mise en production d\'une infrastructure serveur fonctionnelle et sécurisée' }
    ],
    resultats: `
      <p>L'infrastructure a <strong>parfaitement soutenu le déploiement</strong> de l'application Classcord. Les développeurs ont pu se connecter à la base de données et les utilisateurs finaux ont pu échanger des messages en temps réel de manière stable.</p>
      <p>Ce projet m'a fait comprendre les enjeux de l'<strong>architecture Client-Serveur</strong> et le rôle crucial de l'administrateur système pour garantir la disponibilité d'une application.</p>
    `
  },
  rp7: {
    badge: 'Système',
    badgeClass: 'rp-badge-infra',
    title: 'Déploiement d\'un annuaire d\'entreprise (Active Directory)',
    period: '1ère année BTS SIO',
    context: 'TP Laboratoire / École IRIS',
    description: `
      <h4>Contexte</h4>
      <p>Dans le cadre de la création du système d'information d'une nouvelle agence, la gestion des ordinateurs et des mots de passe se faisait en <strong>groupe de travail ("Workgroup")</strong>. Chaque poste possédait ses propres comptes locaux, ce qui devenait impossible à administrer et posait de graves problèmes de sécurité.</p>
      <p>Il m'a été demandé de <strong>centraliser l'authentification</strong> et la gestion des droits des employés en déployant un contrôleur de domaine Microsoft.</p>
    `,
    objectifs: [
      'Installer un système d\'exploitation Windows Server et lui attribuer une configuration réseau statique',
      'Déployer le rôle AD DS (Active Directory Domain Services) et promouvoir le serveur en tant que contrôleur de domaine',
      'Structurer l\'annuaire d\'entreprise en créant des Unités Organisationnelles (OU), des groupes de sécurité et des comptes utilisateurs selon les différents services (RH, Compta, Direction)',
      'Intégrer un poste client (Windows 10/11 Pro) au nouveau domaine pour tester l\'authentification'
    ],
    technologies: [
      'Windows Server (2019/2022)',
      'Windows 10/11 Pro (Client)',
      'AD DS',
      'DNS',
      'Gestionnaire de Serveur',
      'Console Utilisateurs et Ordinateurs AD'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Paramétrage réseau du serveur (IP fixe et définition du serveur lui-même comme DNS principal)</li>
        <li>Installation du rôle via le Gestionnaire de Serveur et création de la forêt/du domaine (ex: iris.local)</li>
        <li>Création de l'arborescence (Groupes et Utilisateurs) via la console d'administration</li>
        <li>Côté client : modification des paramètres DNS pour pointer vers le serveur, puis jonction du poste au domaine via les paramètres système</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Installation et configuration d\'un OS serveur Microsoft et gestion des comptes utilisateurs' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Fourniture d\'un service d\'authentification centralisé pour les utilisateurs de l\'entreprise' }
    ],
    resultats: `
      <p>La centralisation a été un <strong>succès</strong>. Lors des tests, un utilisateur créé sur le serveur a pu se connecter sur le poste client avec ses identifiants de domaine, sans avoir de compte local sur la machine.</p>
      <p>Ce projet m'a permis de comprendre le fonctionnement de l'<strong>administration centralisée sous environnement Microsoft</strong>, qui est incontournable dans le monde professionnel.</p>
    `
  },
  rp8: {
    badge: 'Système',
    badgeClass: 'rp-badge-infra',
    title: 'Déploiement de services d\'infrastructure Linux (DHCP & Web)',
    period: '1ère année BTS SIO',
    context: 'TP Laboratoire / École IRIS',
    description: `
      <h4>Contexte</h4>
      <p>Dans un environnement réseau d'entreprise nouvellement créé, l'attribution des adresses IP se faisait de manière <strong>statique</strong> sur chaque poste. Cette méthode devenait fastidieuse à administrer et générait des conflits d'adresses IP.</p>
      <p>De plus, l'entreprise avait besoin d'un espace interne centralisé pour héberger des informations communes (Intranet). Mon rôle a été de mettre en place un serveur Linux capable d'<strong>automatiser le réseau</strong> et de fournir ce service web.</p>
    `,
    objectifs: [
      'Installer et préparer un serveur sous environnement GNU/Linux',
      'Déployer et configurer un service DHCP pour distribuer dynamiquement et automatiquement les configurations réseau aux postes clients',
      'Déployer un serveur Web pour héberger une page HTML d\'accueil accessible par tous les employés via leur navigateur'
    ],
    technologies: [
      'Debian Server',
      'Administration CLI (ligne de commande)',
      'isc-dhcp-server',
      'Apache2',
      'Configuration réseau Linux'
    ],
    methodologie: `
      <p><strong>Démarche suivie :</strong></p>
      <ul>
        <li>Configuration de l'interface réseau du serveur avec une IP statique</li>
        <li>Paramétrage du fichier <code>dhcpd.conf</code> (définition de la plage d'IP, du masque, de la passerelle et de la durée du bail)</li>
        <li>Installation du service Apache et création d'une page <code>index.html</code> basique dans le répertoire par défaut <code>/var/www/html</code></li>
        <li>Redémarrage des services et tests de validation</li>
      </ul>
    `,
    competences: [
      { num: '1.1', text: 'Gérer le patrimoine informatique : Administration d\'un système d\'exploitation serveur (Linux) et gestion des services réseau' },
      { num: '1.5', text: 'Mettre à disposition un service informatique : Automatisation de l\'adressage IP (DHCP) et mise à disposition d\'un Intranet fonctionnel pour les utilisateurs' }
    ],
    resultats: `
      <p>Le déploiement s'est déroulé <strong>sans encombre</strong>. Lors des tests de validation, tout poste client branché au réseau recevait instantanément une adresse IP valide fournie par le serveur Debian.</p>
      <p>De plus, la page web de l'Intranet était parfaitement accessible. Cette réalisation a consolidé mon aisance sur l'<strong>administration système Linux</strong> et l'édition de fichiers de configuration complexes (via nano ou vim).</p>
    `
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
      <h3 class="rp-detail-section-title">Méthodologie & Démarche</h3>
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
        <h4 class="rp-detail-competences-title">✅ Compétences du Bloc 1 mobilisées</h4>
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
