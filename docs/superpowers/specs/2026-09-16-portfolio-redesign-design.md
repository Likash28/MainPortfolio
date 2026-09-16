# Portfolio Redesign — Design Spec

Date: 2026-09-16

## Context

`MainPortfolio` is a static, single-page HTML/CSS/JS portfolio (no framework,
no build step) for Likash Gunisetti, deployed as a static site. The current
implementation has:

- A dated visual style (mixed accent colors, red scrollbar thumb, unstyled
  skills list, plain cards).
- Dead code: `script.js` contains an unused `fetchData`/`showSkills`/
  `showProjects` pipeline referencing `skills.json`/`projects.json` files
  that don't exist — actual content is hardcoded directly in `index.html`.
- Unreferenced leftover files from an earlier template:
  `assets/js/scrpt.js`, `assets/js/404.js`, `static/script.js`,
  `static/style.css`.
- A `#contact-form` EmailJS submit handler in `script.js` with no matching
  `<form id="contact-form">` anywhere in the HTML — dead wiring.
- Malformed markup (`class="work", id="projects"` stray commas) and several
  `href=""` placeholders (resume link, some project links).
- A dev-tools-blocking keydown handler (F12 / Ctrl+Shift+I/C/J / Ctrl+U).

## Goal

Redesign the site to a modern, cohesive dark aesthetic; restructure
skills/projects/certifications into JSON data files fetched at runtime;
fix the issues above; keep the project 100% vanilla (no npm, no build
tool).

## Non-goals

- No Gallery or Testimonials sections (README mentions them; out of scope).
- No new build tooling (Vite, bundlers, package.json).
- No invented URLs for empty links — placeholders only.
- Education and Experience sections stay hardcoded in HTML (short, timeline
  content, low churn — JSON would be overkill).

## Design

### 1. Visual redesign

- **Palette**: near-black background (`#0a0a0f`–`#12121a`), single accent
  color used consistently for links/buttons/highlights/progress bars
  (replacing today's mixed red/white accents). Define palette as CSS custom
  properties on `:root` in `assets/css/style.css` so the accent can be
  changed in one place.
- **Cards** (projects, certifications, education, experience): glassmorphism
  — translucent background, subtle border, backdrop blur, hover-lift with
  accent-colored glow shadow.
- **Typography**: keep Poppins for headings / Nunito for body (already
  imported); refine type scale and spacing consistency across sections.
- **Skills section**: replace plain unstyled `<span>` list with animated
  proficiency items grouped by category (ML/Data, Languages, Web, Tools),
  rendered from `assets/data/skills.json`.
- **Navbar**: sticky; adds a blurred/translucent background once the page
  is scrolled; refine the mobile menu open/close animation.
- **Hero particles**: keep `particles.min.js`, retint particle/line color
  to match the new accent/background.
- **Motion**: keep ScrollReveal and VanillaTilt, retune durations/easing so
  reveals feel smoother, not abrupt.
- **Responsiveness**: verify and extend existing breakpoints for small
  phones (current CSS already has some responsive rules — audit for gaps
  introduced by the new markup, e.g. the new Contact section and
  JSON-rendered cards).

### 2. Content restructuring

- New files:
  - `assets/data/skills.json` — `[{ name, category }]` (category one of:
    "ML & Data", "Languages", "Web", "Tools & Design").
  - `assets/data/projects.json` — `[{ name, image, links: { view, code } }]`
    (matches current project cards; `view`/`code` may be `"#"` placeholders
    where no real link exists today).
  - `assets/data/certifications.json` — `[{ name, image, link }]`.
- `assets/js/script.js` is rewritten to:
  - `fetch()` each JSON file and render its section's markup into the
    existing container elements (`#skills .row`, `.work .box-container`
    for projects, the certifications `.box-container`).
  - Re-run `VanillaTilt.init` / `ScrollReveal` reveal calls after each
    render, since content is now inserted after initial page load.
  - Drop the old half-written fetch pipeline entirely (superseded, not kept
    alongside).
- `index.html` loses the hardcoded project/certification card markup and
  the flat skill `<span>` list, replaced by empty container elements the
  script populates.

### 3. Fixes

- Add a **Contact section** (`<section class="contact" id="contact">`)
  with a form (`id="contact-form"`, fields: name, email, message, submit
  button) wired to the existing EmailJS handler in `script.js`. Add a
  matching `<li><a href="#contact">Contact</a></li>` nav entry (header +
  footer quick links).
- Fix malformed markup: remove stray commas in
  `<section class="work", id="...">` → `<section class="work" id="...">`.
- Empty `href=""` (resume button, project view/code links without a real
  URL) become `href="#"` with an inline HTML comment
  `<!-- TODO: replace with real link -->` marking exactly what needs
  filling in — never an invented URL.
- Remove the dev-tools-blocking `document.onkeydown` handler from
  `script.js`.
- Delete unreferenced files: `assets/js/scrpt.js`, `assets/js/404.js`,
  `static/script.js`, `static/style.css` (and `static/` dir if left
  empty).
- Keep the countapi.xyz visitor counter and EmailJS contact form
  functioning as today; only restyle their containers to match the new
  design.

### 4. Running the site

Because `script.js` now uses `fetch()` to load local JSON files, the site
must be served over `http://` — opening `index.html` directly via
`file://` will fail those fetches (CORS restriction on local files). The
README gets a short "Running locally" section documenting one of:

- `npx serve .` (Node, no install needed beyond npx)
- `python -m http.server 8000` (if Python is available)

then open the printed `localhost` URL.

## Testing / verification

No test framework exists or is being introduced (static site). Verification
is manual:

- Load the site via a local static server; confirm skills/projects/
  certifications render from JSON with no console errors.
- Confirm nav links (including new Contact) scroll-spy and smooth-scroll
  correctly.
- Confirm mobile menu toggle and responsive layout at common breakpoints
  (≤480px, ≤768px, ≤1024px).
- Confirm EmailJS submit handler fires against the new Contact form
  (submission itself depends on EmailJS account state, not verifiable
  here — visually confirm the handler binds and the success/failure alert
  paths are reachable).
- Confirm removed files are not referenced anywhere (`grep` for their
  filenames across `index.html`/`assets`).
