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

  // Set active nav link based on current page
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
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
