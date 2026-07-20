// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('nav ul');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      navList.classList.toggle('open');
    });

    // Close nav when clicking a link
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('open');
      });
    });
  }

  // Shrink the header (and logo) once the page is scrolled
  var header = document.querySelector('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Set active nav link based on current page
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Vote splash pop-up (home page) — show once per browser session
  var splash = document.getElementById('voteSplash');
  if (splash) {
    var closeSplash = function () {
      splash.setAttribute('hidden', '');
      document.body.style.overflow = '';
    };

    if (!sessionStorage.getItem('voteSplashSeen')) {
      // Wait 3 seconds after landing before showing the pop-up
      setTimeout(function () {
        splash.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('voteSplashSeen', '1');
      }, 3000);
    }

    var splashCloseBtn = document.getElementById('voteSplashClose');
    var splashDismissBtn = document.getElementById('voteSplashDismiss');
    if (splashCloseBtn) splashCloseBtn.addEventListener('click', closeSplash);
    if (splashDismissBtn) splashDismissBtn.addEventListener('click', closeSplash);

    // Close when clicking the dark overlay (but not the modal itself)
    splash.addEventListener('click', function (e) {
      if (e.target === splash) closeSplash();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !splash.hasAttribute('hidden')) closeSplash();
    });
  }

  // Project page tabs
  var projectTabs = document.querySelectorAll('.project-tab');
  if (projectTabs.length) {
    var activateTab = function (name) {
      projectTabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-tab') === name;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      document.querySelectorAll('.project-panel').forEach(function (panel) {
        if (panel.id === 'tab-' + name) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    };

    projectTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateTab(tab.getAttribute('data-tab'));
      });
    });

    // Deep links: #updates / #designs or #tab-past open the right tab
    var hash = window.location.hash;
    if (hash === '#tab-past') {
      activateTab('past');
    } else if (hash === '#vote' || hash === '#designs' || hash === '#updates') {
      activateTab('new');
      var target = document.getElementById(hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
    }
  }

  // Show success message if form was submitted
  if (window.location.search.indexOf('submitted=true') !== -1) {
    var banner = document.createElement('div');
    banner.style.cssText = 'background:#27ae60;color:#fff;text-align:center;padding:16px 20px;font-weight:700;font-size:1.05rem;';
    banner.textContent = 'Your submission has been received. Thank you!';
    document.body.insertBefore(banner, document.body.firstChild);
    window.history.replaceState({}, '', window.location.pathname);
  }
});
