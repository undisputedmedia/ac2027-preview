/* AC2027 SoCal - Wix custom elements (design pieces only).
   Text that crawlers must read lives in native Wix text, not here.
   Wix: Add > Embed Code > Custom Element > Server URL =
   https://undisputedmedia.github.io/ac2027-preview/wix/ac-elements.js
   Tags: ac-header, ac-ratecard, ac-buttons, ac-hero-bg, ac-footer-links
   Keep this file ASCII-only (use \u escapes) so it renders the same under any charset. */
(function () {
  var ROOT = 'https://undisputedmedia.github.io/ac2027-preview/';
  if (!document.getElementById('ac-fonts')) {
    var f = [['Oswald', 500], ['Oswald', 600], ['Poppins', 400], ['Poppins', 500], ['GreatVibes', 400]]
      .map(function (x) { return "@font-face{font-family:'" + x[0] + "';font-weight:" + x[1] +
        ";font-display:swap;src:url(" + ROOT + 'fonts/' + x[0] + '-' + x[1] + ".woff2) format('woff2')}"; }).join('');
    var s = document.createElement('style'); s.id = 'ac-fonts'; s.textContent = f;
    document.head.appendChild(s);
  }
  var PASSKEY = 'https://book.passkey.com/go/2027SoCalAntiochianArchdiocese';
  var NAVY = '#0D0745', SHORE = '#FAF8F5', GOLD = '#FDCE3E', MAROON = '#90294F';
  var NDASH = '\u2013', MIDDOT = '\u00b7', MDASH = '\u2014';
  var BASE = ':host{display:block;font-family:Poppins,Arial,sans-serif;color:' + NAVY + ';box-sizing:border-box}*{box-sizing:border-box}' +
    '.btn{display:inline-block;font-family:Oswald,sans-serif;font-weight:500;font-size:15px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:16px 34px;border-radius:999px;line-height:1.2;text-align:center}' +
    '.navy{background:' + NAVY + ';color:' + SHORE + '}.gold{background:' + GOLD + ';color:' + NAVY + '}' +
    '.outline{color:' + NAVY + ';box-shadow:inset 0 0 0 1.5px rgba(13,7,69,.28)}.outline-w{color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6)}.white{background:#fff;color:' + NAVY + ';box-shadow:0 10px 15px -3px rgba(0,0,0,.12)}' +
    '.btn:hover{filter:brightness(.95)}';
  var HOOKS = {};
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function define(name, render, attrs) {
    if (customElements.get(name)) return;
    customElements.define(name, class extends HTMLElement {
      static get observedAttributes() { return attrs || []; }
      connectedCallback() { this.draw(); }
      attributeChangedCallback() { if (this.shadowRoot) this.draw(); }
      draw() {
        var r = this.shadowRoot || this.attachShadow({ mode: 'open' });
        r.innerHTML = render(this);
        if (HOOKS[name]) HOOKS[name](r);
      }
    });
  }

  /* header: logo, nav, Book Room. attribute current="/hotel" */
  var NAV = [['/', 'Home'], ['/about', 'About'], ['/hotel', 'Hotel'], ['/registration', 'Registration'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
  HOOKS['ac-header'] = function (r) {
    var b = r.querySelector('.tog'), bar = r.querySelector('.bar');
    b.addEventListener('click', function () {
      var o = bar.classList.toggle('open');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
      b.textContent = o ? 'Close' : 'Menu';
    });
  };
  define('ac-header', function (el) {
    var cur = el.getAttribute('current') || '';
    var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === cur ? ' class="cur"' : '') + '>' + n[1] + '</a>'; }).join('');
    return '<style>' + BASE +
      ':host{background:' + SHORE + '}.bar{height:76px;display:flex;align-items:center;gap:20px;padding:0 4px}' +
      '.mark{height:54px;width:auto;display:block}.bt{line-height:1.15;text-decoration:none;color:' + NAVY + '}' +
      '.l1{font-family:Oswald,sans-serif;font-weight:500;font-size:15px;letter-spacing:.13em;text-transform:uppercase}' +
      '.l2{font-size:11px;letter-spacing:.05em;color:rgba(13,7,69,.58)}' +
      'nav{margin-left:auto;display:flex;gap:24px}' +
      'nav a{font-family:Oswald,sans-serif;font-size:14px;letter-spacing:.09em;text-transform:uppercase;text-decoration:none;color:' + NAVY + ';padding:6px 0;border-bottom:2px solid transparent;white-space:nowrap}' +
      'nav a:hover,nav a.cur{border-bottom-color:' + MAROON + '}.cta{font-size:13px;padding:10px 20px;white-space:nowrap}' +
      '.tog{display:none;margin-left:auto;font-family:Oswald,sans-serif;font-size:13px;letter-spacing:.09em;text-transform:uppercase;background:none;border:1px solid rgba(13,7,69,.28);color:' + NAVY + ';padding:9px 16px;border-radius:999px;cursor:pointer}' +
      '@media(max-width:900px){nav{display:none}.tog{display:block}.l2{display:none}.cta{font-size:11px;padding:9px 14px}' +
      '.open nav{display:flex;flex-direction:column;gap:0;position:fixed;left:0;right:0;top:76px;background:' + SHORE + ';padding:6px 22px 14px;border-bottom:1px solid rgba(13,7,69,.13);box-shadow:0 18px 30px -22px rgba(13,7,69,.4);z-index:50}' +
      '.open nav a{padding:13px 0;border-bottom:1px solid rgba(13,7,69,.13)}}</style>' +
      '<div class="bar"><a href="/"><img class="mark" src="' + ROOT + 'img/mark.png" alt="58th Biennial Antiochian Archdiocese Convention ' + MDASH + ' SoCal"></a>' +
      '<a class="bt" href="/"><div class="l1">AC2027 SoCal</div><div class="l2">July 19' + NDASH + '25, 2027 ' + MIDDOT + ' Anaheim, California</div></a>' +
      '<nav>' + links + '</nav><button class="tog" aria-expanded="false">Menu</button>' +
      '<a class="btn navy cta" href="/hotel">Book Room</a></div>';
  }, ['current']);

  /* rate card */
  define('ac-ratecard', function () {
    return '<style>' + BASE + '.card{background:' + SHORE + ';border-radius:16px;padding:30px}' +
      '.rate{font-family:Oswald,sans-serif;font-weight:600;font-size:56px;line-height:1;color:' + MAROON + ';margin:0}' +
      '.per{font-family:Oswald,sans-serif;font-weight:500;font-size:16px;letter-spacing:.09em;color:rgba(13,7,69,.58);text-transform:uppercase;margin:8px 0 0}' +
      'ul{list-style:none;padding:0;margin:24px 0 26px}' +
      'li{font-size:13px;color:rgba(13,7,69,.58);padding:9px 0;border-bottom:1px solid rgba(13,7,69,.13);display:flex;justify-content:space-between;gap:16px}' +
      'li:last-child{border-bottom:none}b{font-weight:500;color:' + NAVY + ';text-align:right}.btn{display:block}' +
      '@media(max-width:600px){.rate{font-size:46px}.card{padding:24px}}</style>' +
      '<div class="card"><p class="rate">$209</p><p class="per">per night</p><ul>' +
      '<li>Room types <b>King or two Queens</b></li><li>Block window <b>July 17' + NDASH + '25, 2027</b></li>' +
      '<li>Prepayment <b>Optional</b></li><li>Group booking <b>Multiple rooms, one booking</b></li></ul>' +
      '<a class="btn gold" href="' + PASSKEY + '">Reserve Your Room</a></div>';
  });

  /* buttons: items="Label|url;Label|url" (url PASSKEY = hotel link) styles="navy,outline" align="left|center" */
  define('ac-buttons', function (el) {
    var items = (el.getAttribute('items') || 'Reserve Your Room|PASSKEY;Get Notified|/get-notified').split(';');
    var styles = (el.getAttribute('styles') || 'navy,outline').split(',');
    var align = el.getAttribute('align') === 'left' ? 'flex-start' : 'center';
    var html = items.map(function (it, i) {
      var p = it.split('|'); var url = p[1] === 'PASSKEY' ? PASSKEY : p[1];
      return '<a class="btn ' + esc(styles[i] || 'navy') + '" href="' + esc(url) + '">' + esc(p[0]) + '</a>';
    }).join('');
    return '<style>' + BASE + '.row{display:flex;gap:13px;flex-wrap:wrap;justify-content:' + align + '}' +
      '@media(max-width:600px){.btn{width:100%}}</style><div class="row">' + html + '</div>';
  }, ['items', 'styles', 'align']);

  /* hero background: photo, sunset wash, mark and script line. Decorative only:
     the H1, descriptor and note sit on top as native Wix text. Stretch it to the section.
     variant="band": photo with a navy scrim only (the home page's mid-page band).
     variant="gradient": the sunset gradient only (the home page's signup section). */
  /* The element has no content height of its own. In the Wix editor it renders inside its own
     preview iframe and Wix grows the element to fit the iframe's content, so there the host is
     0px tall and the layers are position:fixed (they fill the iframe, i.e. the element's box).
     On the live page it fills its wrapper; if the wrapper gives no height, use the parent's. */
  var FRAMED = false;
  try { FRAMED = window.self !== window.top; } catch (e) { FRAMED = true; }
  HOOKS['ac-hero-bg'] = function (r) {
    var h = r.host;
    if (FRAMED) return;
    function fit() {
      h.style.height = '';
      if (h.clientHeight < 10 && h.parentElement && h.parentElement.clientHeight > 10) {
        h.style.height = h.parentElement.clientHeight + 'px';
      }
    }
    fit();
    if (!h._acFit) { h._acFit = true; window.addEventListener('resize', fit); setTimeout(fit, 300); }
  };
  define('ac-hero-bg', function (el) {
    var v = el.getAttribute('variant'), band = v === 'band', grad = v === 'gradient';
    var pos = FRAMED ? 'fixed' : 'absolute';
    var host = FRAMED ? ':host{display:block;height:0;overflow:visible}' :
      ':host{display:block;position:relative;overflow:hidden;height:100%;min-height:100%}';
    var layer = '{position:' + pos + ';top:0;left:0;right:0;bottom:0;width:100%;height:100%}';
    if (grad) {
      return '<style>' + host + '.g' + layer + '.g{background:linear-gradient(180deg,#FDCE3E 0%,#FDA04D 34%,#FB5063 67%,#AB284A 100%)}</style><div class="g"></div>';
    }
    var wash = band ? 'linear-gradient(180deg,rgba(13,7,69,0) 30%,rgba(13,7,69,.72) 100%)' :
      'linear-gradient(180deg,rgba(253,236,226,.94) 0%,rgba(252,212,188,.80) 9%,rgba(251,199,168,.62) 18%,' +
      'rgba(250,190,152,.52) 28%,rgba(250,172,136,.54) 42%,rgba(244,133,105,.62) 58%,rgba(198,74,80,.74) 72%,' +
      'rgba(150,48,70,.86) 86%,rgba(125,38,65,.94) 100%)';
    return '<style>' + host +
      '.bg' + layer + '.bg{object-fit:cover}' +
      '.wash' + layer + '.wash{background:' + wash + '}' +
      '.top{position:' + pos + ';left:0;right:0;top:44px;text-align:center}' +
      '.mark{width:150px;height:auto;display:block;margin:0 auto 10px}' +
      '.script{font-family:GreatVibes,cursive;color:#fff;font-size:54px;line-height:1.2;margin:0;text-shadow:0 2px 14px rgba(120,40,60,.28)}' +
      '@media(max-width:900px){.script{display:none}.mark{width:112px}}</style>' +
      '<img class="bg" src="' + ROOT + 'img/sunset.jpg" alt=""><div class="wash"></div>' +
      (band ? '' : '<div class="top"><img class="mark" src="' + ROOT + 'img/mark.png" alt=""><p class="script">Southern California is calling.</p></div>');
  }, ['variant']);

  /* footer links (the canonical facts block stays native text beside it) */
  define('ac-footer-links', function () {
    var pages = [['/', 'Home'], ['/about', 'About the Convention'], ['/hotel', 'Hotel &amp; Room Block'], ['/registration', 'Registration'],
      ['/schedule', 'Schedule'], ['/faq', 'FAQ'], ['/host-parish', 'Host Parish'], ['/contact', 'Contact']];
    var social = [['https://instagram.com/ac2027socal', 'Instagram'], ['https://facebook.com/ac2027socal', 'Facebook'], ['https://youtube.com/@ac2027socal', 'YouTube'], ['https://x.com/ac2027socal', 'X'], ['https://www.tiktok.com/@ac2027socal', 'TikTok']];
    function col(t, list) {
      return '<div><h4>' + t + '</h4><ul>' + list.map(function (l) { return '<li><a href="' + l[0] + '">' + l[1] + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<style>' + BASE + '.g{display:grid;grid-template-columns:1fr 1fr;gap:34px}' +
      'h4{font-family:Oswald,sans-serif;font-weight:500;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 16px}' +
      'ul{list-style:none;padding:0;margin:0}li{margin-bottom:10px;font-size:14px}' +
      'a{color:rgba(250,248,245,.86);text-decoration:none}a:hover{color:' + GOLD + '}' +
      '@media(max-width:400px){.g{grid-template-columns:1fr}}</style>' +
      '<div class="g">' + col('Pages', pages) + col('Follow Us', social) + '</div>';
  });
})();
