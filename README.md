# MainPortfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/9b2e1dd0-1d37-4d52-bdea-3024c75eb274/deploy-status)](https://app.netlify.com/projects/likashgunisetti/deploys)

Likash Gunisetti's personal portfolio: a single-page site covering background,
education, projects, experience, certifications, and skills, with a working
contact form.

Live: https://likashgunisetti.netlify.app/

Single-page, light/dark theme (persisted, defaults to OS preference), no
build step, no JS framework and no jQuery — the design follows
[venugopalkadamba.github.io](https://github.com/venugopalkadamba/venugopalkadamba.github.io)'s
structure and visual system.

## Sections

- **Home** — intro and social links
- **About** — bio + contact/profile card
- **Experience** / **Internships** — timeline entries
- **Education** — text-only cards
- **Projects** — pulled from `assets/data/projects.json`
- **Skills** — pulled from `assets/data/skills.json`
- **Certifications** — pulled from `assets/data/certifications.json`
- **Contact** — form sent via EmailJS

## Stack

Plain HTML/CSS + vanilla JS, no build step, no frameworks, no jQuery.
Third-party dependencies kept: **EmailJS** (contact form) and
**Font Awesome** (icons) via CDN, plus **DM Sans**/**Fraunces** from
Google Fonts.

## Running locally

The Projects/Certifications/Skills sections load their data via `fetch()`,
which browsers block on the `file://` protocol. Serve the folder over HTTP
instead: 

```bash
# Option A: Node (no install needed)
npx serve .

# Option B: Python
python -m http.server 8000
```

Then open the printed `http://localhost:...` URL in your browser.

## Editing content

- Projects, certifications, and skills live in `assets/data/*.json` — edit
  those instead of `index.html`.
- Everything else (bio, education, experience, contact info) is directly in
  `index.html`.
