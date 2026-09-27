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

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var contactForm = document.getElementById('contact-form');
  if (contactForm && window.emailjs) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (contactForm.querySelector('[name="website"]').value) {
        return; // honeypot filled in -> silently drop
      }

      emailjs.init('user_TTDmetQLYgWCLzHTDgqxm');
      emailjs.sendForm('contact_service', 'template_contact', '#contact-form').then(
        function () {
          contactForm.reset();
          alert('Message sent successfully!');
        },
        function (error) {
          console.error('EmailJS send failed:', error);
          alert('Message failed to send. Please try again.');
        }
      );
    });
  }

  function loadJSON(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) throw new Error('Failed to load ' + path + ': ' + response.status);
      return response.json();
    });
  }

  function observeNewReveals(container) {
    var els = container.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      els.forEach(function (el) {
        obs.observe(el);
      });
    } else {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  function renderSkills(skills) {
    var container = document.getElementById('skills-container');
    if (!container) return;
    var groups = {};
    skills.forEach(function (skill) {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    });

    var html = '';
    Object.keys(groups).forEach(function (category) {
      html += '<div class="skill-group reveal"><h3>' + category + '</h3><ul class="skill-pills">';
      groups[category].forEach(function (skill) {
        html += '<li>' + skill.name + '</li>';
      });
      html += '</ul></div>';
    });
    container.innerHTML = html;
    observeNewReveals(container);
  }

  loadJSON('./assets/data/skills.json').then(renderSkills).catch(function (err) {
    console.error(err);
    var el = document.getElementById('skills-container');
    if (el) el.innerHTML = '<p>Skills failed to load.</p>';
  });
})();
