(function () {
  'use strict';
  const nav = document.getElementById('topmenu');
  const toggle = document.getElementById('termix-menu-toggle');
  const close = document.getElementById('termix-menu-close');
  const backdrop = document.getElementById('termix-menu-backdrop');
  function setMenuOpen(open) {
    document.body.classList.toggle('termix-menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  }
  if (toggle) toggle.addEventListener('click', function () {
    setMenuOpen(!document.body.classList.contains('termix-menu-open'));
  });
  close?.addEventListener('click', function () { setMenuOpen(false); });
  backdrop?.addEventListener('click', function () { setMenuOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenuOpen(false);
  });
  if (!nav) return;
  const storageKey = 'termix.sidebar.collapsed';
  let collapsed;
  try {
    collapsed = new Set(JSON.parse(sessionStorage.getItem(storageKey) || '[]'));
  } catch (_) {
    collapsed = new Set();
  }
  function sectionKey(section) {
    const firstLink = section.querySelector('.dropdown-menu a[href]');
    return firstLink?.pathname.split('/').slice(0, 5).join('/') || section.querySelector('a.menu')?.textContent.trim();
  }
  function saveCollapsed() {
    try { sessionStorage.setItem(storageKey, JSON.stringify([...collapsed])); } catch (_) {}
  }
  function markCurrent() {
    const path = location.pathname.replace(/\/$/, '');
    nav.querySelectorAll('li.termix-current, li.termix-section-active').forEach(function (el) {
      el.classList.remove('termix-current', 'termix-section-active');
    });
    for (const link of nav.querySelectorAll('.dropdown-menu a[href]')) {
      if (link.pathname && link.pathname.replace(/\/$/, '') === path) {
        link.parentElement.classList.add('termix-current');
        link.closest('li.dropdown')?.classList.add('termix-section-active');
        link.setAttribute('aria-current', 'page');
        break;
      }
    }
    [...nav.children].forEach(function (section, index) {
      if (!section.matches('li.dropdown')) return;
      const heading = section.querySelector(':scope > a.menu');
      const submenu = section.querySelector(':scope > .dropdown-menu');
      if (!heading || !submenu) return;
      if (!submenu.id) submenu.id = 'termix-menu-section-' + index;
      heading.setAttribute('aria-controls', submenu.id);
      const isCollapsed = collapsed.has(sectionKey(section));
      section.classList.toggle('termix-collapsed', isCollapsed);
      heading.setAttribute('aria-expanded', String(!isCollapsed));
    });
  }
  new MutationObserver(markCurrent).observe(nav, { childList:true, subtree:true });
  markCurrent();
  nav.addEventListener('click', function (event) {
    const heading = event.target.closest('li.dropdown > a.menu');
    if (heading && nav.contains(heading)) {
      event.preventDefault();
      const section = heading.parentElement;
      const key = sectionKey(section);
      const isCollapsed = section.classList.toggle('termix-collapsed');
      heading.setAttribute('aria-expanded', String(!isCollapsed));
      if (key) {
        if (isCollapsed) collapsed.add(key);
        else collapsed.delete(key);
        saveCollapsed();
      }
      return;
    }
    if (event.target.closest('.dropdown-menu a[href]') && innerWidth <= 820) {
      setMenuOpen(false);
    }
  });
  nav.addEventListener('keydown', function (event) {
    if (event.key === ' ' && event.target.matches('li.dropdown > a.menu')) {
      event.preventDefault();
      event.target.click();
    }
  });
})();
