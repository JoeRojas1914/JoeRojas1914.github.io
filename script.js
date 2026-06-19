/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      entry.target.classList.remove('visible');
      return;
    }
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
  });
}, { rootMargin: '-5% 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ACTIVE NAV ── */
const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"], .mob-nav a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-10% 0px -80% 0px' });

document.querySelectorAll('section[id]').forEach(el => sectionObserver.observe(el));

/* ── MOBILE NAV ── */
const mobToggle = document.getElementById('mobToggle');
const mobNav    = document.getElementById('mobNav');

if (mobToggle && mobNav) {
  mobToggle.addEventListener('click', () => mobNav.classList.toggle('open'));
  mobNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobNav.classList.remove('open'));
  });
}

/* ── LANGUAGE SWITCHER ── */
let currentLang = 'en';
const langBtns  = document.querySelectorAll('.lang-btn');

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) el.innerHTML = text;
  });
  document.documentElement.lang = lang;
  langBtns.forEach(btn => {
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
  });
}

setLanguage('en');

langBtns.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(currentLang === 'es' ? 'en' : 'es'));
});
