/* AC2027 SoCal - Wix custom elements (design pieces only).
   Text that crawlers must read lives in native Wix text, not here.
   Wix: Add > Embed Code > Custom Element > Server URL =
   https://undisputedmedia.github.io/ac2027-preview/wix/ac-elements.js
   Tags: ac-header, ac-newsbar, ac-ratecard, ac-buttons, ac-hero-bg, ac-footer-links, ac-journal-samples, ac-journal-book, ac-schedule, ac-sponsors, ac-video, ac-links
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
  /* links that leave the site (hotel booking, social, forms) open in a new tab */
  function tgt(u) { return /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''; }
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
       chms_form_click    -> *.churchofficechms.com      (sponsor, journal, donate)
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
  var NAV = [['/', 'Home'], ['/hotel', 'Hotel'], ['/registration', 'Registration'], ['/schedule', 'Schedule'], ['/sponsorships', 'Sponsors &amp; Journal'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
  HOOKS['ac-header'] = function (r) {
    var b = r.querySelector('.tog'), bar = r.querySelector('.bar'), host = r.host;
    /* sticky: once the page scrolls, the bar is fixed to the top of the screen at the same
       position and width; the host keeps its 76px so nothing below jumps */
    function pin() {
      var h = host.getBoundingClientRect(), on = h.top < 0;
      bar.classList.toggle('pin', on);
      bar.style.left = on ? h.left + 'px' : '';
      bar.style.width = on ? h.width + 'px' : '';
    }
    if (!host._acPin) { host._acPin = true; window.addEventListener('scroll', pin, { passive: true }); window.addEventListener('resize', pin); }
    pin();
    b.addEventListener('click', function () {
      var o = bar.classList.toggle('open');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
      b.textContent = o ? 'Close' : 'Menu';
    });
  };
  define('ac-header', function (el) {
    var cur = el.getAttribute('current') || '', compact = el.hasAttribute('compact');
    var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === cur || (n[0] === '/sponsorships' && cur === '/journal') ? ' class="cur"' : '') + '>' + n[1] + '</a>'; }).join('');
    return '<style>' + BASE +
      ':host{background:' + SHORE + '}.bar{height:76px;display:flex;align-items:center;gap:20px;padding:0 4px;background:' + SHORE + '}' +
      '.bar.pin{position:fixed;top:0;z-index:60}.bar.pin:before{content:"";position:absolute;top:0;bottom:0;left:-100vw;right:-100vw;background:' + SHORE + ';z-index:-1}' +
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
      '.open nav a{padding:13px 0;border-bottom:1px solid rgba(13,7,69,.13)}}' +
      /* compact (phones): no bar background, logo in a shore circle, floating pill buttons */
      (compact ? '@media(max-width:760px){:host{background:transparent}.bar{height:52px;gap:8px;padding:0 8px;background:transparent}.bar.pin:before{display:none}' +
        '.home{display:flex;align-items:center;justify-content:center;flex:none;width:44px;height:44px;border-radius:50%;background:' + SHORE + ';box-shadow:0 4px 14px rgba(13,7,69,.22)}' +
        '.mark{height:34px}.bt{display:none}.tog{background:' + SHORE + ';border-color:transparent;padding:9px 15px;font-size:12px;box-shadow:0 4px 14px rgba(13,7,69,.22)}' +
        '.cta{display:none}' +
        '.open nav{top:58px;left:8px;right:8px;border-radius:14px;border:2px solid ' + MAROON + ';box-shadow:0 18px 40px -12px rgba(13,7,69,.55)}.open nav a:last-child{border-bottom:0}.open .tog{border-color:' + MAROON + '}}' : '') +
      '</style>' +
      '<div class="bar"><a class="home" href="/"><img class="mark" src="' + ROOT + 'img/mark-192.webp" width="192" height="199" decoding="async" alt="58th Biennial Antiochian Archdiocese Convention ' + MDASH + ' SoCal"></a>' +
      '<a class="bt" href="/"><div class="l1">AC2027 SoCal</div><div class="l2">July 19' + NDASH + '25, 2027 ' + MIDDOT + ' Anaheim, California</div></a>' +
      '<nav>' + links + '</nav><button class="tog" aria-expanded="false">Menu</button>' +
      '<a class="btn navy cta" href="/hotel">Book Room</a></div>';
  }, ['current', 'compact']);

  /* news bar: maroon announcement strip under the header. One item shows at a time and the next
     slides in every 5 s; pauses on hover/focus; no motion under prefers-reduced-motion.
     Once the header scrolls away the bar pins to the top of the screen.
     Edit NEWS to change the announcements on every page at once. */
  var NEWS = [
    ['Hotel room block is live', 'Book now', PASSKEY],
    ['Registration opens soon', 'Get updates', '/get-notified'],
    ['Sponsorship slots available', 'See options', '/sponsorships']
  ];
  HOOKS['ac-newsbar'] = function (r) {
    var host = r.host, bar = r.querySelector('.bar'), items = r.querySelectorAll('.it'), i = 0, paused = false;
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (host._acTimer) clearInterval(host._acTimer);
    function show(n) {
      items.forEach(function (it, k) { it.classList.toggle('on', k === n); it.setAttribute('aria-hidden', k === n ? 'false' : 'true'); });
    }
    show(0);
    if (items.length > 1) host._acTimer = setInterval(function () { if (!paused && !document.hidden) { i = (i + 1) % items.length; show(i); } }, 5000);
    if (still) { clearInterval(host._acTimer); }
    bar.addEventListener('mouseenter', function () { paused = true; });
    bar.addEventListener('mouseleave', function () { paused = false; });
    bar.addEventListener('focusin', function () { paused = true; });
    bar.addEventListener('focusout', function () { paused = false; });
    function pin() {
      if (host.getAttribute('dock') === 'bottom' && window.matchMedia && matchMedia('(max-width:760px)').matches) {
        var q = document.getElementById('QUICK_ACTION_BAR');
        host.style.setProperty('--qab', ((q && q.offsetHeight) || 0) + 'px');
        /* the Wix box this element sits in still covers the top of the page on phones; let taps
           pass through it to the header (the bar itself keeps pointer-events) */
        for (var w = host.parentElement; w && w !== document.body; w = w.parentElement) {
          w.style.pointerEvents = 'none';
          if (w.id && /^comp-/.test(w.id)) break;
        }
        bar.classList.remove('pin'); bar.style.top = '';
        if (!document.getElementById('ac-dock-pad')) {
          var st = document.createElement('style'); st.id = 'ac-dock-pad';
          st.textContent = '@media(max-width:760px){#SITE_CONTAINER{padding-bottom:60px}}'; document.head.appendChild(st);
        }
        return;
      }
      var hd = document.querySelector('ac-header'), hb = hd && hd.shadowRoot && hd.shadowRoot.querySelector('.bar'), off = hb ? hb.offsetHeight : 0;
      var on = host.getBoundingClientRect().top <= off;
      bar.classList.toggle('pin', on);
      bar.style.top = on ? off + 'px' : '';
    }
    if (!host._acPin) { host._acPin = true; window.addEventListener('scroll', pin, { passive: true }); window.addEventListener('resize', pin); }
    pin();
  };
  define('ac-newsbar', function (el) {
    var dock = el.getAttribute('dock') === 'bottom';
    var list = NEWS.map(function (n, k) {
      return '<a class="it' + (k === 0 ? ' on' : '') + '" href="' + esc(n[2]) + '"' + tgt(n[2]) + '><span class="tx">' + esc(n[0]) + '</span><span class="go">' + esc(n[1]) + ' \u2192</span></a>';
    }).join('');
    return '<style>' + BASE + ':host{display:block;height:100%}' +
      '.bar{position:absolute;top:0;left:calc(50% - 50vw);width:100vw;height:100%;min-height:34px;background:' + MAROON + ';overflow:hidden;z-index:40;pointer-events:auto}' +
      '.bar.pin{position:fixed;top:0;left:0;right:0;width:100%;height:36px;box-shadow:0 6px 16px -10px rgba(13,7,69,.55)}' +
      '.it{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:14px;padding:0 16px;color:#fff;text-decoration:none;' +
      'opacity:0;transform:translateX(40px);transition:opacity .45s ease,transform .45s ease;pointer-events:none}' +
      '.it.on{opacity:1;transform:none;pointer-events:auto}' +
      '.tx{font-size:13px;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.go{font-family:Oswald,sans-serif;font-weight:500;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:' + GOLD + ';white-space:nowrap}' +
      '.it:hover .go,.it:focus .go{text-decoration:underline}' +
      '.it:focus-visible{outline:2px solid ' + GOLD + ';outline-offset:-4px}' +
      '@media(max-width:600px){.tx{font-size:12px}.go{font-size:11px}.it{gap:10px}}' +
      '@media(prefers-reduced-motion:reduce){.it{transition:none;transform:none}}' +
      (dock ? '@media(max-width:760px){:host{pointer-events:none}.bar,.bar.pin{position:fixed;top:auto;bottom:var(--qab,0px);left:0;right:0;width:100%;height:36px;pointer-events:auto;box-shadow:0 -6px 16px -10px rgba(13,7,69,.55)}}' : '') +
      '</style>' +
      '<div class="bar" role="region" aria-label="Announcements">' + list + '</div>';
  }, ['dock']);

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
      '<a class="btn gold" href="' + PASSKEY + '"' + tgt(PASSKEY) + '>Reserve Your Room</a></div>';
  });

  /* buttons: items="Label|url;Label|url" (url PASSKEY = hotel link) styles="navy,outline" align="left|center" */
  define('ac-buttons', function (el) {
    var items = (el.getAttribute('items') || 'Reserve Your Room|PASSKEY;Get Updates|/get-notified').split(';');
    var styles = (el.getAttribute('styles') || 'navy,outline').split(',');
    var align = el.getAttribute('align') === 'left' ? 'flex-start' : 'center';
    var html = items.map(function (it, i) {
      var p = it.split('|'); var url = p[1] === 'PASSKEY' ? PASSKEY : p[1];
      return '<a class="btn ' + esc(styles[i] || 'navy') + '" href="' + esc(url) + '"' + tgt(url) + '>' + esc(p[0]) + '</a>';
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
  /* short labels for the chip grid and the page tag; church/department rates noted in the spec line */
  var JB_SHORT = { cf: 'Centerfold', bc: 'Back cover', ifc: 'Inside front cover', ibc: 'Inside back cover', gold: 'Gold page', silver: 'Silver page',
    full: 'Full page', fullp: 'Full page \u00b7 church', fullg: 'Greyscale page', fullgp: 'Greyscale \u00b7 church', half: 'Half page', qtr: 'Quarter page',
    eig: 'Eighth page', card: 'Business card', name: 'Name listing' };
  var JB_TITLE = { fullp: 'Full Page, Color', fullgp: 'Full Page, Greyscale', full: 'Full Page, Color', fullg: 'Full Page, Greyscale' };
  var JB_GROUP = { 'Premium placements': 'Premium', 'Full pages': 'Full pages', 'Partial pages': 'Partial pages', 'Name listing': 'Listing' };
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
      var right = ad(cur, JB_SHORT[cur[0]] || cur[1]);
      if (cur[0] === 'half') right += filler(6);
      else if (cur[0] === 'qtr') right = '<div class="row">' + ad(cur, JB_SHORT[cur[0]]) + '<div class="ghost" style="width:' + 3.75 * S + 'px;height:' + 5 * S + 'px"></div></div>' + filler(6);
      else if (cur[0] === 'eig') right = '<div class="row">' + ad(cur, JB_SHORT[cur[0]]) + '<div class="ghost" style="width:' + 3.75 * S + 'px;height:' + 2.5 * S + 'px"></div></div>' + filler(9);
      else if (cur[0] === 'card') right = '<div class="row">' + ad(cur, '') + '<div class="ghost" style="width:' + 1.775 * S + 'px;height:' + 1.25 * S + 'px"></div><div class="ghost" style="width:' + 1.775 * S + 'px;height:' + 1.25 * S + 'px"></div></div>' + filler(11);
      stage = '<div class="spread">' + page(filler(14), 'Journal page') + page(right, JB_SHORT[cur[0]] || cur[1], 'on') + '</div>';
      caption = cur[4] === 7.5 && cur[5] === 10 ? 'A full page of your own, ' + (cur[7] === 'g' ? 'printed in greyscale.' : 'printed in full color.') :
        'Shown to scale on a 7.5' + RQ + ' ' + X + ' 10' + RQ + ' page. The rest of the page is shared.';
    }
    var groups = {}, order = [];
    JB.forEach(function (a) { if (!groups[a[8]]) { groups[a[8]] = []; order.push(a[8]); } groups[a[8]].push(a); });
    var list = order.map(function (g) {
      return '<div class="gh">' + (JB_GROUP[g] || g) + '</div>' + groups[g].map(function (a) {
        return '<button type="button" data-id="' + a[0] + '" aria-pressed="' + (a[0] === cur[0]) + '" class="' + (a[0] === cur[0] ? 'sel' : '') + '"><span>' + JB_SHORT[a[0]] + '</span><b>' + money(a[2]) + '</b></button>';
      }).join('');
    }).join('');
    var spec = (cur[4] ? cur[3] + ' ' + MIDDOT + ' ' + inch(cur[4]) + RQ + ' ' + X + ' ' + inch(cur[5]) + RQ : cur[3]) + (/p$/.test(cur[0]) && cur[0] !== 'cf' ? ' ' + MIDDOT + ' Church &amp; department rate' : '');
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
      '.panel{background:#fff;border-radius:18px;box-shadow:0 0 0 1px rgba(13,7,69,.08),0 18px 40px -26px rgba(13,7,69,.4);padding:20px 20px 20px}' +
      '.sel-name{font-family:Oswald,sans-serif;font-weight:500;font-size:20px;letter-spacing:.04em;text-transform:uppercase;margin:0;line-height:1.2}' +
      '.price{font-family:Oswald,sans-serif;font-weight:600;font-size:36px;color:' + MAROON + ';margin:2px 0 0;line-height:1.1}.spec{font-size:12.5px;color:rgba(13,7,69,.6);margin:2px 0 14px}' +
      '.btn{display:block;font-size:13px;padding:12px 20px}.mail{display:block;text-align:center;font-size:12px;color:' + MAROON + ';margin-top:10px}' +
      '.list{margin-top:16px;border-top:1px solid rgba(13,7,69,.1);padding-top:4px;display:grid;grid-template-columns:1fr 1fr;gap:6px}' +
      '.gh{grid-column:1/-1;font-family:Oswald,sans-serif;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:' + MAROON + ';margin:8px 0 0}' +
      'button{all:unset;box-sizing:border-box;width:100%;display:flex;flex-direction:column;gap:1px;padding:7px 10px;border-radius:9px;font-size:12px;line-height:1.25;cursor:pointer;color:' + NAVY + ';box-shadow:inset 0 0 0 1px rgba(13,7,69,.12)}' +
      'button:hover{background:rgba(13,7,69,.05)}button.sel{background:' + NAVY + ';color:' + SHORE + ';box-shadow:none}button span{opacity:.85}button b{font-family:Oswald,sans-serif;font-weight:500;font-size:15px;letter-spacing:.02em}button:focus-visible{outline:2px solid ' + MAROON + '}' +
      '@media(max-width:860px){.wrap{grid-template-columns:1fr}.stagebox{overflow:hidden}.spread,.covers{transform:scale(.72);transform-origin:top center;margin-bottom:-110px}}' +
      '@media(max-width:420px){.stagebox{padding:24px 10px 18px}.spread,.covers{transform:scale(.5);margin-bottom:-175px}.covers{gap:20px}.cap{margin-top:30px;font-size:12px}}' +
      '</style><div class="wrap"><div class="stagebox">' + stage + '<p class="cap">' + caption + '</p></div>' +
      '<div class="panel"><p class="sel-name">' + (JB_TITLE[cur[0]] || cur[1]) + '</p><p class="price">' + money(cur[2]) + '</p><p class="spec">' + spec + '</p>' +
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
    /* photo: a full-bleed photograph from img/. attributes img="parish-aerial", alt, pos="50% 50%".
       wash="navy" adds a navy overlay (darkest at the top, where hero text sits) and loads the photo eagerly */
    if (v === 'photo') {
      var im = esc(el.getAttribute('img') || 'parish-aerial'), alt = esc(el.getAttribute('alt') || ''), pos = esc(el.getAttribute('pos') || '50% 50%');
      var navy = el.getAttribute('wash') === 'navy';
      return '<style>' + host + '.bg' + layer + '.bg{object-fit:cover;object-position:' + pos + '}' +
        (navy ? '.wash' + layer + '.wash{background:linear-gradient(180deg,rgba(13,7,69,.85) 0%,rgba(13,7,69,.65) 45%,rgba(13,7,69,.3) 100%)}' +
          '@media(max-width:760px){.wash{background:linear-gradient(180deg,rgba(13,7,69,.86) 0%,rgba(13,7,69,.72) 50%,rgba(13,7,69,.2) 100%)}}' : '') + '</style>' +
        '<img class="bg" src="' + ROOT + 'img/' + im + '.webp" srcset="' + ROOT + 'img/' + im + '-sm.webp 1200w, ' + ROOT + 'img/' + im + '.webp 2400w" sizes="100vw" alt="' + alt + '"' +
        (navy ? ' fetchpriority="high"' : ' loading="lazy"') + '>' + (navy ? '<div class="wash"></div>' : '');
    }
    /* church: still of St Andrew from the launch video, light navy wash that deepens toward the form */
    if (v === 'church') {
      return '<style>' + host + '.bg' + layer + '.bg{object-fit:cover;object-position:50% 45%}' +
        '.wash' + layer + '.wash{background:linear-gradient(180deg,rgba(13,7,69,.5) 0%,rgba(13,7,69,.62) 40%,rgba(13,7,69,.85) 100%)}' +
        '@media(max-width:760px){.wash{background:linear-gradient(180deg,rgba(13,7,69,.55) 0%,rgba(13,7,69,.66) 40%,rgba(13,7,69,.88) 100%)}}</style>' +
        '<img class="bg" src="' + ROOT + 'img/church.webp" srcset="' + ROOT + 'img/church-sm.webp 1200w, ' + ROOT + 'img/church.webp 2400w" sizes="100vw" alt="" loading="lazy"><div class="wash"></div>';
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

  /* video: the YouTube player itself, so one tap plays it on every phone (a separate play-button
     cover needed a second tap on iPhones). It only loads as it nears the screen. enablejsapi lets
     GA4 enhanced measurement record video_start / video_progress / video_complete.
     attributes: video="<YouTube id>", label="<accessible title>" */
  define('ac-video', function (el) {
    var t = esc(el.getAttribute('label') || 'AC2027 SoCal launch video'), id = encodeURIComponent(el.getAttribute('video') || 'QroAUEqKRjQ');
    return '<style>' + BASE + ':host{background:transparent}' +
      '.v{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:' + NAVY + ';box-shadow:0 18px 40px rgba(13,7,69,.18)}' +
      '.v iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;display:block}' +
      '@media(max-width:760px){.v{border-radius:0;box-shadow:none}}</style>' +
      '<div class="v"><iframe src="https://www.youtube.com/embed/' + id + '?rel=0&playsinline=1&enablejsapi=1" title="' + t + '" loading="lazy" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" ' +
      'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
  }, ['label', 'video']);

  /* links: the /links page (a link-in-bio hub for social bios, signatures and QR codes).
     Edit LINKS / SOCIAL to change the buttons. Every tap is reported as GA4 event "links_click"
     (link_text = button label), on top of the usual outbound tracking. */
  var LINKS = [
    ['Book Your Room', PASSKEY, 'gold'],
    ['Get Updates', '/get-notified'],
    ['Registration', '/registration'],
    ['Sponsors & Journal', '/sponsorships'],
    ['Vendors', '/vendors'],
    ['Schedule', '/schedule'],
    ['Host Parish', '/host-parish'],
    ['Official Website', '/']
  ];
  var SOCIAL = [['Instagram', 'https://instagram.com/ac2027socal'], ['Facebook', 'https://facebook.com/ac2027socal'], ['YouTube', 'https://youtube.com/@ac2027socal'],
    ['X', 'https://x.com/ac2027socal'], ['TikTok', 'https://www.tiktok.com/@ac2027socal']];
  HOOKS['ac-links'] = function (r) {
    /* Wix may place the element off-centre on wide screens; centre the column on the viewport */
    var host = r.host, wrap = r.querySelector('.wrap');
    function centre() {
      if (!wrap) return; wrap.style.marginLeft = ''; wrap.style.marginRight = '';
      var hl = host.getBoundingClientRect().left, hw = host.offsetWidth, ww = wrap.offsetWidth, vw = document.documentElement.clientWidth;
      var want = Math.max(0, Math.min(hw - ww, (vw - ww) / 2 - hl));
      wrap.style.marginLeft = want + 'px'; wrap.style.marginRight = '0';
    }
    centre(); setTimeout(centre, 300);
    if (!host._acCentre) { host._acCentre = true; window.addEventListener('resize', centre); }
    if (r._acLinks) return; r._acLinks = true;
    r.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
      var p = { link_text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60), link_url: a.getAttribute('href'), page_path: location.pathname, transport_type: 'beacon' };
      try { if (typeof window.gtag === 'function') window.gtag('event', 'links_click', p); } catch (err) {}
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'ac_links_click', link_text: p.link_text, link_url: p.link_url }); } catch (err) {}
    });
  };
  define('ac-links', function () {
    var btns = LINKS.map(function (l) {
      return '<a class="btn ' + (l[2] || 'w') + '" href="' + esc(l[1]) + '"' + tgt(l[1]) + '>' + esc(l[0]) + '</a>';
    }).join('');
    var soc = SOCIAL.map(function (l) { return '<a class="s" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + '</a>'; }).join('');
    return '<style>' + BASE + ':host{background:' + NAVY + ';min-height:100%}' +
      '.w{background:' + SHORE + ';color:' + NAVY + '}' +
      '.wrap{max-width:440px;margin:0 auto;padding:44px 20px 56px;text-align:center}' +
      '.mark{width:116px;height:auto;display:block;margin:0 auto 14px}' +
      'h1{font-family:Oswald,sans-serif;font-weight:500;font-size:30px;letter-spacing:.04em;color:#fff;margin:0;line-height:1.15;text-transform:uppercase}' +
      '.sub{font-size:14px;color:rgba(250,248,245,.78);margin:8px 0 28px;line-height:1.55}' +
      '.list{display:flex;flex-direction:column;gap:12px}.list .btn{display:block;width:100%;padding:15px 20px;font-size:15px}' +
      '.soc{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:30px 0 0}' +
      '.s{font-family:Oswald,sans-serif;font-size:12px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;color:' + GOLD + ';padding:8px 14px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(253,206,62,.45)}' +
      '.s:hover{background:rgba(253,206,62,.12)}' +
      '.host{font-size:12px;color:rgba(250,248,245,.6);margin:26px 0 0;line-height:1.6}</style>' +
      '<div class="wrap"><img class="mark" src="' + ROOT + 'img/mark-keyline.webp" width="420" height="436" alt="58th Biennial Antiochian Archdiocese Convention ' + MDASH + ' SoCal">' +
      '<h1>AC2027 SoCal</h1><p class="sub">The 58th Biennial Antiochian Archdiocese Convention<br>July 19' + NDASH + '25, 2027 ' + MIDDOT + ' Hilton Anaheim</p>' +
      '<div class="list">' + btns + '</div><div class="soc">' + soc + '</div>' +
      '<p class="host">Hosted by Saint Andrew Orthodox Christian Church, Riverside, California</p></div>';
  });

  /* footer links (the canonical facts block stays native text beside it) */
  define('ac-footer-links', function () {
    var pages = [['/', 'Home'], ['/hotel', 'Hotel &amp; Room Block'], ['/registration', 'Registration'],
      ['/schedule', 'Schedule'], ['/faq', 'FAQ'], ['/host-parish', 'Host Parish'], ['/contact', 'Contact']];
    var involved = [['/sponsorships', 'Sponsorships'], ['/journal', 'Legacy Journal'], ['/vendors', 'Vendors'],
      ['https://saintandrew.churchofficechms.com/external/form/fceb608b-be91-4ab0-9638-38cae4ff47f7', 'Support the Convention']];
    var social = [['https://instagram.com/ac2027socal', 'Instagram'], ['https://facebook.com/ac2027socal', 'Facebook'], ['https://youtube.com/@ac2027socal', 'YouTube'], ['https://x.com/ac2027socal', 'X'], ['https://www.tiktok.com/@ac2027socal', 'TikTok']];
    var trip = [['/guides', 'All Guides'], ['/first-timers-guide', 'First-Timer\u2019s Guide'], ['/travel', 'Travel &amp; Parking'],
      ['/riverside', 'A Day in Riverside'], ['/links', 'All Links']];
    function col(t, list) {
      return '<div><h4>' + t + '</h4><ul>' + list.map(function (l) { return '<li><a href="' + l[0] + '"' + tgt(l[0]) + '>' + l[1] + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<style>' + BASE + '.g{display:grid;grid-template-columns:1fr 1fr;gap:34px}' +
      'h4{font-family:Oswald,sans-serif;font-weight:500;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:' + GOLD + ';margin:0 0 16px}' +
      'ul{list-style:none;padding:0;margin:0}li{margin-bottom:10px;font-size:14px}' +
      'a{color:rgba(250,248,245,.86);text-decoration:none}a:hover{color:' + GOLD + '}' +
      '.c2>div+div{margin-top:26px}' +
      '@media(max-width:400px){.g{gap:18px}li{font-size:13.5px}}</style>' +
      '<div class="g"><div class="c2">' + col('Pages', pages) + col('Follow Us', social) + '</div><div class="c2">' + col('Plan Your Trip', trip) + col('Get Involved', involved) + '</div></div>';
  });

  /* schedule: the day-by-day program, one tab per day (data from the 2026 schedule embed;
     the old embed's "Sun 7/26" is corrected to Sunday, July 25). attribute day="0".."6" */
  var SCHED = [{"d":"19","n":"Monday","s":"Arrival Day \u2014 Convention Opens","x":[["Afternoon",[["12:00 \u2013 2:00 pm","VIP Luncheon (by invitation)"],["3:00 \u2013 9:00 pm","Hospitality Center"],["3:00 \u2013 9:00 pm","Registration Open"],["4:00 \u2013 5:00 pm","Choir Rehearsal"],["4:00 \u2013 5:00 pm","Byzantine Choir Rehearsal"],["4:45 \u2013 5:00 pm","Blessing of the Chapel"],["5:00 \u2013 6:00 pm","Vespers"]]],["Evening",[["6:00 \u2013 6:30 pm","Shrine Visitation \u2014 The Miraculous Kursk Root Icon"],["6:00 \u2013 8:00 pm","Game Show Night"],["8:00 \u2013 11:00 pm","Diocesan Teen SOYO Officers Meeting"],["9:00 \u2013 10:30 pm","VIP Club (by invitation)"],["11:00 \u2013 11:30 pm","Compline"],["11:30 pm \u2013 12:00 am","\u201cAsk Abouna\u201d"]]]]},{"d":"20","n":"Tuesday","s":"Department Meetings & Clergy Day","x":[["Morning",[["8:00 \u2013 8:45 am","Bible Study and Confessions"],["8:45 \u2013 10:00 am","Daily Orthros"],["10:00 am \u2013 9:00 pm","Hospitality Center \u00b7 Registration \u00b7 Exhibits & Vendors"],["10:00 am \u2013 4:30 pm","Mother's Room Open \u00b7 Kidz Club (Ages 4\u201312)"],["10:00 \u2013 11:00 am","Shrine Visitation \u2014 Kursk Root Icon"],["10:00 \u2013 11:00 am","Clergy / Clergy Wives Breakfast"],["11:00 am \u2013 1:00 pm","Clergy Wives Meeting"],["11:00 am \u2013 2:00 pm","Clergy Meeting with Hierarchs"],["11:00 am \u2013 2:00 pm","Order of Saint Ignatius General Assembly"],["11:00 am \u2013 4:30 pm","Diocesan Teen SOYO Officers Meeting"]]],["Afternoon",[["2:00 \u2013 4:00 pm","Orthodox Leadership Initiative Meeting"],["2:00 \u2013 4:30 pm","Dept. of Liturgics \u00b7 Dept. of Western Rite \u00b7 Dept. of Theological & Pastoral Education \u00b7 Dept. of Finance \u00b7 Home Schooling Dept. \u00b7 Dept. of Orthodox Family Center"],["2:00 \u2013 4:30 pm","Workshops (2 sessions)"],["2:00 \u2013 5:00 pm","Choir Workshop / Rehearsal \u00b7 Byzantine Choir Rehearsal"]]],["Evening",[["5:00 \u2013 6:00 pm","Vespers"],["6:30 \u2013 10:00 pm","Kidz Club Evening Edition (Ages 4\u201312)"],["7:00 \u2013 9:30 pm","Tacos & Teens (Ticketed)"],["7:00 \u2013 9:30 pm","Order of Saint Ignatius Reception and Dinner"],["9:30 \u2013 10:30 pm","VIP Club (by invitation)"],["11:00 \u2013 11:30 pm","Compline"],["11:30 pm \u2013 12:00 am","\u201cAsk Abouna\u201d"]]]]},{"d":"21","n":"Wednesday","s":"Women's Day & Bible Bowl","x":[["Morning",[["8:00 \u2013 8:45 am","Bible Study and Confessions"],["8:45 \u2013 10:00 am","Daily Orthros"],["10:00 am \u2013 9:00 pm","Hospitality Center \u00b7 Registration \u00b7 Exhibits & Vendors"],["10:00 am \u2013 4:30 pm","Mother's Room Open \u00b7 Kidz Club (Ages 4\u201312)"],["10:00 am \u2013 2:00 pm","Shrine Visitation \u2014 Kursk Root Icon"],["10:00 am \u2013 1:00 pm","Financial Strategic Planning & Budget Committee Meeting"],["10:30 am \u2013 2:00 pm","Finance Committee Meeting"],["10:30 am \u2013 4:00 pm","NAB Antiochian Women Meeting and Lunch"],["11:00 am \u2013 4:00 pm","Teen SOYO Meeting and Workshop"],["11:00 am \u2013 1:00 pm","St. Vladimir's Seminary Alumni Reception \u00b7 St. Tikhon's Seminary Alumni Reception"],["11:00 am \u2013 1:00 pm","Dept. of Inter-Orthodox / Inter-Faith Relations \u00b7 Dept. of Sacred Music"]]],["Afternoon",[["1:00 \u2013 4:00 pm","Antiochian Village Council Meeting"],["2:00 \u2013 4:00 pm","Hellenic College Holy Cross Reception \u00b7 Christian Education Ministry Workshop \u00b7 Dept. of Clergy Insurance & Retirement \u00b7 DCCP Meeting \u00b7 Dept. of Marriage & Parish Family Ministry \u00b7 Dept. of Missions & Evangelism \u00b7 Dept. of Stewardship \u00b7 Dept. of Lay Ministry \u00b7 Young Adult Ministry Meeting \u00b7 Workshops"],["2:00 \u2013 5:00 pm","Choir Workshop / Rehearsals \u00b7 Byzantine Choir Rehearsal"]]],["Evening",[["5:00 \u2013 6:00 pm","Vespers"],["6:00 \u2013 7:30 pm","Dinner on Your Own"],["8:00 \u2013 9:30 pm","Bible Bowl"],["9:30 \u2013 11:00 pm","Bible Bowl After-Social (Ticketed)"],["9:30 \u2013 10:30 pm","VIP Club (by invitation)"],["11:00 \u2013 11:30 pm","Compline"],["11:30 pm \u2013 12:00 am","\u201cAsk Abouna\u201d"]]]]},{"d":"22","n":"Thursday","s":"General Assembly Day","x":[["Morning",[["8:00 \u2013 8:45 am","Bible Study and Confessions"],["8:45 \u2013 10:00 am","Daily Orthros"],["10:00 am \u2013 9:00 pm","Hospitality Center \u00b7 Registration \u00b7 Exhibits & Vendors"],["10:00 am \u2013 4:30 pm","Mother's Room Open \u00b7 Kidz Club (Ages 4\u201312)"],["10:00 am \u2013 2:00 pm","Shrine Visitation \u2014 Kursk Root Icon"],["11:00 am \u2013 4:00 pm","Archdiocese General Assembly"],["11:00 am \u2013 4:30 pm","Teen Lunch and Social"]]],["Afternoon",[["4:00 \u2013 5:00 pm","Choir Rehearsal \u00b7 Byzantine Choir Rehearsal"],["5:00 \u2013 6:30 pm","Great Vespers with Artoklasia"]]],["Evening",[["6:30 \u2013 7:30 pm","Balamand Alumni Reunion"],["7:30 \u2013 11:00 pm","Evening Social Event \u2014 TBD (Ticketed)"],["9:30 \u2013 10:30 pm","VIP Club (by invitation)"],["11:00 \u2013 11:30 pm","Compline"],["11:30 pm \u2013 12:00 am","\u201cAsk Abouna\u201d"]]]]},{"d":"23","n":"Friday","s":"Divine Liturgy & Metropolitan's Address","x":[["Morning",[["7:30 \u2013 8:00 am","Orthros and Confessions"],["8:00 \u2013 10:00 am","Divine Liturgy"],["10:30 am \u2013 9:00 pm","Hospitality Center \u00b7 Registration \u00b7 Exhibits & Vendors"],["10:00 am \u2013 4:30 pm","Mother's Room Open"],["10:30 am \u2013 4:30 pm","Kidz Club (Ages 4\u201312)"],["10:30 am \u2013 2:00 pm","Shrine Visitation \u2014 Kursk Root Icon"]]],["Afternoon",[["11:00 am \u2013 1:00 pm","Metropolitan's Address & Archdiocese General Assembly"],["1:00 \u2013 3:00 pm","OCAN Lunch (by invitation)"],["4:00 \u2013 5:00 pm","Choir Rehearsal \u00b7 Byzantine Choir Rehearsal"],["5:00 \u2013 6:00 pm","Paraklesis with Order of Saint Ignatius Inductions"]]],["Evening",[["7:30 pm \u2013 12:00 am","Musical Show \u2014 TBD (Ticketed)"],["9:30 \u2013 10:30 pm","VIP Club (by invitation)"]]]]},{"d":"24","n":"Saturday","s":"Grand Banquet Night","x":[["Morning",[["8:00 \u2013 8:45 am","Bible Study and Confessions"],["8:45 \u2013 10:00 am","Daily Orthros"],["10:00 am \u2013 9:00 pm","Registration Open"],["10:00 am \u2013 1:00 pm","Hospitality Center \u00b7 Exhibits & Vendors"],["10:00 \u2013 11:00 am","Shrine Visitation \u2014 Kursk Root Icon"],["11:00 am \u2013 1:00 pm","Oratorical and Choir Festival"]]],["Afternoon",[["1:00 \u2013 3:00 pm","Archdiocese Board of Trustees Luncheon & Meeting"],["1:00 \u2013 3:00 pm","NAC Senior SOYO Alumni Reunion"],["1:00 \u2013 4:00 pm","Teen Lunch & Retreat \u00b7 Young Adult Lunch & Retreat"],["2:00 \u2013 3:30 pm","Choir Workshop / Rehearsal \u00b7 Byzantine Choir Workshop \u00b7 Workshop"],["2:45 \u2013 3:45 pm","Medical Professional Ministry Meeting"],["4:00 \u2013 5:00 pm","Great Vespers"]]],["Evening \u2014 Grand Banquet",[["6:00 \u2013 7:00 pm","Metropolitan Reception (invitation only)"],["6:00 pm \u2013 12:00 am","Grand Banquet \u00b7 Cocktail Hour 6\u20137 pm (Ticketed)"],["6:30 pm \u2013 12:00 am","Mother's Room Open \u00b7 Kidz Club Evening Edition (Ages 4\u201312)"],["9:30 \u2013 10:30 pm","VIP Club (by invitation)"]]]]},{"d":"25","n":"Sunday","s":"Closing Liturgy & Departure","x":[["Morning",[["8:45 \u2013 10:00 am","Orthros and Confessions"],["10:00 am \u2013 12:00 pm","Hierarchical Divine Liturgy"]]]]}];
  HOOKS['ac-schedule'] = function (r) {
    var tabs = r.querySelectorAll('[role=tab]'), panels = r.querySelectorAll('[role=tabpanel]');
    function show(i, focus) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (k) { e.preventDefault(); show((i + k + tabs.length) % tabs.length, true); }
      });
    });
  };
  define('ac-schedule', function (el) {
    var start = Math.max(0, Math.min(6, parseInt(el.getAttribute('day') || '0', 10) || 0));
    function name(t) {
      var out = esc(t).replace(/ \u00b7 /g, '<span class="dot"> \u00b7 </span>');
      return out.replace(/\s*\((Ticketed|by invitation|invitation only)\)/g, function (m, w) {
        return ' <span class="chip' + (w === 'Ticketed' ? ' tk' : '') + '">' + (w === 'Ticketed' ? 'Ticketed' : 'By invitation') + '</span>';
      });
    }
    var tabs = SCHED.map(function (d, i) {
      return '<button type="button" role="tab" id="t' + i + '" aria-controls="p' + i + '" aria-selected="' + (i === start) + '" tabindex="' + (i === start ? 0 : -1) + '">' +
        '<span class="dn">' + d.n.slice(0, 3) + '</span><span class="dd">7/' + d.d + '</span></button>';
    }).join('');
    var panels = SCHED.map(function (d, i) {
      return '<div role="tabpanel" id="p' + i + '" aria-labelledby="t' + i + '"' + (i === start ? '' : ' hidden') + '>' +
        '<div class="head"><div class="date"><b>' + d.d + '</b><span>July</span></div><div><h3>' + d.n + '</h3><p>' + esc(d.s) + '</p></div></div>' +
        d.x.map(function (s) {
          return '<div class="sec"><h4>' + esc(s[0]) + '</h4><ul>' + s[1].map(function (e) {
            return '<li><span class="tm">' + esc(e[0]) + '</span><span class="nm">' + name(e[1]) + '</span></li>';
          }).join('') + '</ul></div>';
        }).join('') + '</div>';
    }).join('');
    return '<style>' + BASE +
      ':host{height:100%}.card{background:#fff;border-radius:18px;box-shadow:0 0 0 1px rgba(13,7,69,.08),0 18px 40px -26px rgba(13,7,69,.4);overflow:hidden;display:flex;flex-direction:column;min-height:100%}[role=tabpanel]{flex:1 0 auto}' +
      '.tabs{display:flex;gap:8px;padding:18px 22px;background:' + NAVY + ';overflow-x:auto;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}' +
      '[role=tab]{all:unset;cursor:pointer;flex:1 0 auto;min-width:76px;text-align:center;padding:9px 12px;border-radius:999px;color:' + SHORE + ';box-shadow:inset 0 0 0 1.5px rgba(250,248,245,.35);font-family:Oswald,sans-serif;font-weight:500;letter-spacing:.12em;text-transform:uppercase;font-size:13px;line-height:1.2;transition:background .2s ease,color .2s ease}' +
      '[role=tab] .dd{display:block;font-size:11px;letter-spacing:.08em;opacity:.75;margin-top:2px}' +
      '[role=tab]:hover{background:rgba(250,248,245,.1)}[role=tab][aria-selected=true]{background:' + GOLD + ';color:' + NAVY + ';box-shadow:none}' +
      '[role=tab]:focus-visible{outline:2px solid ' + GOLD + ';outline-offset:2px}' +
      '[role=tabpanel]{padding:26px 30px 30px}' +
      '.head{display:flex;gap:16px;align-items:center;padding-bottom:18px;border-bottom:1px solid rgba(13,7,69,.12)}' +
      '.date{flex:none;width:60px;height:62px;border-radius:10px;background:' + NAVY + ';color:' + SHORE + ';display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Oswald,sans-serif}' +
      '.date b{font-size:26px;font-weight:600;line-height:1;color:' + GOLD + '}.date span{font-size:10px;letter-spacing:.18em;text-transform:uppercase;margin-top:3px}' +
      'h3{font-family:Oswald,sans-serif;font-weight:500;font-size:26px;margin:0;line-height:1.1}.head p{margin:3px 0 0;font-size:14px;color:rgba(13,7,69,.65)}' +
      '.sec{margin-top:18px}h4{font-family:Oswald,sans-serif;font-weight:500;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:' + MAROON + ';margin:0 0 4px}' +
      'ul{list-style:none;margin:0;padding:0}li{display:grid;grid-template-columns:172px 1fr;gap:16px;padding:8px 0;border-bottom:1px solid rgba(13,7,69,.07);font-size:14px;line-height:1.5}li:last-child{border-bottom:0}' +
      '.tm{color:rgba(13,7,69,.62);font-variant-numeric:tabular-nums;white-space:nowrap}.nm{color:' + NAVY + '}.dot{color:rgba(13,7,69,.35)}' +
      '.chip{display:inline-block;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:2px 7px;border-radius:999px;background:rgba(13,7,69,.07);color:rgba(13,7,69,.7);vertical-align:2px;white-space:nowrap}' +
      '.chip.tk{background:rgba(144,41,79,.1);color:' + MAROON + '}' +
      '.note{margin:0;padding:14px 30px 18px;font-size:12.5px;color:rgba(13,7,69,.6);border-top:1px solid rgba(13,7,69,.08);background:' + SHORE + '}' +
      '@media(max-width:600px){.tabs{padding:14px}[role=tab]{min-width:64px;padding:8px 10px}[role=tabpanel]{padding:20px 18px 22px}li{grid-template-columns:1fr;gap:0;padding:9px 0}.tm{font-size:12.5px}h3{font-size:22px}.note{padding:12px 18px 16px}}' +
      '@media(prefers-reduced-motion:reduce){[role=tab]{transition:none}}</style>' +
      '<div class="card"><div class="tabs" role="tablist" aria-label="Convention days">' + tabs + '</div>' + panels +
      '<p class="note">Times may change before the Convention. Ticketed events are added on when you register.</p></div>';
  }, ['day']);

  /* sponsors: sponsorship levels (comparison), event sponsorships (filterable) and Legacy Journal
     placements, in three tabs. attribute tab="levels|events|journal" */
  var TIER_FORM = 'https://saintandrew.churchofficechms.com/external/form/fa262a4f-ad11-496d-83c1-01d8d8be8b4a';
  var EVENT_FORM = 'https://saintandrew.churchofficechms.com/external/form/fceb608b-be91-4ab0-9638-38cae4ff47f7';
  var TIERS = [['Cornerstone', 25000], ['Foundation', 15000], ['Pillar', 10000], ['Heritage', 5000], ['Landmark', 2500]];
  var TROWS = [ /* label, values per tier (true = included, '' = not included) */
    ['Legacy Journal', ['Two-page spread or inside cover', 'Inside covers or two-page spread', 'Premier pages', 'Premier pages', 'One full page']],
    ['Event packages (ticket books, registration included)', ['10', '5', '2', '2', '2']],
    ['Premium seating at the Grand Banquet', [true, true, true, true, true]],
    ['Reserved seating at all applicable events', [true, true, true, true, true]],
    ['Invite-only luncheon with Metropolitan SABA', [true, true, true, '', '']],
    ['Invite-only event with Fr. Josiah Trenham', [true, true, true, '', '']],
    ['VIP event featuring Disneyland Fireworks', ['2 invitations', '2 invitations', '2 invitations', '2 invitations', '']],
    ['Recognition', ['Banner, podium and hotel lobby banner', 'Recognition banner', 'Recognition banner', 'Recognition banner', '']]
  ];
  var EVENTS = [['Grand Banquet', 10000], ['Clergy & Wives Breakfast', 10000], ['Board of Trustees Luncheon', 10000], ['Chapel', 5000],
    ['Convention Welcome Luncheon', 5000], ['Registration & Technology', 5000], ['Kidz Club', 5000], ['Teen Event', 4000], ['Hospitality Hub', 3000],
    ['Shrine for the Kursk Root Icon', 3000], ['Metropolitan\u2019s Reception', 3000], ['Young Adult Event', 2500], ['Entertainment Event (Wednesday evening)', 2500],
    ['Bible Bowl', 1000], ['Oratorical Festival', 1000]];
  var EV_INCL = ['Named recognition in the Convention program and the Legacy Journal', 'Signage at your event naming you or your honoree',
    'Spoken acknowledgment at the event', 'A listing on the Convention website and in official communications',
    'A certificate of appreciation from the host parish and Convention leadership'];
  var EV_BANDS = [['all', 'All events', 0, 1e9], ['10k', '$10,000', 10000, 10000], ['5k', '$5,000', 5000, 5000], ['mid', '$2,500 \u2013 $4,000', 2500, 4000], ['1k', '$1,000', 1000, 1000]];
  HOOKS['ac-sponsors'] = function (r) {
    var host = r.host;
    r.querySelectorAll('[role=tab]').forEach(function (t, i, all) {
      t.addEventListener('click', function () { host.setAttribute('tab', t.getAttribute('data-tab')); });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (k) { e.preventDefault(); var n = all[(i + k + all.length) % all.length]; host.setAttribute('tab', n.getAttribute('data-tab')); setTimeout(function () { var f = host.shadowRoot.querySelector('[role=tab][aria-selected=true]'); if (f) f.focus(); }, 0); }
      });
    });
    r.querySelectorAll('[data-tier]').forEach(function (b) { b.addEventListener('click', function () { host.setAttribute('tier', b.getAttribute('data-tier')); }); });
    r.querySelectorAll('[data-band]').forEach(function (b) {
      b.addEventListener('click', function () {
        var band = EV_BANDS.filter(function (x) { return x[0] === b.getAttribute('data-band'); })[0];
        r.querySelectorAll('[data-band]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        r.querySelectorAll('.ev').forEach(function (e) { var p = +e.getAttribute('data-p'); e.hidden = !(p >= band[2] && p <= band[3]); });
      });
    });
    r.querySelectorAll('.tcol').forEach(function (c) {
      c.addEventListener('mouseenter', function () { r.querySelectorAll('[data-col="' + c.getAttribute('data-col') + '"]').forEach(function (x) { x.classList.add('hl'); }); });
      c.addEventListener('mouseleave', function () { r.querySelectorAll('.hl').forEach(function (x) { x.classList.remove('hl'); }); });
    });
  };
  define('ac-sponsors', function (el) {
    var tab = el.getAttribute('tab') || 'levels', tier = Math.max(0, Math.min(4, parseInt(el.getAttribute('tier') || '0', 10) || 0));
    function money(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    var CHECK = '<svg viewBox="0 0 20 20" width="18" height="18" aria-label="Included"><circle cx="10" cy="10" r="9" fill="' + GOLD + '"/><path d="M6 10.4l2.6 2.6L14.2 7.4" fill="none" stroke="' + NAVY + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var DASH = '<span class="no" aria-label="Not included">\u2014</span>';
    function cell(v) { return v === true ? CHECK : v === '' ? DASH : esc(v); }
    var tabs = [['levels', 'Sponsorship levels', 'Levels'], ['events', 'Event sponsorships', 'Events'], ['journal', 'Legacy Journal', 'Journal']].map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (t[0] === tab) + '" tabindex="' + (t[0] === tab ? 0 : -1) + '"><span class="lg">' + t[1] + '</span><span class="sh">' + t[2] + '</span></button>';
    }).join('');
    var body = '';
    if (tab === 'levels') {
      var head = '<div class="mx"><div class="mh rl"></div>' + TIERS.map(function (t, i) {
        return '<div class="mh tcol" data-col="' + i + '"><span class="tn">' + t[0] + '</span><span class="tp">' + money(t[1]) + '</span></div>';
      }).join('');
      var rows = TROWS.map(function (row) {
        return '<div class="rl">' + esc(row[0]) + '</div>' + row[1].map(function (v, i) { return '<div class="mc tcol" data-col="' + i + '">' + cell(v) + '</div>'; }).join('');
      }).join('');
      var foot = '<div class="rl"></div>' + TIERS.map(function (t, i) {
        return '<div class="mc tcol" data-col="' + i + '"><a class="btn sm navy" href="' + TIER_FORM + '">Sponsor</a></div>';
      }).join('') + '</div>';
      var chips = '<div class="chips">' + TIERS.map(function (t, i) {
        return '<button type="button" data-tier="' + i + '" aria-pressed="' + (i === tier) + '"><span>' + t[0] + '</span><b>' + money(t[1]) + '</b></button>';
      }).join('') + '</div>';
      var card = '<div class="tcard"><div class="th"><span>' + TIERS[tier][0] + ' Sponsor</span><b>' + money(TIERS[tier][1]) + '</b></div><ul>' +
        TROWS.map(function (row) { var v = row[1][tier]; return v === '' ? '' : '<li>' + CHECK + '<span><em>' + esc(row[0]) + '</em>' + (v === true ? '' : '<strong>' + esc(v) + '</strong>') + '</span></li>'; }).join('') +
        '</ul><a class="btn navy" href="' + TIER_FORM + '">Become a ' + TIERS[tier][0] + ' Sponsor</a></div>';
      body = '<div class="desk">' + head + rows + foot + '</div><div class="mob">' + chips + card + '</div>' +
        '<p class="note">Every level includes a listing in the Legacy Journal and on the Convention website. Sponsorships are tax-deductible to the extent permitted by law.</p>';
    } else if (tab === 'events') {
      body = '<div class="filt" role="group" aria-label="Filter by amount">' + EV_BANDS.map(function (b, i) {
        return '<button type="button" data-band="' + b[0] + '" aria-pressed="' + (i === 0) + '">' + b[1] + '</button>';
      }).join('') + '</div><div class="evs">' + EVENTS.map(function (e) {
        return '<a class="ev" data-p="' + e[1] + '" href="' + EVENT_FORM + '"><span class="en">' + esc(e[0]) + '</span><span class="ep">' + money(e[1]) + '</span><span class="eg">Sponsor \u2192</span></a>';
      }).join('') + '</div><div class="incl"><h4>Every event sponsorship includes</h4><ul>' + EV_INCL.map(function (t) { return '<li>' + CHECK + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul></div>';
    } else {
      var groups = {}, order = [];
      JB.forEach(function (a) { var g = JB_GROUP[a[8]] || a[8]; if (!groups[g]) { groups[g] = []; order.push(g); } groups[g].push(a); });
      body = order.map(function (g) {
        return '<h4 class="jg">' + g + '</h4><div class="jt">' + groups[g].map(function (a) {
          var W = 36, H = 48, sc = W / 7.5, fill;
          if (a[0] === 'name') fill = '<i class="nl"></i><i class="nl"></i><i class="nl me"></i><i class="nl"></i>';
          else if (a[0] === 'cf') fill = '<i class="f" style="inset:0"></i>';
          else fill = '<i class="f ' + a[7] + '" style="left:0;top:0;width:' + Math.max(4, a[4] * sc) + 'px;height:' + Math.max(3, a[5] * sc) + 'px"></i>';
          var thumb = '<span class="mp' + (a[0] === 'cf' ? ' cfp' : '') + '" style="width:' + (a[0] === 'cf' ? W * 2 : W) + 'px;height:' + H + 'px">' + fill + '</span>';
          var spec = a[4] ? (Math.round(a[4] * 1000) / 1000) + '\u2033 \u00d7 ' + a[5] + '\u2033' : 'No artwork';
          return '<a class="jp" href="' + JOURNAL_FORM + '">' + thumb + '<span class="jn">' + JB_SHORT[a[0]] + '</span><span class="js">' + spec + (a[7] === 'g' ? ' \u00b7 greyscale' : '') + '</span><span class="jpz">' + money(a[2]) + '</span></a>';
        }).join('') + '</div>';
      }).join('') + '<p class="note">Tap any placement to reserve it through the Saint Andrew form. <a href="/journal">See each one drawn to scale in the book \u2192</a></p>';
    }
    return '<style>' + BASE +
      ':host{height:100%}.card{background:#fff;border-radius:18px;box-shadow:0 0 0 1px rgba(13,7,69,.08),0 18px 40px -26px rgba(13,7,69,.4);overflow:hidden;min-height:100%;display:flex;flex-direction:column}' +
      '.tabs{display:flex;gap:8px;padding:16px 20px;background:' + NAVY + ';overflow-x:auto;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}' +
      '[role=tab]{all:unset;cursor:pointer;flex:1 0 auto;text-align:center;padding:11px 16px;border-radius:999px;color:' + SHORE + ';box-shadow:inset 0 0 0 1.5px rgba(250,248,245,.35);font-family:Oswald,sans-serif;font-weight:500;letter-spacing:.12em;text-transform:uppercase;font-size:13px;transition:background .2s ease,color .2s ease}' +
      '[role=tab]:hover{background:rgba(250,248,245,.1)}[role=tab][aria-selected=true]{background:' + GOLD + ';color:' + NAVY + ';box-shadow:none}[role=tab]:focus-visible{outline:2px solid ' + GOLD + ';outline-offset:2px}' +
      '.pane{padding:24px 26px 26px;flex:1 0 auto}' +
      '.mx{display:grid;grid-template-columns:1.35fr repeat(5,1fr);font-size:13px}.mx>div{padding:10px 8px;border-bottom:1px solid rgba(13,7,69,.08);display:flex;align-items:center}' +
      '.rl{color:rgba(13,7,69,.72);padding-left:0!important}.mc{justify-content:center;text-align:center;color:' + NAVY + ';line-height:1.35}.mh{flex-direction:column;justify-content:center!important;border-bottom:2px solid ' + NAVY + '!important}' +
      '.tn{font-family:Oswald,sans-serif;font-weight:500;letter-spacing:.12em;text-transform:uppercase;font-size:12.5px}.tp{font-family:Oswald,sans-serif;font-weight:600;font-size:24px;color:' + MAROON + ';line-height:1.15}' +
      '.tcol{transition:background .15s ease;border-radius:0}.tcol.hl{background:rgba(253,206,62,.16)}.mx>div:nth-last-child(-n+6){border-bottom:0}' +
      '.no{color:rgba(13,7,69,.28);font-size:16px}.btn.sm{font-size:12px;padding:9px 18px;letter-spacing:.12em}' +
      '.note{margin:16px 0 0;font-size:12.5px;color:rgba(13,7,69,.6)}.note a{color:' + MAROON + '}' +
      '.mob{display:none}.chips{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
      '.chips button,.filt button{all:unset;box-sizing:border-box;cursor:pointer;border-radius:10px;padding:8px 10px;box-shadow:inset 0 0 0 1px rgba(13,7,69,.14);font-size:12.5px;display:flex;flex-direction:column;color:' + NAVY + '}' +
      '.chips b{font-family:Oswald,sans-serif;font-weight:500;font-size:16px}.chips button[aria-pressed=true],.filt button[aria-pressed=true]{background:' + NAVY + ';color:' + SHORE + ';box-shadow:none}' +
      '.tcard{margin-top:14px;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px rgba(13,7,69,.1)}.th{display:flex;justify-content:space-between;align-items:center;background:' + NAVY + ';color:' + SHORE + ';padding:12px 16px;font-family:Oswald,sans-serif;letter-spacing:.1em;text-transform:uppercase;font-size:13px}.th b{color:' + GOLD + ';font-size:22px;letter-spacing:0}' +
      '.tcard ul,.incl ul{list-style:none;margin:0;padding:12px 16px;display:grid;gap:9px}.tcard li,.incl li{display:grid;grid-template-columns:20px 1fr;gap:10px;font-size:13px;line-height:1.45;align-items:start}.tcard em{font-style:normal;display:block}.tcard strong{display:block;font-weight:500;color:' + MAROON + '}' +
      '.tcard .btn{margin:4px 16px 16px;display:block;text-align:center;font-size:13px;padding:12px}' +
      '.filt{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.filt button{flex-direction:row;font-family:Oswald,sans-serif;letter-spacing:.08em;text-transform:uppercase;font-size:12px;padding:8px 14px;border-radius:999px}' +
      '.evs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.ev{display:grid;grid-template-columns:1fr auto;grid-template-areas:"n p" "n g";gap:2px 12px;padding:13px 14px;border-radius:12px;background:' + SHORE + ';text-decoration:none;color:' + NAVY + ';box-shadow:inset 0 0 0 1px rgba(13,7,69,.06);transition:transform .15s ease,box-shadow .15s ease}' +
      '.ev[hidden]{display:none}.ev:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1.5px ' + GOLD + ',0 10px 20px -14px rgba(13,7,69,.5)}.en{grid-area:n;font-size:13.5px;line-height:1.35;align-self:center}.ep{grid-area:p;font-family:Oswald,sans-serif;font-weight:600;font-size:18px;color:' + MAROON + ';text-align:right}.eg{grid-area:g;font-family:Oswald,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(13,7,69,.55);text-align:right}' +
      '.incl{margin-top:18px;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(13,7,69,.1)}.incl h4,.jg{font-family:Oswald,sans-serif;font-weight:500;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:' + MAROON + ';margin:0}.incl h4{padding:14px 16px 0}.incl ul{grid-template-columns:1fr 1fr;column-gap:22px}' +
      '.jg{margin:12px 0 7px}.jg:first-child{margin-top:0}.jt{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.sh{display:none}' +
      '.jp{display:grid;justify-items:center;gap:2px;padding:10px 6px 8px;border-radius:12px;background:' + SHORE + ';text-decoration:none;color:' + NAVY + ';text-align:center;transition:transform .15s ease,box-shadow .15s ease}.jp:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1.5px ' + GOLD + ',0 10px 20px -14px rgba(13,7,69,.5)}' +
      '.mp{position:relative;background:#fff;border-radius:2px;box-shadow:0 0 0 1px rgba(13,7,69,.14),0 4px 10px -6px rgba(13,7,69,.4);margin-bottom:5px;overflow:hidden;display:block}.mp.cfp:after{content:"";position:absolute;top:0;bottom:0;left:50%;width:1px;background:rgba(13,7,69,.25)}' +
      '.f{position:absolute;background:' + NAVY + '}.f.g{background:#4a4a50}.f.gold{background:linear-gradient(135deg,#b8892a,#f3d27a 45%,#b8892a)}.f.silver{background:linear-gradient(135deg,#8d9196,#e9ebee 45%,#8d9196)}' +
      '.nl{display:block;height:3px;margin:5px 5px 0;border-radius:2px;background:rgba(13,7,69,.14)}.nl.me{background:' + GOLD + '}' +
      '.jn{font-size:12.5px;line-height:1.25;font-weight:500}.js{font-size:10.5px;color:rgba(13,7,69,.55)}.jpz{font-family:Oswald,sans-serif;font-weight:600;font-size:17px;color:' + MAROON + '}' +
      '@media(max-width:760px){.desk{display:none}.mob{display:block}.pane{padding:18px 14px 20px}.tabs{padding:12px;gap:6px}[role=tab]{font-size:12px;padding:9px 8px;letter-spacing:.1em}.lg{display:none}.sh{display:inline}.evs{grid-template-columns:1fr 1fr;gap:8px}.ev{grid-template-columns:1fr;grid-template-areas:"n" "p";padding:11px 10px}.ep{text-align:left;font-size:16px}.eg{display:none}.en{font-size:12.5px;align-self:start}.incl ul{grid-template-columns:1fr}.jt{grid-template-columns:repeat(3,1fr);gap:6px}.jn{font-size:11px}.js{font-size:9.5px}.jpz{font-size:15px}}' +
      '@media(prefers-reduced-motion:reduce){[role=tab],.ev,.jp,.tcol{transition:none}.ev:hover,.jp:hover{transform:none}}</style>' +
      '<div class="card"><div class="tabs" role="tablist" aria-label="Ways to support the Convention">' + tabs + '</div><div class="pane" role="tabpanel">' + body + '</div></div>';
  }, ['tab', 'tier']);

})();
