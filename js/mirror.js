/* Mirror pages only: point links inside the Wix custom elements (shadow DOM) at the
   preview's own pages, or at the live page that will sit at that URL after cutover. */
(function () {
  var LIVE = 'https://www.ac2027socal.com/';
  var MAP = {
    '/': 'index.html', '/hotel': 'hotel.html', '/registration': 'registration.html', '/schedule': 'schedule.html',
    '/faq': 'faq.html', '/contact': 'contact.html', '/host-parish': 'host-parish.html', '/journal': 'journal.html',
    '/get-notified': 'get-notified.html',
    '/about': 'about.html', '/sponsorships': 'sponsorships.html',
    '/vendors': 'vendors.html', '/volunteer': 'volunteer.html',
    '/guides': 'guides.html', '/first-timers-guide': 'first-timers-guide.html', '/travel': 'travel.html', '/anaheim': 'anaheim.html',
    '/riverside': 'riverside.html', '/convention-history': 'convention-history.html', '/antiochian-orthodox': 'antiochian-orthodox.html',
    '/privacy-policy': 'privacy.html'
  };
  function fix(root) {
    root.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (h && h.charAt(0) === '/' && !a._acFixed) {
        var base = h.split('#')[0].replace(/\/$/, '') || '/';
        var to = MAP[base] || (LIVE + base.replace(/^\//, ''));
        a.setAttribute('href', to);
        if (/^https?:/.test(to)) { a.target = '_blank'; a.rel = 'noopener'; }
        a._acFixed = true;
      } else if (/^https?:/.test(h || '')) { try { if (!/ac2027socal\.com$/.test(new URL(h).hostname)) { a.target = '_blank'; a.rel = 'noopener'; } } catch (e) {} }
    });
  }
  function scan() {
    document.querySelectorAll('*').forEach(function (el) {
      if (el.shadowRoot && /^AC-/.test(el.tagName)) {
        fix(el.shadowRoot);
        if (!el._acObs) {
          el._acObs = new MutationObserver(function () { fix(el.shadowRoot); });
          el._acObs.observe(el.shadowRoot, { childList: true, subtree: true });
        }
      }
    });
  }
  if (window.customElements && customElements.whenDefined) {
    ['ac-header', 'ac-buttons', 'ac-ratecard', 'ac-footer-links', 'ac-journal-book'].forEach(function (t) { customElements.whenDefined(t).then(scan); });
  }
  window.addEventListener('load', scan);
  setTimeout(scan, 600);
})();

/* Entrance motion, matching the Wix build: text blocks and design pieces float in as they scroll into view. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var skip = /^(AC-HEADER|AC-HERO-BG|AC-FOOTER-LINKS)$/;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('main > section').forEach(function (s) {
    if (s.querySelector('ac-footer-links')) return;
    var els = [].slice.call(s.querySelectorAll(':scope > .grid > .abs')).filter(function (el) {
      return !skip.test(el.tagName) && (el.classList.contains('txt') || /^AC-/.test(el.tagName));
    });
    els.sort(function (a, b) { return (a.offsetTop - b.offsetTop) || (a.offsetLeft - b.offsetLeft); });
    els.forEach(function (el, i) { el.classList.add('ac-anim'); el.style.transitionDelay = Math.min(i * 120, 480) + 'ms'; io.observe(el); });
  });
})();
