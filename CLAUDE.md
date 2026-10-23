> **Auto-deploy allowed.** Before every push: run a build/lint check if available; after deploy, confirm the live site loads. Log each deploy in structure.md.
>
> (structure.md = Google Drive `Work/_System/structure.md`, section "Deploy log".)

# AC2027 SoCal — site preview

Static site for the 58th Biennial Antiochian Archdiocese Convention.
No build step. Plain HTML + one stylesheet. GitHub Pages serves `/` from `main`.

Live: https://undisputedmedia.github.io/ac2027-preview/

## Layout

```
index.html          Home (mirror of Wix NEW Home — see "Mirror pages" below)
about.html          What is the Convention — Q&A, host parish, venue
schedule.html       Week structure (program NOT confirmed)
sponsorships.html   Tiers, event sponsorships, Legacy Journal rates
hotel.html          Hotel & room block — rate card, booking/payment, Riverside note
faq.html            25 Q&As + FAQPage JSON-LD (schema text must match visible text)
registration.html   How registration works — not open yet, hands off later
contact.html        info@ac2027socal.com + facts sidecard
host-parish.html    Saint Andrew facts (from saintandrew.net), Riverside-vs-Anaheim note
wix/ac-elements.js  Wix custom elements: ac-header, ac-ratecard, ac-buttons, ac-hero-bg, ac-footer-links. Design only; text stays native in Wix. ASCII-only
travel.html, things-to-do.html, media.html, legal pages, disneyland.html (unlisted)
css/site.css        Every style. Shared by all pages.
js/nav.js           Mobile Menu toggle (below 1100px)
fonts/              Oswald 300/400/500/600, Poppins 300/400/500/600, Great Vibes 400
img/mark.png        Convention mark, transparent
img/sunset.jpg      Hero photograph
```

Edit the HTML directly. Edit `css/site.css` for anything visual.
Do not inline styles into pages — they share one sheet on purpose.


## Mirror pages — the preview now matches the Wix build (Oct 17, 2026)

These pages are **generated from the Wix editor**, not hand-edited:
`index.html, about.html, hotel.html, registration.html, schedule.html, faq.html, contact.html,
host-parish.html, sponsorships.html, journal.html, get-notified.html` + `css/mirror.css` + `js/mirror.js`.

- Each Wix section is a full-width band; every text box and element sits at its exact Wix
  desktop position inside a 980px grid. Text, links, titles and meta descriptions are copied
  from Wix. Header, hero, buttons, rate card, journal samples and footer links are the same
  custom elements Wix uses (`wix/ac-elements.js`), so they are identical by construction.
- Links: NEW pages point at each other here. Pages Wix keeps from the old site
  (Vendors, Volunteer) open the live ac2027socal.com page.
- Desktop only, like the Wix build (mobile layouts aren't built yet). The form is a static
  look-alike; it doesn't submit.
- To refresh after Wix changes: rerun the extractor in `tools/wix-mirror/` (see its README),
  then `python3 render.py` and copy `out/` here. Don't hand-edit the mirror pages — the next
  sync overwrites them. Edit Wix instead.
- `travel.html, things-to-do.html, media.html` and the legal pages are the older design
  proposals. Nothing links to them any more.

---

## Palette — locked. Do not introduce new colours.

| Token | Hex | Use |
|---|---|---|
| Night Navy | `#0D0745` | Ink, dark grounds, primary buttons |
| Shore White | `#FAF8F5` | The page ground, cards, panels |
| Sun Gold | `#FDCE3E` | Accent on navy only |
| Sunset Orange | `#FDA04D` | Bullets, gradient mid |
| Dusk Pink | `#FB5063` | Gradient mid |
| Deep Maroon | `#90294F` | Eyebrows, prices, accent on light |

`#AB284A` is a gradient terminus only — never a fill.

**No pure `#ffffff` grounds.** Shore White is the light surface. Alternate
sections with `rgba(13,7,69,.035)`, not white. The one exception is
`.btn-white` in the hero, which sits on a photograph.

### Contrast rules that actually bite

- Deep Maroon on Night Navy is **2.3:1 — fails.** On navy, accents must be Sun Gold.
- Sun Gold on Shore White is too low for text. On light, accents must be Deep Maroon.
- Buttons on navy: gold fill, navy ink. Buttons on light: navy fill, Shore White ink.
- Never white text on Sun Gold or Sunset Orange. Navy ink on warm colours, always.

## Type

- **Oswald** — display, headings, eyebrows, buttons, labels. Uppercase, tracked.
- **Poppins** — body. 300 for leads, 400 for copy.
- **Great Vibes** — ceremonial only. Hero script line. Minimum 44px.
  Hidden below 900px via `@media(max-width:900px){.script{display:none}}` — keep that.

Scale: 61 / 49 / 39 / 31 / 25 / 20 / 16 / 13 / 10.
Measure caps at ~66ch.

## Naming

Use **"The 58th Biennial Antiochian Archdiocese Convention"** in the footer
canonical block and page titles. Shorter forms are fine in body copy.
Do not introduce "AOCANA" or new variants — there are already five competing
strings in circulation and that is a known problem.

## Facts — do not change without checking

- Dates: **July 19–25, 2027** (Monday through Sunday). Confirmed by the exec team (Oct 11, 2026).
- Venue: Hilton Anaheim, 777 W Convention Way, Anaheim, CA 92802
- Host: Saint Andrew Orthodox Christian Church, Riverside, California
- Rooms: $209/night, block runs July 17–25
- Booking: https://book.passkey.com/go/2027SoCalAntiochianArchdiocese
- Contact: info@ac2027socal.com

Registration is **not** open. Hotel CTAs say "Reserve Your Room" and must never
imply event registration. Every hotel section carries the line: *This is the
hotel only. Event registration opens later this year.*

## Known issues

- `img/mark.png` was matted out of a flattened kit file. The wordmark carries
  source damage — the **C**'s lower stroke is thin, the **a**'s bowl is flat.
  Invisible at 150px, wrong for print. A repaired master exists as
  `AC2027-master-lockup-REPAIRED.png` and should replace this file.
- The mark has no true reversed version. It cannot sit on Night Navy.
- Schedule day assignments are partly inferred. General Assembly on Thursday is
  from the FAQ doc. Other days show "Coming soon" until the committee confirms them.
- Photography is one stock frame. Real St Andrew footage is the gap.

## Deploying

Push to `main`. GitHub Pages redeploys in about a minute. No build.
