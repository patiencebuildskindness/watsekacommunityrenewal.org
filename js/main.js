// Tree sponsorship tracker: update TREES_SPONSORED as checks come in.
// Every .tree-tracker on the site (pop-up, home page, Projects page) reads these.
var TREE_GOAL = 14;
var TREES_SPONSORED = 14;

// Engraved paver wall: add each paid paver here, one string per engraved line
// (up to 3 lines, 20 characters each), and it appears on a brick in the home
// page pop-up. Example: ['THE SMITH FAMILY', 'WATSEKA', 'EST. 1965'],
var PAVERS = [
];

// Sample bricks, shown only when the page URL ends in ?paverdemo
var PAVER_DEMO = [
  ['THE SMITH FAMILY', 'WATSEKA, IL'],
  ['IN LOVING MEMORY OF', 'JOHN AND JANE DOE', '1942 - 2019'],
  ['GO WARRIORS!'],
  ['MARY & TOM', 'MARRIED 1988'],
  ['WATSEKA', 'CLASS OF 1975'],
  ['FOR GRANDMA ROSE', 'WITH LOVE'],
  ['THE JOHNSONS'],
  ['HUBBARD TRAIL', 'FOREVER']
];

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

  // Draw the tree tracker: one arborvitae per tree, green once sponsored
  var trackers = document.querySelectorAll('.tree-tracker');
  if (trackers.length) {
    var sponsored = Math.max(0, Math.min(TREES_SPONSORED, TREE_GOAL));
    var left = TREE_GOAL - sponsored;
    var treeSvg = function (isSponsored, i) {
      return '<svg class="tree-icon' + (isSponsored ? ' sponsored' : '') + '"' +
        (isSponsored ? ' style="animation-delay:' + (i * 0.08) + 's"' : '') +
        ' viewBox="0 0 24 48" aria-hidden="true" focusable="false">' +
        '<rect class="trunk" x="10.5" y="41" width="3" height="7" rx="1"/>' +
        '<path class="foliage" d="M12 1C8.5 7 5.5 15 5 25c-.4 7 1 12.5 3.2 15 1.2 1.3 2.4 1.8 3.8 1.8s2.6-.5 3.8-1.8C18 37.5 19.4 32 19 25 18.5 15 15.5 7 12 1z"/>' +
        '<path class="shade" d="M12 6v33M9 14c1 2 2 3 3 3.5M15 14c-1 2-2 3-3 3.5M8 22c1.5 2.5 2.8 3.5 4 4M16 22c-1.5 2.5-2.8 3.5-4 4M8 31c1.5 2 2.8 3 4 3.5M16 31c-1.5 2-2.8 3-4 3.5"/>' +
        '</svg>';
    };
    var rowHtml = '';
    for (var t = 0; t < TREE_GOAL; t++) rowHtml += treeSvg(t < sponsored, t);

    var note = left === 0
      ? 'Every tree is sponsored. Thank you, Watseka!'
      : left === 1
        ? 'Just 1 tree left to sponsor!'
        : left + ' trees left to sponsor. Every sponsorship helps!';

    trackers.forEach(function (el) {
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', sponsored + ' of ' + TREE_GOAL + ' trees sponsored');
      el.innerHTML =
        '<p class="tree-tracker-count"><strong>' + sponsored + '</strong> of ' + TREE_GOAL + ' trees sponsored</p>' +
        '<p class="tree-tracker-note">' + note + '</p>' +
        '<div class="tree-row">' + rowHtml + '</div>';
    });
  }

  // Draw the paver wall: running-bond rows of bricks, engraved ones first,
  // then blank bricks waiting for a name. The wall always shows a few blanks.
  var walls = document.querySelectorAll('.paver-wall');
  if (walls.length) {
    var pavers = /[?&]paverdemo\b/.test(window.location.search) ? PAVER_DEMO : PAVERS;
    // Show every engraved brick plus at least 3 blanks, and at least 4 rows.
    // Phones get 2 bricks per row so a full 20-character line stays readable.
    var wide = window.matchMedia('(min-width: 560px)').matches ? 3 : 2;
    var needed = pavers.length + 3;
    var escapeHtml = function (text) {
      return String(text).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };
    var brick = function (i) {
      var delay = 'animation-delay:' + (i * 0.06).toFixed(2) + 's';
      var lines = pavers[i];
      if (lines) {
        var text = lines.map(function (line) {
          return '<span>' + escapeHtml(line) + '</span>';
        }).join('');
        return '<div class="paver engraved" style="' + delay + '">' +
          '<div class="paver-text" style="animation-delay:' + (0.6 + i * 0.12).toFixed(2) + 's">' + text + '</div></div>';
      }
      var invite = i === pavers.length ? '<div class="paver-text paver-invite"><span>Your name</span><span>here?</span></div>' : '';
      return '<div class="paver" style="' + delay + '" aria-hidden="true">' + invite + '</div>';
    };
    // Running bond: rows alternate full bricks and half + one fewer + half
    var html = '';
    var placed = 0;
    for (var r = 0; placed < needed || r < 4; r++) {
      var offset = r % 2 === 1;
      var perRow = offset ? wide - 1 : wide;
      html += '<div class="paver-row">';
      if (offset) html += '<div class="paver half" aria-hidden="true"></div>';
      for (var b = 0; b < perRow; b++) html += brick(placed++);
      if (offset) html += '<div class="paver half" aria-hidden="true"></div>';
      html += '</div>';
    }
    var countText = pavers.length === 0
      ? 'Be the first name on the wall!'
      : pavers.length === 1 ? '1 paver engraved so far' : pavers.length + ' pavers engraved so far';
    walls.forEach(function (wall) {
      wall.setAttribute('role', 'img');
      wall.setAttribute('aria-label', pavers.length
        ? 'Virtual paver wall with ' + pavers.length + ' engraved bricks: ' + pavers.map(function (l) { return l.join(' '); }).join('; ')
        : 'Virtual paver wall of blank bricks waiting to be engraved');
      wall.innerHTML = '<div class="paver-bricks">' + html + '</div>' +
        '<p class="paver-count">' + countText + '</p>';
    });
  }

  // Paver order form: live brick preview and characters-left counters
  var previewText = document.querySelector('.paver-preview .paver-text');
  var paverLines = document.querySelectorAll('.paver-line');
  if (previewText && paverLines.length) {
    var updatePreview = function () {
      previewText.innerHTML = '';
      var any = false;
      paverLines.forEach(function (input) {
        var value = input.value.trim().toUpperCase();
        var count = document.querySelector('.char-count[data-for="' + input.id + '"]');
        if (count) {
          var left = input.maxLength - input.value.length;
          count.textContent = left + (left === 1 ? ' character left' : ' characters left');
          count.classList.toggle('low', left <= 3);
        }
        if (value) {
          any = true;
          var span = document.createElement('span');
          span.textContent = value;
          previewText.appendChild(span);
        }
      });
      if (!any) previewText.innerHTML = '<span>Your</span><span>inscription</span><span>here</span>';
      previewText.classList.toggle('placeholder', !any);
    };
    paverLines.forEach(function (input) { input.addEventListener('input', updatePreview); });
    updatePreview();
  }

  // Engraved paver pop-up (home page): show once per browser session.
  // Add a data-event-end date to the overlay to stop showing it after that date.
  var splash = document.getElementById('paverSplash');
  if (splash) {
    // No data-event-end means the pop-up never expires (new Date(null) would be 1970)
    var endAttr = splash.getAttribute('data-event-end');
    var eventEnd = endAttr ? new Date(endAttr) : null;
    var eventPassed = !!eventEnd && !isNaN(eventEnd) && new Date() > eventEnd;

    var closeSplash = function () {
      splash.setAttribute('hidden', '');
      document.body.style.overflow = '';
    };

    if (!eventPassed && !sessionStorage.getItem('paverSplashSeen')) {
      // Wait 3 seconds after landing before showing the pop-up
      setTimeout(function () {
        splash.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('paverSplashSeen', '1');
      }, 3000);
    }

    var splashCloseBtn = document.getElementById('paverSplashClose');
    var splashDismissBtn = document.getElementById('paverSplashDismiss');
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

    // Deep links: #tab-<name> opens that tab; any other #id opens the tab
    // containing it (e.g. #sponsor-a-tree, #designs, #updates) and scrolls to it
    var openFromHash = function () {
      var hash = window.location.hash;
      if (hash.indexOf('#tab-') === 0) {
        activateTab(hash.slice(5));
      } else if (hash.length > 1) {
        var target = document.getElementById(hash.slice(1));
        var panel = target && target.closest('.project-panel');
        if (panel) {
          activateTab(panel.id.slice(4));
          setTimeout(function () { target.scrollIntoView(); }, 50);
        }
      }
    };
    openFromHash();
    // Also handle in-page links like <a href="#sponsor-a-tree"> that point into a hidden tab
    window.addEventListener('hashchange', openFromHash);
  }

  // Forms with data-success submit in the background and swap in a thank-you
  // message (the element whose id is the data-success value) instead of
  // leaving the site for Formspree's page
  document.querySelectorAll('form[data-success]').forEach(function (form) {
    var thanks = document.getElementById(form.getAttribute('data-success'));
    var error = form.querySelector('.form-error');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (error) error.setAttribute('hidden', '');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Form submission failed');
        // Show the thank-you block that matches the chosen payment method
        var pay = form.querySelector('input[name="Payment Method"]:checked');
        if (pay) {
          thanks.querySelectorAll('[data-pay]').forEach(function (block) {
            if (block.getAttribute('data-pay') === pay.value) block.removeAttribute('hidden');
          });
          // Suggest a payment note, e.g. "Engraved Brick, THE SMITH FAMILY"
          var signName = form.querySelector('input[name="Name on Sign"], input[name="Line 1"]');
          var signNote = thanks.querySelector('.sign-note');
          if (signNote && signName && signName.value.trim()) {
            signNote.textContent = ', for example: ' + (signNote.getAttribute('data-prefix') || 'Tree Sponsorship') + ', ' + signName.value.trim();
          }
        }
        form.setAttribute('hidden', '');
        var intro = form.parentNode.querySelectorAll(':scope > h3, :scope > .form-note');
        intro.forEach(function (el) { el.setAttribute('hidden', ''); });
        thanks.removeAttribute('hidden');
        thanks.focus();
        thanks.scrollIntoView({ block: 'center' });
      }).catch(function () {
        if (error) error.removeAttribute('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      });
    });
  });

  // Show success message if form was submitted
  if (window.location.search.indexOf('submitted=true') !== -1) {
    var banner = document.createElement('div');
    banner.style.cssText = 'background:#27ae60;color:#fff;text-align:center;padding:16px 20px;font-weight:700;font-size:1.05rem;';
    banner.textContent = 'Your submission has been received. Thank you!';
    document.body.insertBefore(banner, document.body.firstChild);
    window.history.replaceState({}, '', window.location.pathname);
  }
});
