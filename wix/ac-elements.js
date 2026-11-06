/* AC2027 SoCal - Wix custom elements (design pieces only).
   Text that crawlers must read lives in native Wix text, not here.
   Wix: Add > Embed Code > Custom Element > Server URL =
   https://undisputedmedia.github.io/ac2027-preview/wix/ac-elements.js
   Tags: ac-header, ac-ratecard, ac-buttons, ac-hero-bg, ac-footer-links, ac-journal-samples, ac-journal-book
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
    '.btn{transition:transform .2s ease,box-shadow .2s ease,filter .2s ease}.btn:hover{filter:brightness(.95);transform:translateY(-2px)}' +
    '@media(prefers-reduced-motion:reduce){.btn{transition:none}.btn:hover{transform:none}}';
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
      '@media(max-width:420px){.bt{display:none}.bar{gap:12px}.mark{height:48px}}' +
      '.open nav{display:flex;flex-direction:column;gap:0;position:fixed;left:0;right:0;top:76px;background:' + SHORE + ';padding:6px 22px 14px;border-bottom:1px solid rgba(13,7,69,.13);box-shadow:0 18px 30px -22px rgba(13,7,69,.4);z-index:50}' +
      '.open nav a{padding:13px 0;border-bottom:1px solid rgba(13,7,69,.13)}}</style>' +
      '<div class="bar"><a href="/"><img class="mark" src="' + ROOT + 'img/mark-192.webp" width="192" height="199" decoding="async" alt="58th Biennial Antiochian Archdiocese Convention ' + MDASH + ' SoCal"></a>' +
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

  /* journal book: interactive mockup of the printed Legacy Journal. Pick a placement and it is
     drawn to scale (7.5 x 10 in live area per page) on an open spread, a cover, or the centerfold.
     Prices/specs mirror the rate card, which stays native Wix text on the page. */
  var JOURNAL_FORM = 'https://saintandrew.churchofficechms.com/external/form/fa262a4f-ad11-496d-83c1-01d8d8be8b4a';
  var JB = [ /* id, label, price, spec, w, h (in), where: front|back|ifc|ibc|center|right, tone, group */
    ['cf', 'Centerfold', 5000, 'Color', 7.5, 10, 'center', 'c', 'Premium placements'],
    ['bc', 'Back Cover', 3000, 'Color', 7.5, 10, 'back', 'c', 'Premium placements'],
    ['ifc', 'Inside Front Cover', 2500, 'Color', 7.5, 10, 'ifc', 'c', 'Premium placements'],
    ['ibc', 'Inside Back Cover', 2500, 'Color', 7.5, 10, 'ibc', 'c', 'Premium placements'],
    ['gold', 'Gold Page', 1500, 'Color', 7.5, 10, 'right', 'gold', 'Premium placements'],
    ['silver', 'Silver Page', 1000, 'Color', 7.5, 10, 'right', 'silver', 'Premium placements'],
    ['full', 'Full Page, Color', 750, 'Color', 7.5, 10, 'right', 'c', 'Full pages'],
    ['fullp', 'Full Page, Color (Churches & Depts.)', 500, 'Color', 7.5, 10, 'right', 'c', 'Full pages'],
    ['fullg', 'Full Page, Greyscale', 500, 'Greyscale', 7.5, 10, 'right', 'g', 'Full pages'],
    ['fullgp', 'Full Page, Greyscale (Churches & Depts.)', 350, 'Greyscale', 7.5, 10, 'right', 'g', 'Full pages'],
    ['half', 'Half Page', 300, 'Color', 7.5, 5, 'right', 'c', 'Partial pages'],
    ['qtr', 'Quarter Page', 200, 'Color', 3.75, 5, 'right', 'c', 'Partial pages'],
    ['eig', 'Eighth Page', 150, 'Color', 3.75, 2.5, 'right', 'c', 'Partial pages'],
    ['card', 'Business Card', 150, 'Color', 1.775, 1.25, 'right', 'c', 'Partial pages'],
    ['name', 'Name Listing', 100, 'No artwork required', 0, 0, 'right', 'c', 'Name listing']
  ];
  HOOKS['ac-journal-book'] = function (r) {
    var host = r.host;
    r.querySelectorAll('[data-id]').forEach(function (b) {
      b.addEventListener('click', function () { host.setAttribute('selected', b.getAttribute('data-id')); });
    });
  };
  define('ac-journal-book', function (el) {
    var RQ = '\u2033', X = '\u00d7', sel = el.getAttribute('selected') || 'full', cur = JB[0];
    JB.forEach(function (a) { if (a[0] === sel) cur = a; });
    var PW = 236, PH = PW * 4 / 3, S = (PW - 24) / 7.5; /* page box; 12px margin each side; px per inch */
    function inch(n) { return String(+n.toFixed(3)).replace(/^0\./, '.'); }
    function money(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function ad(a, label) {
      var w = a[4] * S, h = a[5] * S, cls = 'ad ' + a[7] + (a[4] === 7.5 && a[5] === 10 ? ' fullad' : '');
      var inner = a[7] === 'gold' || a[7] === 'silver' || a[4] === 7.5 && a[5] === 10 ?
        '<div class="fr"><div class="k">' + label + '</div><div class="nm">Your page</div><div class="ln"></div><div class="sm">Tribute ' + MIDDOT + ' greeting ' + MIDDOT + ' advertisement</div></div>' :
        (a[5] >= 2.5 ? '<div class="k">' + label + '</div>' : '');
      var chip = w >= 100 && h >= 60 ? '<span class="dw">' + inch(a[4]) + RQ + ' ' + X + ' ' + inch(a[5]) + RQ + '</span>' : '';
      return '<div class="' + cls + '" style="width:' + w + 'px;height:' + h + 'px">' + inner + chip + '</div>';
    }
    function filler(n) { var s = ''; for (var i = 0; i < n; i++) s += '<div class="tl" style="width:' + (60 + (i * 37) % 38) + '%"></div>'; return s; }
    function page(content, tag, extra) { return '<div class="pg ' + (extra || '') + '"><div class="live">' + content + '</div><div class="tag">' + tag + '</div></div>'; }
    var stage, where = cur[6], caption = '';
    var plain = filler(14);
    if (where === 'back' ) {
      stage = '<div class="covers"><div class="pg cover front"><img src="' + ROOT + 'img/mark-keyline.webp" alt="" loading="lazy"><div class="ct">Legacy Journal</div><div class="cs">58th Biennial Antiochian Archdiocese Convention ' + MIDDOT + ' 2027</div><div class="tag">Front cover</div></div>' +
        '<div class="pg cover back on"><div class="live">' + ad(cur, 'Back cover') + '</div><div class="tag">Back cover</div></div></div>';
      caption = 'The outside back cover: the most-seen page of the book.';
    } else if (where === 'center') {
      stage = '<div class="spread center">' + page('', 'Center spread', 'on') + page('', 'Center spread', 'on') +
        '<div class="ad c cfad" style="height:' + 10 * S + 'px"><div class="fr"><div class="k">Centerfold</div><div class="nm">Your spread</div><div class="ln"></div><div class="sm">One design across the center of the book</div></div></div></div>';
      caption = 'The middle of the book, where it falls open on its own.';
    } else if (where === 'ifc') {
      stage = '<div class="spread">' + page(ad(cur, 'Inside front cover'), 'Inside front cover', 'on cov') + page(filler(4) + '<div class="tt">Welcome</div>' + filler(8), 'Page 1') + '</div>';
      caption = 'The first page every reader sees when they open the journal.';
    } else if (where === 'ibc') {
      stage = '<div class="spread">' + page(filler(14), 'Last page') + page(ad(cur, 'Inside back cover'), 'Inside back cover', 'on cov') + '</div>';
      caption = 'Facing the last page, opposite the back cover.';
    } else if (cur[0] === 'name') {
      var rows = ''; for (var i = 0; i < 22; i++) rows += '<div class="nl' + (i === 7 ? ' me' : '') + '">' + (i === 7 ? 'Your name here' : '<span></span>') + '</div>';
      stage = '<div class="spread">' + page(filler(14), 'Journal page') + page('<div class="k c">Name listings</div><div class="cols">' + rows + '</div>', 'Name listing page', 'on') + '</div>';
      caption = 'Names are typeset in columns by the journal team. Nothing to design.';
    } else {
      var right = ad(cur, cur[1]);
      if (cur[0] === 'half') right += filler(6);
      else if (cur[0] === 'qtr') right = '<div class="row">' + ad(cur, cur[1]) + '<div class="ghost" style="width:' + 3.75 * S + 'px;height:' + 5 * S + 'px"></div></div>' + filler(6);
      else if (cur[0] === 'eig') right = '<div class="row">' + ad(cur, cur[1]) + '<div class="ghost" style="width:' + 3.75 * S + 'px;height:' + 2.5 * S + 'px"></div></div>' + filler(9);
      else if (cur[0] === 'card') right = '<div class="row">' + ad(cur, '') + '<div class="ghost" style="width:' + 1.775 * S + 'px;height:' + 1.25 * S + 'px"></div><div class="ghost" style="width:' + 1.775 * S + 'px;height:' + 1.25 * S + 'px"></div></div>' + filler(11);
      stage = '<div class="spread">' + page(filler(14), 'Journal page') + page(right, cur[1], 'on') + '</div>';
      caption = cur[4] === 7.5 && cur[5] === 10 ? 'A full page of your own, ' + (cur[7] === 'g' ? 'printed in greyscale.' : 'printed in full color.') :
        'Shown to scale on a 7.5' + RQ + ' ' + X + ' 10' + RQ + ' page. The rest of the page is shared.';
    }
    var groups = {}, order = [];
    JB.forEach(function (a) { if (!groups[a[8]]) { groups[a[8]] = []; order.push(a[8]); } groups[a[8]].push(a); });
    var list = order.map(function (g) {
      return '<div class="grp"><div class="gh">' + g + '</div>' + groups[g].map(function (a) {
        return '<button type="button" data-id="' + a[0] + '" class="' + (a[0] === cur[0] ? 'sel' : '') + '"><span>' + a[1] + '</span><b>' + money(a[2]) + '</b></button>';
      }).join('') + '</div>';
    }).join('');
    var spec = cur[4] ? cur[3] + ' ' + MIDDOT + ' ' + inch(cur[4]) + RQ + ' ' + X + ' ' + inch(cur[5]) + RQ : cur[3];
    return '<style>' + BASE +
      '.wrap{display:grid;grid-template-columns:1fr 330px;gap:40px;align-items:stretch}' +
      '.stagebox{background:linear-gradient(180deg,#efe9e2,#e6ddd3);border-radius:18px;padding:34px 20px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center}' +
      '.spread,.covers{display:flex;gap:0;filter:drop-shadow(0 24px 26px rgba(13,7,69,.28))}.covers{gap:26px}' +
      '.pg{position:relative;width:' + PW + 'px;height:' + PH + 'px;background:#fff;padding:12px}' +
      '.spread .pg:first-child{border-radius:6px 0 0 6px;background:linear-gradient(90deg,#fff 85%,#ece8e3)}.spread .pg:last-child{border-radius:0 6px 6px 0;background:linear-gradient(270deg,#fff 85%,#ece8e3)}' +
      '.spread.center .pg:first-child .ad{border-right:none}.spread.center .pg:last-child .ad{border-left:none}' +
      '.live{position:relative;height:100%;display:flex;flex-direction:column;gap:7px;overflow:hidden}' +
      '.tag{position:absolute;left:0;right:0;bottom:-26px;text-align:center;font-family:Oswald,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(13,7,69,.55)}' +
      '.on .tag{color:' + MAROON + '}' +
      '.tl{height:5px;border-radius:3px;background:rgba(13,7,69,.09);flex:none}.tt{font-family:Oswald,sans-serif;font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:rgba(13,7,69,.4);margin:6px 0}' +
      '.ad{position:relative;flex:none;border-radius:2px;background:' + NAVY + ';color:' + SHORE + ';display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 0 0 2px ' + GOLD + ';animation:pop .35s ease}' +
      '@keyframes pop{from{transform:scale(.96);opacity:.4}to{transform:none;opacity:1}}' +
      '.ad.g{background:#3b3b3f}.ad.gold{background:linear-gradient(135deg,#b8892a,#f3d27a 45%,#b8892a)}.ad.silver{background:linear-gradient(135deg,#8d9196,#e9ebee 45%,#8d9196)}' +
      '.ad.gold,.ad.silver{color:' + NAVY + '}' +
      '.fr{position:absolute;inset:9%;border:1px solid currentColor;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;opacity:.95}' +
      '.k{font-family:Oswald,sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;padding:0 6px}.k.c{color:' + MAROON + ';text-align:center;margin:4px 0 10px}' +
      '.cfad .nm{font-size:40px}.nm{font-family:GreatVibes,cursive;font-size:30px;line-height:1}.ln{width:40%;height:1px;background:currentColor;opacity:.4}.sm{font-size:9px;letter-spacing:.06em;opacity:.8;padding:0 8px}' +
      '.dw{position:absolute;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:.06em;color:' + MAROON + ';background:#fff;padding:0 4px;border-radius:3px;white-space:nowrap}' +
      '.dw{top:5px;left:50%;transform:translateX(-50%)}.fullad .dw{top:auto;bottom:5px}' +
      '.spread{position:relative}.cfad{position:absolute;left:12px;right:12px;top:12px}.cfad .fr{inset:7% 5%}.cfad:after{content:"";position:absolute;top:0;bottom:0;left:50%;width:18px;transform:translateX(-50%);background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.28),rgba(0,0,0,0))}' +
      '.row{display:flex;gap:7px;flex:none}.ghost{flex:none;border:1px dashed rgba(13,7,69,.22);border-radius:2px}' +
      '.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border-radius:4px 6px 6px 4px;background:' + NAVY + ';color:' + SHORE + '}' +
      '.cover img{width:96px}.ct{font-family:Oswald,sans-serif;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:' + GOLD + '}.cs{font-size:9px;letter-spacing:.06em;text-align:center;padding:0 18px;opacity:.85}' +
      '.cover.back{background:#fff}.cover .tag{color:rgba(13,7,69,.55)}.cover.on .tag{color:' + MAROON + '}' +
      '.cols{columns:2;column-gap:14px}.nl{height:14px;font-size:9px;line-height:14px;color:' + NAVY + '}.nl span{display:inline-block;width:80%;height:4px;border-radius:2px;background:rgba(13,7,69,.12);vertical-align:middle}' +
      '.nl.me{background:' + GOLD + ';border-radius:2px;padding:0 4px;font-weight:500;break-inside:avoid}' +
      '.cap{margin-top:44px;font-size:13px;color:rgba(13,7,69,.65);text-align:center;max-width:470px}' +
      '.panel{background:#fff;border-radius:18px;box-shadow:0 0 0 1px rgba(13,7,69,.08),0 18px 40px -26px rgba(13,7,69,.4);padding:22px 22px 24px}' +
      '.sel-name{font-family:Oswald,sans-serif;font-weight:500;font-size:22px;letter-spacing:.04em;text-transform:uppercase;margin:0}' +
      '.price{font-family:Oswald,sans-serif;font-weight:600;font-size:40px;color:' + MAROON + ';margin:2px 0 0;line-height:1.1}.spec{font-size:13px;color:rgba(13,7,69,.6);margin:2px 0 16px}' +
      '.btn{display:block;font-size:13px;padding:13px 20px}.mail{display:block;text-align:center;font-size:12px;color:' + MAROON + ';margin-top:10px}' +
      '.list{margin-top:18px;border-top:1px solid rgba(13,7,69,.1);padding-top:6px;max-height:330px;overflow:auto}' +
      '.gh{font-family:Oswald,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:' + MAROON + ';margin:12px 0 4px}' +
      'button{all:unset;box-sizing:border-box;width:100%;display:flex;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:8px;font-size:13px;cursor:pointer;color:' + NAVY + '}' +
      'button:hover{background:rgba(13,7,69,.05)}button.sel{background:' + NAVY + ';color:' + SHORE + '}button span{flex:1}button b{font-weight:500;white-space:nowrap}button:focus-visible{outline:2px solid ' + MAROON + '}' +
      '@media(max-width:860px){.wrap{grid-template-columns:1fr}.stagebox{overflow:hidden}.spread,.covers{transform:scale(.72);transform-origin:top center;margin-bottom:-110px}}' +
      '@media(max-width:420px){.stagebox{padding:24px 10px 18px}.spread,.covers{transform:scale(.5);margin-bottom:-175px}.covers{gap:20px}.cap{margin-top:30px;font-size:12px}.list{max-height:none}}' +
      '</style><div class="wrap"><div class="stagebox">' + stage + '<p class="cap">' + caption + '</p></div>' +
      '<div class="panel"><p class="sel-name">' + cur[1] + '</p><p class="price">' + money(cur[2]) + '</p><p class="spec">' + spec + '</p>' +
      '<a class="btn navy" href="' + JOURNAL_FORM + '">Reserve This Placement</a><a class="mail" href="mailto:info@ac2027socal.com">Questions? info@ac2027socal.com</a>' +
      '<div class="list" role="listbox" aria-label="Journal placements">' + list + '</div></div></div>';
  }, ['selected']);

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
      '.bg' + layer + '.bg{object-fit:cover;animation:acKen 24s ease-out both}@keyframes acKen{from{transform:scale(1.08)}to{transform:scale(1)}}' +
      '.mark{animation:acRise 1.1s .2s cubic-bezier(.22,.61,.36,1) both}.script{animation:acRise 1.1s .45s cubic-bezier(.22,.61,.36,1) both}@keyframes acRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}' +
      '@media(prefers-reduced-motion:reduce){.bg,.mark,.script{animation:none}}' +
      '.wash' + layer + '.wash{background:' + wash + '}' +
      '.top{position:' + pos + ';left:0;right:0;top:44px;text-align:center}' +
      '.mark{width:150px;height:auto;display:block;margin:0 auto 10px}' +
      '.script{font-family:GreatVibes,cursive;color:#fff;font-size:54px;line-height:1.2;margin:0;text-shadow:0 2px 14px rgba(120,40,60,.28)}' +
      '@media(max-width:900px){.script{display:none}.mark{width:112px}}</style>' +
      '<img class="bg" src="' + ROOT + 'img/sunset.webp" alt="" fetchpriority="high"><div class="wash"></div>' +
      (band ? '' : '<div class="top"><img class="mark" src="' + ROOT + 'img/mark-keyline.webp" width="420" height="436" alt=""><p class="script">Southern California is calling.</p></div>');
  }, ['variant']);

  /* footer links (the canonical facts block stays native text beside it) */
  define('ac-footer-links', function () {
    var pages = [['/', 'Home'], ['/about', 'About the Convention'], ['/hotel', 'Hotel &amp; Room Block'], ['/registration', 'Registration'],
      ['/schedule', 'Schedule'], ['/faq', 'FAQ'], ['/host-parish', 'Host Parish'], ['/contact', 'Contact']];
    var involved = [['/sponsorships', 'Sponsorships'], ['/journal', 'Legacy Journal'], ['/vendors', 'Vendors'], ['/volunteer', 'Volunteer'],
      ['https://saintandrew.churchofficechms.com/external/form/fceb608b-be91-4ab0-9638-38cae4ff47f7', 'Support the Convention']];
    var social = [['https://instagram.com/ac2027socal', 'Instagram'], ['https://facebook.com/ac2027socal', 'Facebook'], ['https://youtube.com/@ac2027socal', 'YouTube'], ['https://x.com/ac2027socal', 'X'], ['https://www.tiktok.com/@ac2027socal', 'TikTok']];
    var trip = [['/guides', 'All Guides'], ['/first-timers-guide', 'First-Timer\u2019s Guide'], ['/travel', 'Travel &amp; Parking'], ['/anaheim', 'Anaheim Guide'],
      ['/riverside', 'A Day in Riverside'], ['/convention-history', 'Convention History'], ['/antiochian-orthodox', 'The Antiochian Church']];
    function col(t, list) {
      return '<div><h4>' + t + '</h4><ul>' + list.map(function (l) { return '<li><a href="' + l[0] + '">' + l[1] + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<style>' + BASE + '.g{display:grid;grid-template-columns:1fr 1fr;gap:34px}' +
      'h4{font-family:Oswald,sans-serif;font-weight:500;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 16px}' +
      'ul{list-style:none;padding:0;margin:0}li{margin-bottom:10px;font-size:14px}' +
      'a{color:rgba(250,248,245,.86);text-decoration:none}a:hover{color:' + GOLD + '}' +
      '.c2>div+div{margin-top:26px}' +
      '@media(max-width:400px){.g{grid-template-columns:1fr}}</style>' +
      '<div class="g"><div class="c2">' + col('Pages', pages) + col('Follow Us', social) + '</div><div class="c2">' + col('Plan Your Trip', trip) + col('Get Involved', involved) + '</div></div>';
  });
})();
