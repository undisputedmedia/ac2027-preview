/* AC2027 SoCal — Wix custom elements (design pieces only).
   Text that crawlers must read lives in native Wix text, not here.
   Wix: Add > Embed Code > Custom Element > Server URL =
   https://undisputedmedia.github.io/ac2027-preview/wix/ac-elements.js  Tag name = ac-ratecard */
(function () {
  var BASE = 'https://undisputedmedia.github.io/ac2027-preview/fonts/';
  if (!document.getElementById('ac-fonts')) {
    var f = [['Oswald', 500], ['Oswald', 600], ['Poppins', 400], ['Poppins', 500]]
      .map(function (x) { return "@font-face{font-family:'" + x[0] + "';font-weight:" + x[1] +
        ";font-display:swap;src:url(" + BASE + x[0] + '-' + x[1] + ".woff2) format('woff2')}"; }).join('');
    var s = document.createElement('style'); s.id = 'ac-fonts'; s.textContent = f;
    document.head.appendChild(s);
  }
  var PASSKEY = 'https://book.passkey.com/go/2027SoCalAntiochianArchdiocese';
  var CSS = ':host{display:block;font-family:Poppins,Arial,sans-serif;color:#0D0745}' +
    '.card{background:#FAF8F5;border-radius:16px;padding:30px;box-sizing:border-box;width:100%}' +
    '.rate{font-family:Oswald,sans-serif;font-weight:600;font-size:56px;line-height:1;color:#90294F;margin:0}' +
    '.per{font-family:Oswald,sans-serif;font-weight:500;font-size:16px;letter-spacing:.09em;color:rgba(13,7,69,.58);text-transform:uppercase;margin:8px 0 0}' +
    'ul{list-style:none;padding:0;margin:24px 0 26px}' +
    'li{font-size:13px;color:rgba(13,7,69,.58);padding:9px 0;border-bottom:1px solid rgba(13,7,69,.13);display:flex;justify-content:space-between;gap:16px}' +
    'li:last-child{border-bottom:none}b{font-weight:500;color:#0D0745;text-align:right}' +
    'a{display:block;text-align:center;background:#FDCE3E;color:#0D0745;font-family:Oswald,sans-serif;font-weight:500;font-size:15px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:16px 24px;border-radius:999px}' +
    'a:hover{filter:brightness(.96)}' +
    '@media(max-width:600px){.rate{font-size:46px}.card{padding:24px}}';

  function define(name, cls) { if (!customElements.get(name)) customElements.define(name, cls); }

  define('ac-ratecard', class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var r = this.attachShadow({ mode: 'open' });
      r.innerHTML = '<style>' + CSS + '</style><div class="card">' +
        '<p class="rate">$209</p><p class="per">per night</p><ul>' +
        '<li>Room types <b>King or two Queens</b></li>' +
        '<li>Block window <b>July 17&ndash;25, 2027</b></li>' +
        '<li>Prepayment <b>Optional</b></li>' +
        '<li>Group booking <b>Multiple rooms, one booking</b></li></ul>' +
        '<a href="' + PASSKEY + '" target="_top">Reserve Your Room</a></div>';
    }
  });
})();
