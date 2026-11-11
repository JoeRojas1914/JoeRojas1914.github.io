const titles = {
  es: 'Jorge Ángel Rojas Martínez',
  en: 'Jorge Ángel Rojas Martínez'
};

const FADE_MS  = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
const langBtns = document.querySelectorAll('.lang-btn');
let currentLang = 'en';
let switching   = false;
const langHooks = []; 

function applyLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) el.textContent = text;
  });
  document.documentElement.lang = lang;
  document.title = titles[lang];
  langBtns.forEach(btn => {
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
    btn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
  });
  langHooks.forEach(fn => fn(lang));
}

function switchLanguage(lang) {
  if (switching) return;
  switching = true;
  document.body.classList.add('lang-out');
  setTimeout(() => {
    applyLanguage(lang);
    document.body.classList.remove('lang-out');
    setTimeout(() => { switching = false; }, FADE_MS);
  }, FADE_MS);
}

applyLanguage('en');

langBtns.forEach(btn => {
  btn.addEventListener('click', () => switchLanguage(currentLang === 'es' ? 'en' : 'es'));
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const topnav = document.getElementById('topnav');
const band   = document.querySelector('.band');

if (topnav && band && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    topnav.classList.toggle('is-shown', !entry.isIntersecting);
  }, { rootMargin: '-80px 0px 0px 0px' }).observe(band);
}

const navLinks = document.querySelectorAll('.topnav-links a');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
}

const reveals = document.querySelectorAll('.reveal');

reveals.forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.setProperty('--d', siblings.indexOf(el) * 90 + 'ms');
  el.querySelectorAll('.points li').forEach((li, i) => li.style.setProperty('--li', i));
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      obs.unobserve(el);
      setTimeout(() => el.classList.add('settled'), 1800);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => revealObserver.observe(el));
}

const rotatorItems = document.querySelectorAll('#rotator .rotator-item');
if (rotatorItems.length > 1 && !reduceMotion) {
  let current = 0;
  setInterval(() => {
    if (document.hidden || switching) return;
    const prev = rotatorItems[current];
    current = (current + 1) % rotatorItems.length;
    const next = rotatorItems[current];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    next.classList.remove('is-leaving');
    next.classList.add('is-active');
    setTimeout(() => prev.classList.remove('is-leaving'), 500);
  }, 3500);
}

if (band && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
  let frame = null;
  band.addEventListener('pointermove', e => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const r = band.getBoundingClientRect();
      band.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      band.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      frame = null;
    });
  });
}

const progressBar = document.getElementById('progressBar');
if (progressBar) {
  let ticking = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progressBar.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();
}

const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message, linkText, linkHref) {
  if (!toast) return;
  toast.replaceChildren();
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(text);
  if (linkText) {
    const a = document.createElement('a');
    a.href = linkHref;
    a.textContent = linkText;
    toast.append(a);
  }
  toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 4000);
}

document.querySelectorAll('.js-copy').forEach(link => {
  link.addEventListener('click', e => {
    if (!navigator.clipboard) return; 
    e.preventDefault();
    const email = link.getAttribute('href').replace('mailto:', '');
    navigator.clipboard.writeText(email)
      .then(() => {
        const es = currentLang === 'es';
        showToast(es ? 'Correo copiado' : 'Email copied',
                  es ? 'Abrir app de correo' : 'Open mail app',
                  link.getAttribute('href'));
      })
      .catch(() => { window.location.href = link.getAttribute('href'); });
  });
});

const root = document.documentElement;
const themeBtns = document.querySelectorAll('.theme-btn');
let themeSaved = false;
try { themeSaved = !!localStorage.getItem('theme'); } catch (e) {}

function labelThemeButtons(lang) {
  const dark = root.getAttribute('data-theme') === 'dark';
  const label = lang === 'es'
    ? (dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro')
    : (dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeBtns.forEach(b => { b.setAttribute('aria-label', label); b.title = label; });
}

function setTheme(theme, animate) {
  if (animate && !reduceMotion) {
    root.classList.add('theme-anim');
    setTimeout(() => root.classList.remove('theme-anim'), 450);
  }
  root.setAttribute('data-theme', theme);
  labelThemeButtons(currentLang);
}

themeBtns.forEach(btn => btn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next, true);
  themeSaved = true;
  try { localStorage.setItem('theme', next); } catch (e) {}
}));

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!themeSaved) setTheme(e.matches ? 'dark' : 'light', true);
});

langHooks.push(labelThemeButtons);
labelThemeButtons(currentLang);
