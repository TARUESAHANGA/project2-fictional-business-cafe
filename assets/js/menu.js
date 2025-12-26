/* ===== MENU PAGE JS ===== */

/* 1. TABS (desktop + mobile) */
window.showSection = function (id) {
  // hide all sections
  document.querySelectorAll('.menu-section').forEach(sec => sec.classList.remove('active'));
  // remove active class from all tabs
  document.querySelectorAll('.menu-tab').forEach(tab => tab.classList.remove('active'));
  // show chosen section
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    // mark tab active
    const tab = document.querySelector(`.menu-tab[onclick="showSection('${id}')"]`);
    if (tab) tab.classList.add('active');
    // mobile: close any open sub-menus (if you reuse the tab bar)
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.sub-menu-1.open').forEach(sm => sm.classList.remove('open'));
    }
  }
};

/* 2. LANDING FROM OUTSIDE LINK  (#coffee, #tea …) */
(() => {
  const hash = location.hash.replace('#', '');
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* instant scroll (smooth will be done by CSS if wanted) */
  target.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'instant', block: 'start' });

  /* flash highlight */
  target.classList.add('land-highlight');
  setTimeout(() => target.classList.remove('land-highlight'), 1200);

  /* auto-open mobile collapsible block if target inside one */
  if (window.innerWidth <= 768) {
    const parent = target.closest('.sub-menu-1');
    if (parent) {
      parent.classList.add('open');
      parent.previousElementSibling?.setAttribute('aria-expanded', 'true');
    }
  }

  /* also switch the correct tab */
  showSection(hash);
})();

/* ---------- SUB-MENU LANDING + HIGHLIGHT ---------- */
(() => {
  if (!location.hash) return;                       // nothing to do
  const target = document.querySelector(location.hash);
  if (!target) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. instant scroll to target */
  target.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'instant', block: 'start' });

  /* 2. flash highlight */
  target.classList.add('land-highlight');
  setTimeout(() => target.classList.remove('land-highlight'), 1200);

  /* 3. mobile – open parent collapsible block */
  if (window.innerWidth <= 768) {
    const parent = target.closest('.sub-menu-1');   // your mobile dropdown container
    if (parent) {
      parent.classList.add('open');
      parent.previousElementSibling?.setAttribute('aria-expanded', 'true');
    }
  }
})();