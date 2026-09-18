# MainPortfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/9b2e1dd0-1d37-4d52-bdea-3024c75eb274/deploy-status)](https://app.netlify.com/projects/likashgunisetti/deploys)

Likash Gunisetti's personal portfolio: a single-page site covering background,
education, projects, experience, certifications, and skills, with a working
contact form.

Live: https://likashgunisetti.netlify.app/

## Sections

- **Home** — intro and social links
- **About** — bio and contact summary
- **Education** — academic history
- **Projects** — pulled from `assets/data/projects.json`
- **Experience** — internships and freelance work
- **Certifications** — pulled from `assets/data/certifications.json`
- **Skills** — pulled from `assets/data/skills.json`
- **Contact** — form sent via EmailJS

## Stack

Plain HTML/CSS/JS, no build step or framework. Third-party libraries
(jQuery, Typed.js, VanillaTilt, ScrollReveal, particles.js, EmailJS,
Font Awesome) are loaded via CDN or vendored under `assets/js/`.

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
