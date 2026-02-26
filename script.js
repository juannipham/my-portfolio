/* =============================================
   PORTFOLIO — script.js
   ============================================= */
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
// ── Register GSAP ScrollTrigger ──
gsap.registerPlugin(ScrollTrigger);

// ── Cursor ──
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function animateCursor() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cursor.style.left = rx + 'px';
  cursor.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// ── Navbar scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Hero counter animation ──
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const step = target / (duration / 16);
  let current = 0;
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + '+';
    if (current >= target) clearInterval(interval);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.meta-num').forEach(countUp);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-meta').forEach(el => counterObserver.observe(el));

// ── Scroll reveal (generic) ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── GSAP Scroll animations ──
gsap.utils.toArray('.section-tag').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    opacity: 0, x: -24, duration: .6, ease: 'power3.out'
  });
});

gsap.utils.toArray('.section-title').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    opacity: 0, y: 30, duration: .9, ease: 'power3.out', delay: .1
  });
});

// Stagger skill blocks
gsap.utils.toArray('.skill-block').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 0, y: 40, duration: .7,
    ease: 'power3.out', delay: (i % 3) * 0.1
  });
});

// Skill bars fill on scroll
gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
  const width = bar.dataset.width + '%';
  ScrollTrigger.create({
    trigger: bar,
    start: 'top 85%',
    once: true,
    onEnter: () => { bar.style.width = width; }
  });
});

// Timeline items
gsap.utils.toArray('.timeline-item').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 0, x: i % 2 === 0 ? -30 : 30, duration: .7, ease: 'power3.out'
  });
});

// Hobby cards stagger
gsap.utils.toArray('.hobby-card').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 0, y: 30, duration: .6,
    ease: 'power3.out', delay: (i % 3) * 0.08
  });
});

// About chips
gsap.utils.toArray('.chip').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    opacity: 0, scale: .85, duration: .4,
    ease: 'back.out(1.5)', delay: i * 0.07
  });
});

// Social cards
gsap.utils.toArray('.social-card').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    opacity: 0, y: 20, duration: .5,
    ease: 'power3.out', delay: i * 0.07
  });
});

// ── Projects slider ──
const track       = document.getElementById('projectsTrack');
const cards       = track.querySelectorAll('.proj-card');
const totalCards  = cards.length;
const progressFill = document.getElementById('progressFill');
const projCurrent = document.getElementById('projCurrent');

let currentSlide   = 0;
let cardsVisible   = getCardsVisible();

function getCardsVisible() {
  if (window.innerWidth > 1024) return 3;
  if (window.innerWidth > 640)  return 2;
  return 1;
}

function getMaxSlide() {
  return Math.max(0, totalCards - cardsVisible);
}

function updateSlider() {
  const cardStyle = window.getComputedStyle(cards[0]);
  const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
  const cardW = cards[0].offsetWidth + gap;

  currentSlide = Math.min(currentSlide, getMaxSlide());
  track.style.transform = `translateX(-${currentSlide * cardW}px)`;

  const maxSlide = getMaxSlide();
  const progress = maxSlide > 0 ? (currentSlide / maxSlide) * 100 : 100;
  progressFill.style.width = progress + '%';

  projCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
  document.getElementById('projTotal').textContent = String(maxSlide + 1).padStart(2, '0');
}

document.getElementById('projPrev').addEventListener('click', () => {
  currentSlide = Math.max(0, currentSlide - 1);
  updateSlider();
});
document.getElementById('projNext').addEventListener('click', () => {
  currentSlide = Math.min(getMaxSlide(), currentSlide + 1);
  updateSlider();
});

window.addEventListener('resize', () => {
  currentSlide = 0;
  updateSlider();
});

// Touch support
let touchStart = 0;
track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
track.addEventListener('touchend', e => {
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) currentSlide = Math.min(getMaxSlide(), currentSlide + 1);
    else          currentSlide = Math.max(0, currentSlide - 1);
    updateSlider();
  }
});

updateSlider();

// ── Project data ──
const projectData = [
  {
    img: 'img/cabin.jpg',
    gradient: 'linear-gradient(135deg, #1a1035, #2d1b69)',
    tag: 'Frontend Development',
    year: '2026',
    title: 'PaulBert Cabin',
    desc: 'PaulBert’s Cabin is a web-based booking and promotional website designed to showcase a cozy cabin rental experience.',
    details: 'It highlights amenities, accommodation details, pricing, and availability while providing users with a simple and seamless reservation process.',
    techs: ['Tailwind CSS', 'React', 'Vite'],
    liveUrl: 'https://paulbertscabin.vercel.app/',
  },
  {
    img: 'img/dessert.jpg',
    gradient: 'linear-gradient(135deg, #1a1035, #2d1b69)',
    tag: 'Frontend Development',
    year: '2023',
    title: 'Desserts Shop',
    desc: 'This dynamic website project, built using HTML, CSS, and JavaScript, features an interactive dessert and pastry showcase.',
    details: 'It highlights product descriptions, engaging visuals, and a smooth user experience to present the perfect balance of sweetness and rich glaze in every treat.',
    techs: ['HTML', 'CSS', 'JS'],
    liveUrl: 'https://heavenlydessertsshop.vercel.app',
  },
  {
    img: 'img/learnlearn.jpg',
    gradient: 'linear-gradient(135deg, #0d2137, #0a4a6e)',
    tag: 'UI/UX Design',
    year: '2022',
    title: 'Game Guide Platform',
    desc: 'LearnLearn.games is a dynamic gaming guide website created by 3 collaborators to help players improve their skills through in-depth tutorials and solutions.',
    details: 'The platform offers user-friendly navigation, searchable guides across popular and competitive games, and a community space where gamers can connect, share insights, and grow together.',
    techs: ['Wix', 'UI', 'UX', 'Game-guides', 'Collaboration'],
    liveUrl: 'https://mandangjunel4.wixsite.com/telecall-12-gamo',
  },
  {
    img: 'img/iskolar.jpg',
    gradient: 'linear-gradient(135deg, #2a1a0d, #6b3a1b)',
    tag: 'Full-stack Website',
    year: '2025',
    title: 'IskoLAr',
    desc: 'IskoLAr: was developed to address the inefficiencies of traditional document storage and sharing at the Polytechnic University of the Philippines.',
    details: 'This system serves as a centralized digital repository where users can upload, retrieve, and manage important documents and academic files.',
    techs: ['Laravel', 'PHP', 'Bootstrap', 'Database System', 'Collaboration'],
    liveUrl: 'https://github.com/lawtrinidad/Laravel-FMS',
  },
  {
    img: 'img/urbanbreeze.JPG',
    gradient: 'linear-gradient(135deg, #1a0d2a, #4a1b6b)',
    tag: 'Data Analytics',
    year: '2025',
    title: 'Exploratory Data Analysis',
    desc: 'A data analytics project that investigates how the proximity of Points of Interest (POIs) affects local air quality levels in Navotas',
    details: 'The study applies exploratory data analysis techniques to identify patterns, correlations, and trends between urban activity zones and environmental conditions.',
    techs: ['Tableau', 'Python', 'Matplotlib', 'Google Colab', 'Collaboration'],
    liveUrl: 'https://drive.google.com/file/d/1istpVnDHMG-4toeZ_IocY4GSWne8Xo9c/view?usp=sharing',
  },
  {
    img: 'img/antitres.jpg',
    gradient: 'linear-gradient(135deg, #1a2a0d, #2d5c1b)',
    tag: 'UI/UX',
    year: '2024',
    title: 'AntiTres: Academic Tracker',
    desc: 'AntiTres: Academic Tracker is a mobile school planner application designed to help students efficiently manage their academic responsibilities anytime and anywhere.',
    details: 'The app allows users to track schedules, subjects, tasks, deadlines, and grades in one organized platform.',
    techs: ['Figma', 'UI', 'UX', 'Collaboration'],
    liveUrl: 'https://www.figma.com/design/1hsYut658ZaOqOLGGZ2JEs/AntiTres-Academic-Tracker?node-id=0-1&t=BjLcc7XWgHzyOsIL-1',
  }
];

// ── Modal ──
const modalOverlay = document.getElementById('modalOverlay');

function openProject(index) {
  const p = projectData[index];
  const modalHero = document.getElementById('modalHero');
  if (p.img) {
    modalHero.innerHTML = `<img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
  } else {
    modalHero.style.background = p.gradient;
    modalHero.innerHTML = p.emoji;
  }
  document.getElementById('modalTag').textContent   = p.tag;
  document.getElementById('modalYear').textContent  = p.year;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent  = p.desc;
  document.getElementById('modalDetails').textContent = p.details;

  document.getElementById('modalTechs').innerHTML =
    p.techs.map(t => `<span>${t}</span>`).join('');

  document.getElementById('modalActions').innerHTML = `
    <a href="${p.liveUrl}" target="_blank" class="btn-solid"> View Project <span class="btn-arrow">↗</span></a>`;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProject(e) {
  if (e.target === modalOverlay) closeProjectDirect();
}

function closeProjectDirect() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProjectDirect();
});

// ── Contact form ──
function submitForm(e) {
  e.preventDefault();
  showToast('Message sent! I\'ll be in touch soon ✦');
  e.target.reset();
}

// ── Toast ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

