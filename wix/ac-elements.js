/* AC2027 SoCal - Wix custom elements (design pieces only).
   Text that crawlers must read lives in native Wix text, not here.
   Wix: Add > Embed Code > Custom Element > Server URL =
   https://undisputedmedia.github.io/ac2027-preview/wix/ac-elements.js
   Tags: ac-header, ac-ratecard, ac-buttons, ac-hero-bg, ac-footer-links, ac-journal-samples
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
  /* Click tracking. Links live inside shadow DOM, where GA4 enhanced measurement,
     GTM link triggers and Meta's Event Setup Tool cannot see them, so the
     elements report their own outbound clicks. Distinct event names, so nothing
     double-counts if a tag ever does see through the shadow root:
       hotel_block_click  -> book.passkey.com            (GA4 key event; Meta HotelBlockClick)
       chms_form_click    -> *.churchofficechms.com      (sponsor, journal, volunteer, donate)
       registration_click -> REG_HOST, once registration opens
       outbound_link      -> any other external link (social etc.)
     Every click is also pushed to dataLayer as event "ac_link_click" for GTM. */
  var REG_HOST = '';
  function track(a, el) {
    var u; try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (!/^https?:$/.test(u.protocol) || u.hostname === location.hostname) return;
    var h = u.hostname, ev = /(^|\.)passkey\.com$/.test(h) ? 'hotel_block_click'
      : /(^|\.)churchofficechms\.com$/.test(h) ? 'chms_form_click'
      : (REG_HOST && h === REG_HOST) ? 'registration_click' : 'outbound_link';
    var p = { link_url: u.origin + u.pathname, link_domain: h, link_text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
      ac_element: el, page_path: location.pathname, transport_type: 'beacon' };
    try { if (typeof window.gtag === 'function') window.gtag('event', ev, p); } catch (e) {}
    try { if (typeof window.fbq === 'function' && ev === 'hotel_block_click') window.fbq('trackCustom', 'HotelBlockClick', { page_path: p.page_path }); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'ac_link_click', ac_event: ev, link_url: p.link_url, link_domain: h, link_text: p.link_text, ac_element: el }); } catch (e) {}
  }
  function define(name, render, attrs) {
    if (customElements.get(name)) return;
    customElements.define(name, class extends HTMLElement {
      static get observedAttributes() { return attrs || []; }
      connectedCallback() { this.draw(); }
      attributeChangedCallback() { if (this.shadowRoot) this.draw(); }
      draw() {
        var r = this.shadowRoot || this.attachShadow({ mode: 'open' });
        r.innerHTML = render(this);
        if (!r._acTrack) {
          r._acTrack = true;
          r.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (a) track(a, name);
          });
        }
        if (HOOKS[name]) HOOKS[name](r);
      }
    });
  }

  /* header: logo, nav, Book Room. attribute current="/hotel" */
  var NAV = [['/', 'Home'], ['/about', 'About'], ['/hotel', 'Hotel'], ['/registration', 'Registration'], ['/sponsorships', 'Sponsors'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
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

  /* journal samples: three to-scale mock journal pages (7.5 x 10 in) showing every ad size.
     Decorative/illustrative only; the rate card stays native Wix text. */
  define('ac-journal-samples', function () {
    var CROSS = '<svg viewBox="0 0 20 32" width="1em" height="1.6em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 2v28M6 7h8M3 13h14M6 23l8-3"/></svg>', RQ = '\u2033', X = '\u00d7';
    var LINE = '<span class="ln"></span>';
    function cap(t, s, p) { return '<figcaption><b>' + t + '</b><span>' + s + '</span><em>' + p + '</em></figcaption>'; }
    var full = '<div class="pg"><div class="ad full"><div class="frame">' +
      '<div class="cr">' + CROSS + '</div><div class="k">In loving memory</div>' +
      '<div class="nm">Name of your loved one</div><div class="yr">Dates</div>' +
      '<div class="me">Memory Eternal</div>' + LINE + '<div class="fr">With love, the family</div>' +
      '</div></div></div>';
    var mixed = '<div class="pg mix">' +
      '<div class="ad half"><div class="biz"><div class="k">Your business</div><div class="nm s">Business Name</div>' +
      '<div class="tg">A short line about what you do</div><div class="ct">phone ' + MIDDOT + ' website ' + MIDDOT + ' city</div></div><i>Half page</i></div>' +
      '<div class="bot"><div class="ad qtr"><div class="par"><div class="cr s">' + CROSS + '</div><div class="k">Greetings from</div>' +
      '<div class="nm s">Your Parish</div><div class="tg">City, State</div></div><i>Quarter</i></div>' +
      '<div class="rc"><div class="ad eig"><div class="k">Congratulations</div><div class="tg">to a graduate, a couple, a milestone</div><i>Eighth</i></div>' +
      '<div class="cards"><div class="ad bc">Card</div><div class="ad bc">Card</div><div class="ad bc">Card</div><div class="ad bc">Card</div></div>' +
      '</div></div></div>';
    var rows = ''; for (var i = 0; i < 14; i++) { rows += '<div class="nl">' + (i % 3 === 0 ? 'In honor of' : (i % 3 === 1 ? 'In memory of' : 'The family of')) + ' ' + LINE + '</div>'; }
    var names = '<div class="pg"><div class="ad lst"><div class="k c">Name listings</div><div class="cols">' + rows + rows + '</div></div></div>';
    return '<style>' + BASE +
      '.g{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;align-items:start}' +
      'figure{margin:0}.pg{aspect-ratio:3/4;background:#fff;border-radius:4px;box-shadow:0 18px 40px -22px rgba(13,7,69,.45),0 0 0 1px rgba(13,7,69,.08);padding:7%;display:flex;flex-direction:column}' +
      '.ad{position:relative;border:1.5px dashed rgba(144,41,79,.45);border-radius:3px;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}' +
      '.ad i{position:absolute;right:5px;bottom:3px;font-style:normal;font-family:Oswald,sans-serif;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:' + MAROON + ';opacity:.75}' +
      '.full{flex:1;border:none;background:' + NAVY + '}.frame{position:absolute;inset:6%;border:1px solid ' + GOLD + ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:' + SHORE + '}' +
      '.cr{font-size:18px;color:' + GOLD + ';line-height:1}.cr.s{font-size:12px;color:' + MAROON + '}' +
      '.k{font-family:Oswald,sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase}.full .k{color:' + GOLD + '}.k.c{color:' + MAROON + ';margin-bottom:8px}' +
      '.nm{font-family:GreatVibes,cursive;font-size:30px;line-height:1.1}.nm.s{font-size:20px;color:' + NAVY + '}' +
      '.yr{font-size:10px;letter-spacing:.1em;opacity:.7}.me{font-family:Oswald,sans-serif;font-size:13px;letter-spacing:.14em;text-transform:uppercase;margin-top:10px}' +
      '.ln{display:inline-block;width:40%;height:1px;background:currentColor;opacity:.35;vertical-align:middle}.full .ln{width:30%;margin:4px 0}' +
      '.fr{font-size:10px;opacity:.8}.tg{font-size:9px;color:rgba(13,7,69,.6);line-height:1.35;padding:0 6px}.ct{font-size:8px;letter-spacing:.06em;color:rgba(13,7,69,.5);margin-top:4px}' +
      '.mix{gap:4%}.half{flex:1;background:' + SHORE + '}.biz,.par{display:flex;flex-direction:column;align-items:center;gap:3px}.half .k,.qtr .k,.eig .k{color:' + MAROON + '}' +
      '.bot{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:4%}.qtr{background:' + SHORE + '}.rc{display:grid;grid-template-rows:1fr 1fr;gap:6%}' +
      '.eig{flex-direction:column;gap:3px;background:' + SHORE + '}.cards{display:grid;grid-template-columns:1fr 1fr;gap:5%}' +
      '.bc{font-family:Oswald,sans-serif;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:' + MAROON + ';background:' + SHORE + '}' +
      '.lst{flex:1;flex-direction:column;justify-content:flex-start;padding:7% 6%;border-style:solid;border-color:rgba(13,7,69,.1)}' +
      '.cols{columns:2;column-gap:10%;width:100%;text-align:left}.nl{font-size:8.5px;color:rgba(13,7,69,.65);padding:3px 0;white-space:nowrap;overflow:hidden}.nl .ln{width:45%}' +
      'figcaption{margin-top:16px;display:flex;flex-direction:column;gap:2px}figcaption b{font-family:Oswald,sans-serif;font-weight:500;font-size:15px;letter-spacing:.06em;text-transform:uppercase}' +
      'figcaption span{font-size:13px;color:rgba(13,7,69,.6)}figcaption em{font-style:normal;font-size:13px;color:' + MAROON + ';font-weight:500}' +
      '.note{grid-column:1/-1;font-size:12px;color:rgba(13,7,69,.55);text-align:center;margin-top:4px}' +
      '@media(max-width:760px){.g{grid-template-columns:1fr;max-width:360px;margin:0 auto}}</style>' +
      '<div class="g">' +
      '<figure>' + full + cap('Full page', 'Color or greyscale, 7.5' + RQ + ' ' + X + ' 10' + RQ, 'From $350') + '</figure>' +
      '<figure>' + mixed + cap('Partial pages', 'Half, quarter, eighth and business card', 'From $150') + '</figure>' +
      '<figure>' + names + cap('Name listing', 'Your name in the journal, no artwork needed', '$100') + '</figure>' +
      '<p class="note">Sample layouts, drawn to proportion. Names and businesses shown are placeholders.</p></div>';
  });

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
    var involved = [['/sponsorships', 'Sponsorships'], ['/journal', 'Legacy Journal'], ['/vendors', 'Vendors'], ['/volunteer', 'Volunteer'],
      ['https://saintandrew.churchofficechms.com/external/form/fceb608b-be91-4ab0-9638-38cae4ff47f7', 'Support the Convention']];
    var social = [['https://instagram.com/ac2027socal', 'Instagram'], ['https://facebook.com/ac2027socal', 'Facebook'], ['https://youtube.com/@ac2027socal', 'YouTube'], ['https://x.com/ac2027socal', 'X'], ['https://www.tiktok.com/@ac2027socal', 'TikTok']];
    function col(t, list) {
      return '<div><h4>' + t + '</h4><ul>' + list.map(function (l) { return '<li><a href="' + l[0] + '">' + l[1] + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<style>' + BASE + '.g{display:grid;grid-template-columns:1fr 1fr;gap:34px}' +
      'h4{font-family:Oswald,sans-serif;font-weight:500;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 16px}' +
      'ul{list-style:none;padding:0;margin:0}li{margin-bottom:10px;font-size:14px}' +
      'a{color:rgba(250,248,245,.86);text-decoration:none}a:hover{color:' + GOLD + '}' +
      '.c2>div+div{margin-top:26px}' +
      '@media(max-width:400px){.g{grid-template-columns:1fr}}</style>' +
      '<div class="g">' + col('Pages', pages) + '<div class="c2">' + col('Get Involved', involved) + col('Follow Us', social) + '</div></div>';
  });
})();
