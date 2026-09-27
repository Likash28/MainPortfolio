(function () {
  var root = document.documentElement;
  var THEME_KEY = 'theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  var navbar = document.getElementById('navbar');
  var menuToggle = document.getElementById('menu-toggle');
  var mobileQuery = window.matchMedia('(max-width: 880px)');

  function syncNavInert() {
    if (!navbar) return;
    var isOpen = navbar.classList.contains('nav-open');
    navbar.toggleAttribute('inert', mobileQuery.matches && !isOpen);
  }
  syncNavInert();
  mobileQuery.addEventListener('change', syncNavInert);

  function closeNav() {
    if (!navbar || !menuToggle) return;
    navbar.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    syncNavInert();
  }

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      syncNavInert();
    });

    navbar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', function (event) {
      if (!navbar.classList.contains('nav-open')) return;
      if (navbar.contains(event.target) || menuToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener('resize', function () {
      if (!mobileQuery.matches) closeNav();
    });
  }

  var header = document.getElementById('site-header');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);

    var scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    var currentId = sections.length ? sections[0].id : null;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var revealTargets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
