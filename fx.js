// premium motion engine: ripple, 3D text, tilt, magnetic, wipe, reveal
// deep-link spotlight: bot links land on page#id — glow that section
(function () {
  function fire() {
    const id = location.hash.slice(1); if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('spot'); void el.offsetWidth; el.classList.add('spot');
    setTimeout(() => el.classList.remove('spot'), 3600);
  }
  window.addEventListener('load', () => setTimeout(fire, 400));
  window.addEventListener('hashchange', fire);
})();
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  b.classList.remove('clicked'); void b.offsetWidth; b.classList.add('clicked');
});
// 3D char-split headings
function split3d(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const words = el.textContent.split(' ');
  el.textContent = '';
  let i = 0;
  words.forEach((w, wi) => {
    [...w].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = ch;
      s.style.animationDelay = (i++ * 0.022) + 's';
      el.appendChild(s);
    });
    if (wi < words.length - 1) { const sp = document.createElement('span'); sp.className = 'sp'; sp.textContent = ' '; el.appendChild(sp); }
  });
}
function reveal3d() {
  // h1 is above the fold — animate immediately, never wait
  document.querySelectorAll('.hero h1').forEach(split3d);
  const els = document.querySelectorAll('section h2');
  const fire = el => { if (!el.dataset.split) split3d(el); };
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { fire(x.target); io.unobserve(x.target); }
  }), { threshold: 0.2 });
  els.forEach(el => io.observe(el));
  setTimeout(() => els.forEach(fire), 1200);
}
// scroll reveal + stagger
function reveal() {
  const els = document.querySelectorAll('.card, .botHi, .hero3d');
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('vis'); io.unobserve(x.target); }
  }), { threshold: 0.08 });
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = ((i % 4) * 0.07) + 's';
    io.observe(el);
  });
  // safety: never leave content hidden if observer stalls
  setTimeout(() => els.forEach(el => el.classList.add('vis')), 1500);
}
// 3D tilt cards
function tilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateY(-4px)`;
      c.style.setProperty('--mx', (px * 100) + '%');
      c.style.setProperty('--my', (py * 100) + '%');
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
}
// magnetic buttons
function magnetic() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('button').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.08}px ${(e.clientY - r.top - r.height / 2) * 0.12}px`;
    });
    b.addEventListener('pointerleave', () => { b.style.translate = ''; });
  });
}
// cinematic 3D page transition: outgoing tilts away, panels sweep, destination revealed
function wipe() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const names = { 'index': 'Home', 'predict': 'Predictor', 'market': 'Marketplace', 'dealers': 'Dealers', 'calc': 'Calculators' };
  const w = document.createElement('div');
  w.id = 'wipe';
  w.innerHTML = '<div class="panel p1"></div><div class="panel p2"></div><div class="panel p3"></div><div class="wipe-label"><span></span></div>';
  document.body.appendChild(w);
  const label = w.querySelector('.wipe-label span');
  document.querySelectorAll('a[href*=".html"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      const f = href.split('#')[0].replace('.html', '').split('/').pop();
      label.textContent = names[f] || 'Smart Property Analyser';
      document.body.classList.add('page-out');
      w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
      setTimeout(() => { window.location.href = href; }, 640);
    });
  });
}
document.addEventListener('DOMContentLoaded', () => { reveal3d(); reveal(); tilt(); magnetic(); wipe(); });
