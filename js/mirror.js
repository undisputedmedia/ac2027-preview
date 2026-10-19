/* Mirror pages only: point links inside the Wix custom elements (shadow DOM) at the
   preview's own pages, or at the live page that will sit at that URL after cutover. */
(function () {
  var LIVE = 'https://www.ac2027socal.com/';
  var MAP = {
    '/': 'index.html', '/hotel': 'hotel.html', '/registration': 'registration.html', '/schedule': 'schedule.html',
    '/faq': 'faq.html', '/contact': 'contact.html', '/host-parish': 'host-parish.html', '/journal': 'journal.html',
    '/get-notified': 'get-notified.html',
    '/about': 'about.html', '/sponsorships': 'sponsorships.html',
    '/vendors': LIVE + 'copy-of-journal-sponsorships', '/volunteer': LIVE + 'volunteer'
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
    ['ac-header', 'ac-buttons', 'ac-ratecard', 'ac-footer-links'].forEach(function (t) { customElements.whenDefined(t).then(scan); });
  }
  window.addEventListener('load', scan);
  setTimeout(scan, 600);
})();
