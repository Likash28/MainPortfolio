# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the static portfolio site (`index.html`, `assets/css/style.css`, `assets/js/script.js`) to a modern glassmorphic dark aesthetic, move skills/projects/certifications from hardcoded HTML into JSON files rendered at runtime, add a working Contact section, and clean up dead code/files — all while staying 100% vanilla (no build tool, no npm).

**Architecture:** One global CSS design-token layer (`:root` custom properties + shared `.btn`/`.card-surface` utilities) drives every section's look. `index.html` keeps its existing section structure/ids but gets empty containers for JSON-rendered sections plus a new Contact section. `assets/js/script.js` fetches `assets/data/*.json` at runtime and injects markup into those containers.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, flexbox/grid, backdrop-filter), vanilla JS + jQuery 3.6 (already CDN-loaded), Typed.js, VanillaTilt, ScrollReveal, EmailJS (all already CDN-loaded, unchanged).

## Global Constraints

- No build tool, no `package.json`, no bundler — the site must remain a static file tree servable by any static file server.
- No invented URLs: every link that has no real destination today becomes `"#"` with a visibly disabled/placeholder treatment, never a fabricated link.
- Keep the countapi.xyz visitor counter and the EmailJS contact-form integration functioning exactly as they do today (same EmailJS user id `user_TTDmetQLYgWCLzHTDgqxm`, service `contact_service`, template `template_contact`) — restyle only.
- Remove the dev-tools-blocking `document.onkeydown` handler and the `oncontextmenu="return false"` attribute on `<body>`.
- Education and Experience sections stay hardcoded in HTML (not JSON-driven).
- No Gallery or Testimonials sections are added.
- Because `fetch()` is used for local JSON, the site must be verified by serving it over HTTP (e.g. `npx serve .` or `python -m http.server`), not opened via `file://`.

---

### Task 1: Design tokens and full CSS redesign

**Files:**
- Modify: `assets/css/style.css` (full replacement of file contents)
- Modify: `assets/js/app.js` (retint particle colors only)

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces: CSS custom properties (`--bg`, `--bg-soft`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-2`, `--accent-gradient`, `--shadow-glow`, `--radius-lg`, `--radius-md`, `--radius-sm`, `--font-heading`, `--font-body`) and shared utility classes `.btn`, `.card-surface`, `.is-placeholder` that Tasks 2 and 3 rely on when writing new HTML/JS markup. Also produces a `header.scrolled` class toggle point (Task 3's `script.js` must add/remove this class — documented there) and section selectors: `.home`, `.about`, `.education`, `.work` (shared by both `#projects` and `#blogs` sections), `.skills` (`.skills-group`, `.skills .row`, `.skills .bar`), `.experience`, `.contact` (new), `.footer`, `#scroll-top`.

- [ ] **Step 1: Replace `assets/css/style.css` with the new stylesheet**

Replace the entire file contents with:

```css
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap");

:root {
  --bg: #0a0a0f;
  --bg-soft: #121218;
  --surface: rgba(255, 255, 255, 0.05);
  --surface-strong: rgba(255, 255, 255, 0.09);
  --border: rgba(255, 255, 255, 0.12);
  --text: #eef0f7;
  --text-muted: #a2a2b8;
  --accent: #8b5cf6;
  --accent-2: #22d3ee;
  --accent-gradient: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  --shadow-glow: 0 10px 35px rgba(139, 92, 246, 0.28);
  --radius-lg: 1.6rem;
  --radius-md: 1rem;
  --radius-sm: 0.6rem;
  --font-heading: "Poppins", sans-serif;
  --font-body: "Nunito", sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  outline: none;
  border: none;
  transition: all 0.2s ease;
}
html {
  font-size: 62.5%;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
}
*::selection {
  background: var(--accent);
  color: #fff;
}
html::-webkit-scrollbar {
  width: 0.8rem;
}
html::-webkit-scrollbar-track {
  background: var(--bg-soft);
}
html::-webkit-scrollbar-thumb {
  background: var(--accent-gradient);
  border-radius: 1rem;
}

section {
  min-height: 100vh;
  padding: 8rem 9% 4rem;
}
.heading {
  font-family: var(--font-heading);
  font-size: 3.6rem;
  font-weight: 800;
  text-align: center;
  color: var(--text);
  margin-bottom: 3rem;
}
.heading span,
h1 span,
h2 span,
h3 span {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* shared button */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.4rem 3rem;
  border-radius: 4em;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: 0.05rem;
  color: #fff;
  background: var(--accent-gradient);
  box-shadow: var(--shadow-glow);
  cursor: pointer;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(139, 92, 246, 0.4);
}
.btn i {
  transition: transform 0.3s ease;
}
.btn:hover i {
  transform: translateX(4px);
}

/* shared glass card */
.card-surface {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.card-surface:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: var(--shadow-glow);
}

/* disabled/placeholder links */
.is-placeholder {
  opacity: 0.45;
  pointer-events: none;
  cursor: not-allowed;
}

/* header / navbar */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 9%;
  background: rgba(10, 10, 15, 0.5);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
}
header.scrolled {
  background: rgba(10, 10, 15, 0.85);
  border-bottom-color: var(--border);
}
header .logo {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
header .logo i {
  color: var(--accent);
}
header .logo:hover {
  color: var(--accent);
}
#menu {
  font-size: 2.8rem;
  cursor: pointer;
  color: var(--text);
  display: none;
}
header .navbar ul {
  list-style: none;
  display: flex;
  gap: 2.4rem;
}
header .navbar ul li a {
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.03rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid transparent;
}
header .navbar ul li a.active,
header .navbar ul li a:hover {
  color: var(--text);
  border-bottom-color: var(--accent);
}

@media (max-width: 768px) {
  #menu {
    display: block;
  }
  header .navbar {
    position: fixed;
    top: 6.5rem;
    right: -120%;
    width: 75%;
    height: 100vh;
    background: rgba(10, 10, 15, 0.97);
    backdrop-filter: blur(20px);
    transition: right 0.4s ease;
  }
  header .navbar ul {
    flex-direction: column;
    padding: 2rem;
  }
  header .navbar ul li {
    width: 100%;
    margin: 0.8rem 0;
  }
  header .navbar ul li a {
    display: block;
    padding: 1.2rem;
    font-size: 1.8rem;
  }
  header .navbar.nav-toggle {
    right: 0;
  }
  .fa-times {
    transform: rotate(180deg);
  }
}

/* hero */
.home {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
  min-height: 100vh;
  padding-top: 10rem;
}
.home #particles-js {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.home .content {
  flex: 1 1 44rem;
  z-index: 1;
}
.home .content h2 {
  font-family: var(--font-heading);
  font-size: 5.2rem;
  font-weight: 800;
  color: var(--text);
}
.home .content p {
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 1.2rem 0 2rem;
}
.home .content p .typing-text {
  color: var(--accent-2);
}
.home .btn {
  position: relative;
  margin-top: 1rem;
}
.socials {
  margin-top: 6rem;
}
.socials .social-icons {
  list-style: none;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.social-icons a {
  width: 4.6rem;
  height: 4.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.9rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
}
.social-icons a:hover {
  background: var(--accent-gradient);
  color: #fff;
  transform: translateY(-4px);
}
.home .image {
  flex: 1 1 34rem;
  z-index: 1;
  display: flex;
  justify-content: center;
}
.home .image img {
  width: 80%;
  max-width: 38rem;
  border-radius: 50%;
  border: 3px solid var(--border);
  box-shadow: var(--shadow-glow);
}

@media (max-width: 450px) {
  .home {
    padding-top: 8rem;
  }
  .home .content h2 {
    font-size: 3.6rem;
  }
  .home .content p {
    font-size: 1.9rem;
  }
}

/* about */
.about {
  background: var(--bg-soft);
}
.about .row {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  align-items: center;
  padding: 4rem 0;
}
.about .row .image {
  flex: 1 1 30rem;
  text-align: center;
}
.about .row .image img {
  width: 80%;
  max-width: 36rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}
.about .row .content {
  flex: 1 1 44rem;
}
.about .row .content h3 {
  font-family: var(--font-heading);
  font-size: 3.6rem;
  color: var(--text);
}
.about .row .content .tag {
  display: inline-block;
  margin: 1rem 0;
  padding: 0.5rem 1.4rem;
  border-radius: 2em;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 1.4rem;
  color: var(--accent-2);
}
.about .row .content p {
  font-size: 1.6rem;
  color: var(--text-muted);
  line-height: 1.8;
  text-align: left;
}
.about .row .content .box-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}
.about .row .content .box-container .box {
  padding: 1.6rem 2rem;
  font-size: 1.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.about .row .content .box-container .box p span {
  color: var(--accent-2);
  font-weight: 700;
}
.resumebtn {
  margin-top: 3rem;
}

@media (max-width: 600px) {
  .about .row {
    flex-direction: column;
    padding: 2rem 0;
  }
}

/* education */
.education {
  background: var(--bg);
}
.education .box-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
}
.education .box-container .box {
  display: flex;
  width: 85%;
  max-width: 90rem;
  overflow: hidden;
}
.education .box-container .box .image {
  flex: 0 0 20rem;
}
.education .box-container .box .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.education .box-container .box .content {
  padding: 2rem;
}
.education .box-container .box .content h3 {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  color: var(--text);
}
.education .box-container .box .content p {
  font-size: 1.5rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
}
.education .box-container .box .content h4 {
  font-size: 1.5rem;
  color: var(--accent-2);
  margin-top: 0.6rem;
}

@media (max-width: 600px) {
  .education .box-container .box {
    flex-direction: column;
    width: 100%;
  }
  .education .box-container .box .image {
    flex-basis: 20rem;
  }
}

/* work: shared by #projects and #blogs (certifications) */
.work {
  background: var(--bg-soft);
}
.work .box-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}
.work .box-container .box {
  flex: 1 1 30rem;
  max-width: 34rem;
  overflow: hidden;
  padding: 0;
  display: block;
}
.work .box-container .box img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}
.work .box-container .box .content {
  padding: 1.6rem;
}
.work .box-container .box .content .tag h3 {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--text);
}
.work .box-container .box .btns {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
}
.work .box-container .box .btns a {
  flex: 1;
  text-align: center;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 1.3rem;
  font-weight: 700;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}
.work .box-container .box .btns a:hover {
  background: var(--accent-gradient);
  color: #fff;
}
.work .viewall {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

@media (max-width: 600px) {
  .work .box-container .box {
    max-width: 100%;
  }
}

/* skills */
.skills {
  background: var(--bg);
}
.skills .container {
  max-width: 110rem;
  margin: 0 auto;
}
.skills .skills-group {
  margin-bottom: 3rem;
}
.skills .skills-group h3 {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--accent-2);
  margin-bottom: 1.4rem;
  text-align: left;
}
.skills .row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}
.skills .bar {
  padding: 1rem 1.8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2em;
}
.skills .bar:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  background: var(--accent-gradient);
}
.skills .bar .info span {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
}
.skills .bar:hover .info span {
  color: #fff;
}

@media (max-width: 600px) {
  .skills .row {
    gap: 0.8rem;
  }
  .skills .bar {
    padding: 0.8rem 1.4rem;
  }
}

/* experience */
.experience {
  background: var(--bg-soft);
}
.experience .timeline {
  position: relative;
  max-width: 110rem;
  margin: 4rem auto 0;
  padding-top: 2rem;
}
.experience .timeline::after {
  content: "";
  position: absolute;
  width: 0.3rem;
  background: var(--border);
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -0.15rem;
}
.experience .container {
  padding: 1rem 4rem;
  position: relative;
  width: 50%;
}
.experience .container::after {
  content: "";
  position: absolute;
  width: 1.6rem;
  height: 1.6rem;
  top: 2rem;
  background: var(--accent-gradient);
  border-radius: 50%;
  z-index: 1;
}
.experience .left {
  left: 0;
}
.experience .right {
  left: 50%;
}
.experience .left::after {
  right: -0.8rem;
}
.experience .right::after {
  left: -0.8rem;
}
.experience .content {
  padding: 2rem;
}
.experience .content .tag h2 {
  font-family: var(--font-heading);
  font-size: 1.9rem;
  color: var(--text);
}
.experience .content .desc h3 {
  font-size: 1.5rem;
  color: var(--accent-2);
  margin-top: 0.6rem;
}
.experience .content .desc p {
  font-size: 1.4rem;
  color: var(--text-muted);
  margin-top: 0.8rem;
  line-height: 1.7;
}
.morebtn {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

@media (max-width: 600px) {
  .experience .timeline::after {
    left: 2.4rem;
  }
  .experience .container,
  .experience .right {
    width: 100%;
    left: 0;
    padding-left: 5.5rem;
    padding-right: 1rem;
  }
  .experience .left::after,
  .experience .right::after {
    left: 1.6rem;
  }
}

/* contact */
.contact {
  background: var(--bg);
}
.contact .container {
  max-width: 70rem;
  margin: 0 auto;
  padding: 3rem;
}
.contact form {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
.contact .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.contact label {
  font-size: 1.4rem;
  color: var(--text-muted);
}
.contact input,
.contact textarea {
  padding: 1.2rem 1.4rem;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 1.5rem;
}
.contact input:focus,
.contact textarea:focus {
  border-color: var(--accent);
}
.contact textarea {
  min-height: 14rem;
  resize: vertical;
}
.contact button.btn {
  align-self: flex-start;
  border: none;
}

/* footer */
.footer {
  background: var(--bg);
  border-top: 1px solid var(--border);
  min-height: auto;
}
.footer .box-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
  padding: 4rem 0 2rem;
}
.footer .box-container .box {
  flex: 1 1 26rem;
}
.footer .box-container .box h3 {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 1rem;
  font-weight: 700;
}
.footer .box-container .box p,
.footer .box-container .box a {
  font-size: 1.5rem;
  color: var(--text-muted);
  display: block;
  padding: 0.3rem 0;
}
.footer .box-container .box p i {
  color: var(--accent);
  margin-right: 0.8rem;
}
.footer .box-container .box a:hover {
  color: var(--accent-2);
}
.footer .share {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  list-style: none;
}
.footer .share a {
  width: 3.8rem;
  height: 3.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}
.footer .share a:hover {
  background: var(--accent-gradient);
  color: #fff;
}
.footer .credit {
  text-align: center;
  padding: 2rem 0;
  font-size: 1.3rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}
.footer .credit a {
  color: var(--accent-2);
}

/* scroll top */
#scroll-top {
  position: fixed;
  bottom: -10rem;
  right: 2rem;
  width: 4.6rem;
  height: 4.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-gradient);
  color: #fff;
  border-radius: 50%;
  font-size: 1.8rem;
  box-shadow: var(--shadow-glow);
  z-index: 1000;
  transition: bottom 0.4s ease;
}
#scroll-top.active {
  bottom: 2rem;
}

/* common breakpoints */
@media (max-width: 450px) {
  html {
    font-size: 55%;
  }
  section {
    padding: 6rem 5% 3rem;
  }
}
```

- [ ] **Step 2: Retint the particles background in `assets/js/app.js`**

In `assets/js/app.js`, change the two color values inside the `particlesJS('particles-js', {...})` config object so the particles match the new accent color:

Change:
```js
      "color": {
        "value": "#000000"
      },
```
to:
```js
      "color": {
        "value": "#8b5cf6"
      },
```

And change:
```js
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#000000",
        "opacity": 0.4,
        "width": 1
      },
```
to:
```js
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#8b5cf6",
        "opacity": 0.4,
        "width": 1
      },
```

Leave every other value in `app.js` unchanged.

- [ ] **Step 3: Sanity-check the CSS file has no unbalanced braces**

Run:
```bash
node -e "const s=require('fs').readFileSync('assets/css/style.css','utf8'); const open=(s.match(/\{/g)||[]).length; const close=(s.match(/\}/g)||[]).length; if(open!==close){console.error('MISMATCH', open, close); process.exit(1);} console.log('OK', open, 'rules');"
```
Expected: prints `OK <N> rules` with no mismatch error.

- [ ] **Step 4: Commit**

```bash
git add assets/css/style.css assets/js/app.js
git commit -m "redesign: modern dark glassmorphic visual system"
```

---

### Task 2: index.html structural fixes and additions

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `.btn`, `.card-surface`, `.is-placeholder` classes and `header`/`.contact`/`.work`/`.skills` selectors produced by Task 1.
- Produces: container elements `#skills-container`, `#projects-container`, `#certifications-container` (empty, to be populated by Task 3's `script.js`), and a `#contact-form` element with fields `from_name`, `from_email`, `message` that Task 3's EmailJS handler binds to.

- [ ] **Step 1: Remove the right-click block and fix malformed section tags**

Change:
```html
<body oncontextmenu="return false">
```
to:
```html
<body>
```

Change:
```html
<section class="work", id="projects">
```
to:
```html
<section class="work" id="projects">
```

Change:
```html
<section class="work", id="blogs">
```
to:
```html
<section class="work" id="blogs">
```

Change:
```html
<section class="skills", id="skills">
```
to:
```html
<section class="skills" id="skills">
```

- [ ] **Step 2: Add a Contact nav link to the header and mark the resume link as a placeholder**

In the header `<nav class="navbar"><ul>`, add a new `<li>` after the Certifications/Skills links:
```html
            <li><a class="active" href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#blogs">Certifications</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
```

In the About section, change:
```html
        <div class="resumebtn">
            <a href="" target="_blank" class="btn"><span>Resume</span>
                <i class="fas fa-chevron-right"></i>
            </a>
        </div>
```
to:
```html
        <div class="resumebtn">
            <!-- TODO: replace with real resume URL -->
            <a href="#" target="_blank" class="btn is-placeholder"><span>Resume</span>
                <i class="fas fa-chevron-right"></i>
            </a>
        </div>
```

- [ ] **Step 3: Add `card-surface` to the three static education boxes**

There are three `<div class="box">` elements inside `<section class="education" ...>`. Change each of the three to `<div class="box card-surface">` (same three boxes: GMR Institute of Technology, Narayana Junior College, Narayana High School).

- [ ] **Step 4: Replace the hardcoded Projects cards with an empty container**

Replace the entire `<div class="box-container">...</div>` block inside `<section class="work" id="projects">` (the block containing the six `<div class="box">` project cards, from the opening `<div class="box-container">` through its matching closing `</div>`, immediately before `<div class="viewall">`) with:
```html
    <div class="box-container" id="projects-container"></div>
```

- [ ] **Step 5: Replace the hardcoded Certifications cards with an empty container**

Replace the entire `<div class="box-container">...</div>` block inside `<section class="work" id="blogs">` (the block containing the six certification `<div class="box">` cards, immediately before `<div class="viewall">`) with:
```html
    <div class="box-container" id="certifications-container"></div>
```

- [ ] **Step 6: Replace the hardcoded skills list with an empty container**

Replace the entire `<div class="row">...</div>` block inside `<section class="skills" id="skills">` (the block containing all the `<div class="bar">` skill entries) with:
```html
      <div id="skills-container"></div>
```

- [ ] **Step 7: Add the Contact section**

Immediately before `<!-- footer section starts -->`, add:
```html
<!-- contact section starts -->
<section class="contact" id="contact">
  <h2 class="heading"><i class="fas fa-paper-plane"></i> Get In <span>Touch</span></h2>
  <div class="container card-surface">
    <form id="contact-form">
      <div class="form-group">
        <label for="from_name">Name</label>
        <input type="text" id="from_name" name="from_name" placeholder="Your name" required>
      </div>
      <div class="form-group">
        <label for="from_email">Email</label>
        <input type="email" id="from_email" name="from_email" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Say hello..." required></textarea>
      </div>
      <button type="submit" class="btn"><span>Send Message</span> <i class="fas fa-paper-plane"></i></button>
    </form>
  </div>
</section>
<!-- contact section ends -->
```

- [ ] **Step 8: Add a Contact quick link in the footer**

In the footer's "quick links" box, add Contact after Skills:
```html
      <div class="box">
          <h3>quick links</h3>
          <a class="active" href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#education">Education</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#blogs">Certifications</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
      </div>
```

- [ ] **Step 9: Verify the HTML edits**

Run:
```bash
grep -n 'class="work",' index.html; grep -n 'class="skills",' index.html; grep -n 'oncontextmenu' index.html
```
Expected: no output (all three patterns are gone — grep exits non-zero on no matches, which is expected here).

Run:
```bash
grep -n 'id="contact-form"\|id="skills-container"\|id="projects-container"\|id="certifications-container"' index.html
```
Expected: four matching lines, one per id.

- [ ] **Step 10: Commit**

```bash
git add index.html
git commit -m "fix: repair malformed markup, remove dev-tools block, add contact section and JSON containers"
```

---

### Task 3: JSON data files and script.js render pipeline

**Files:**
- Create: `assets/data/skills.json`
- Create: `assets/data/projects.json`
- Create: `assets/data/certifications.json`
- Modify: `assets/js/script.js` (full replacement of file contents)

**Interfaces:**
- Consumes: `#skills-container`, `#projects-container`, `#certifications-container`, `#contact-form` (with fields `from_name`, `from_email`, `message`) produced by Task 2. Consumes `.is-placeholder` class produced by Task 1.
- Produces: nothing further downstream (Task 4 only deletes unrelated legacy files and edits docs).

- [ ] **Step 1: Create `assets/data/skills.json`**

```json
[
  { "name": "Machine Learning", "category": "ML & Data" },
  { "name": "Deep Learning", "category": "ML & Data" },
  { "name": "Data Science", "category": "ML & Data" },
  { "name": "Computer Vision", "category": "ML & Data" },
  { "name": "NLP", "category": "ML & Data" },
  { "name": "SQL-LITE", "category": "ML & Data" },
  { "name": "SQL", "category": "ML & Data" },
  { "name": "Power BI", "category": "ML & Data" },
  { "name": "Tableau", "category": "ML & Data" },
  { "name": "C", "category": "Languages" },
  { "name": "Python", "category": "Languages" },
  { "name": "C++", "category": "Languages" },
  { "name": "Java Script", "category": "Languages" },
  { "name": "Bash", "category": "Languages" },
  { "name": "Shell Scripting", "category": "Languages" },
  { "name": "HTML", "category": "Web" },
  { "name": "CSS", "category": "Web" },
  { "name": "Flask", "category": "Web" },
  { "name": "React Js", "category": "Web" },
  { "name": "Stream LIT", "category": "Web" },
  { "name": "Canva", "category": "Tools & Design" },
  { "name": "Figma", "category": "Tools & Design" },
  { "name": "UI/UX", "category": "Tools & Design" },
  { "name": "Adobe XD", "category": "Tools & Design" }
]
```

- [ ] **Step 2: Create `assets/data/projects.json`**

```json
[
  {
    "name": "Hand-Gesture Game",
    "image": "handgestres.jpg",
    "links": { "view": "#", "code": "#" }
  },
  {
    "name": "Dalgona Coffee Mocha",
    "image": "coffee.jpg",
    "links": { "view": "#", "code": "#" }
  },
  {
    "name": "Rand_Portfolio",
    "image": "Randport.jpg",
    "links": { "view": "https://likash28.github.io/My-Potofolio/", "code": "#" }
  },
  {
    "name": "Iris Cataract Detection",
    "image": "cataract.jpg",
    "links": { "view": "#", "code": "#" }
  },
  {
    "name": "Hand-Gesture PPT-Controller",
    "image": "ppt.jpg",
    "links": { "view": "#", "code": "#" }
  },
  {
    "name": "Enzyme Thermo Stability Prediction & Sequence Generation",
    "image": "sequal.jpg",
    "links": {
      "view": "#",
      "code": "https://github.com/Likash28/Enzyme-Thermo-Stability-Predection-Sequence-Generation.git"
    }
  }
]
```

- [ ] **Step 3: Create `assets/data/certifications.json`**

```json
[
  {
    "name": "AWS Cloud Foundations",
    "image": "Blogs/AWS.jpg",
    "link": "https://www.credly.com/badges/fd6cf6ab-0497-468b-8158-659525391b6a/linked_in_profile"
  },
  {
    "name": "Introduction to ML",
    "image": "Blogs/Introduction_ML.jpg",
    "link": "https://archive.nptel.ac.in/noc/B2C/candidate_login/candidate_scores.php?courseid=noc22-cs97"
  },
  {
    "name": "Introduction Scripting-Python",
    "image": "Blogs/Intro_Scripting_Python.jpg",
    "link": "https://www.coursera.org/account/accomplishments/specialization/certificate/734H7KDZENRY"
  },
  {
    "name": "OOP in Java",
    "image": "Blogs/OOP_in_Java.jpg",
    "link": "https://www.coursera.org/account/accomplishments/certificate/YS84YJHWL7LL"
  },
  {
    "name": "UI/UX",
    "image": "Blogs/uiux.png",
    "link": "#"
  },
  {
    "name": "Power BI",
    "image": "Blogs/powerbi.png",
    "link": "#"
  }
]
```

- [ ] **Step 4: Validate the three JSON files parse**

Run:
```bash
node -e "['skills','projects','certifications'].forEach(f => { JSON.parse(require('fs').readFileSync('assets/data/'+f+'.json','utf8')); console.log(f, 'OK'); })"
```
Expected: three lines, each ending in `OK`.

- [ ] **Step 5: Replace `assets/js/script.js` with the new script**

Replace the entire file contents with:

```js
$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
            document.querySelector('header').classList.remove('scrolled');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // emailjs to mail contact form data
    $('#contact-form').submit(function (event) {
        event.preventDefault();
        emailjs.init('user_TTDmetQLYgWCLzHTDgqxm');

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById('contact-form').reset();
                alert('Message sent successfully!');
            }, function (error) {
                console.log('FAILED...', error);
                alert('Message failed to send. Please try again.');
            });
    });

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === 'visible') {
            document.title = 'Likash Gunisetti Portfolio';
            $('#favicon').attr('href', 'assets/images/Likas1');
        }
    });

// typed js effect
var typed = new Typed('.typing-text', {
    strings: ['Machine Learning', 'Data Science', 'Artificial Intelligence', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

// tilt.js effect on profile images
VanillaTilt.init(document.querySelectorAll('.tilt'), {
    max: 15,
});

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content h2', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });
srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .social-icons li', { interval: 150 });

srtop.reveal('.about .row .image', { delay: 200 });
srtop.reveal('.about .row .content', { delay: 300 });

srtop.reveal('.education .box', { interval: 200 });

srtop.reveal('.experience .timeline', { delay: 200 });
srtop.reveal('.experience .container', { interval: 200 });

srtop.reveal('.contact .container', { delay: 200 });

/* ===== JSON-driven content ===== */

async function loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return response.json();
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    const groups = {};
    skills.forEach(function (skill) {
        if (!groups[skill.category]) groups[skill.category] = [];
        groups[skill.category].push(skill);
    });

    let html = '';
    Object.keys(groups).forEach(function (category) {
        html += `<div class="skills-group"><h3>${category}</h3><div class="row">`;
        groups[category].forEach(function (skill) {
            html += `
        <div class="bar">
          <div class="info">
            <span>${skill.name}</span>
          </div>
        </div>`;
        });
        html += `</div></div>`;
    });

    container.innerHTML = html;
    srtop.reveal('.skills .bar', { interval: 40 });
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    let html = '';
    projects.forEach(function (project) {
        const viewClass = project.links.view === '#' ? 'is-placeholder' : '';
        const codeClass = project.links.code === '#' ? 'is-placeholder' : '';
        html += `
      <div class="box card-surface">
        <img draggable="false" src="./assets/images/projects/${project.image}" alt="${project.name}">
        <div class="content">
          <div class="tag">
            <h3>${project.name}</h3>
          </div>
          <div class="btns">
            <a href="${project.links.view}" target="_blank" class="${viewClass}"><i class="fas fa-eye"></i> View</a>
            <a href="${project.links.code}" target="_blank" class="${codeClass}">Code <i class="fas fa-code"></i></a>
          </div>
        </div>
      </div>`;
    });
    container.innerHTML = html;
    srtop.reveal('#projects-container .box', { interval: 150 });
}

function renderCertifications(certifications) {
    const container = document.getElementById('certifications-container');
    let html = '';
    certifications.forEach(function (cert) {
        const placeholderClass = cert.link === '#' ? 'is-placeholder' : '';
        html += `
      <a href="${cert.link}" target="_blank" class="box card-surface ${placeholderClass}">
        <img draggable="false" src="./assets/images/${cert.image}" alt="${cert.name}">
        <div class="content">
          <div class="tag">
            <h3>${cert.name}</h3>
          </div>
        </div>
      </a>`;
    });
    container.innerHTML = html;
    srtop.reveal('#certifications-container .box', { interval: 150 });
}

loadJSON('./assets/data/skills.json').then(renderSkills).catch(function (err) { console.error(err); });
loadJSON('./assets/data/projects.json').then(renderProjects).catch(function (err) { console.error(err); });
loadJSON('./assets/data/certifications.json').then(renderCertifications).catch(function (err) { console.error(err); });
```

- [ ] **Step 6: Verify the dev-tools block and dead fetch pipeline are gone**

Run:
```bash
grep -n 'onkeydown\|fetchData(\|showSkills(\|showProjects(' assets/js/script.js
```
Expected: no output (grep exits non-zero — expected, confirms the old handler/functions are gone from this file).

- [ ] **Step 7: Smoke-test the render pipeline against a local static server**

Run (in one terminal, backgrounded, then curl in a second command):
```bash
node -e "require('http').createServer((req,res)=>{const fs=require('fs'),path=require('path');let p=path.join(process.cwd(), req.url==='/'?'/index.html':req.url);fs.readFile(p,(e,d)=>{if(e){res.statusCode=404;res.end('not found');}else{res.end(d);}});}).listen(4173, ()=>console.log('up'))" &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/assets/data/skills.json
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/assets/data/projects.json
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/assets/data/certifications.json
kill %1
```
Expected: three lines each printing `200`.

- [ ] **Step 8: Commit**

```bash
git add assets/data/skills.json assets/data/projects.json assets/data/certifications.json assets/js/script.js
git commit -m "feat: drive skills/projects/certifications from JSON, remove dead code and dev-tools block"
```

---

### Task 4: Delete legacy files, document local run instructions, final verification

**Files:**
- Delete: `assets/js/scrpt.js`
- Delete: `assets/js/404.js`
- Delete: `static/script.js`
- Delete: `static/style.css`
- Modify: `README.md` (append a "Running locally" section)

**Interfaces:**
- Consumes: the final state of `index.html`/`assets/js/script.js` from Tasks 2–3 (to confirm nothing references the files being deleted).
- Produces: nothing consumed by further tasks (this is the last task).

- [ ] **Step 1: Confirm the legacy files are truly unreferenced**

Run:
```bash
grep -rn 'scrpt.js\|404.js\|static/script.js\|static/style.css' index.html assets/js/script.js assets/css/style.css
```
Expected: no output (confirms nothing in the live site references these files before deleting them).

- [ ] **Step 2: Delete the legacy files**

```bash
git rm assets/js/scrpt.js assets/js/404.js static/script.js static/style.css
```

If `static/` is now empty, remove it too:
```bash
rmdir static 2>/dev/null || true
```

- [ ] **Step 3: Add a "Running locally" section to README.md**

Append to the end of `README.md`:

```markdown
## Running locally

This is a static site with no build step, but the skills/projects/certifications
sections load data via `fetch()`, which browsers block on the `file://`
protocol. Serve the folder over HTTP instead:

```bash
# Option A: Node (no install needed)
npx serve .

# Option B: Python
python -m http.server 8000
```

Then open the printed `http://localhost:...` URL in your browser.
```

- [ ] **Step 4: Final verification pass**

Run:
```bash
grep -rn 'scrpt.js\|assets/js/404.js\|static/script.js\|static/style.css' . --include="*.html" --include="*.js" --include="*.css" --exclude-dir=docs
```
Expected: no output.

Run:
```bash
grep -n 'Running locally' README.md
```
Expected: one matching line.

Run:
```bash
git status --porcelain
```
Expected: clean (nothing beyond what's been committed already, aside from the README/deletion changes about to be committed in the next step).

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "chore: remove unreferenced legacy files, document how to run the site locally"
```

---

## Self-Review Notes

- **Spec coverage:** visual redesign (Task 1), JSON restructuring (Task 3), malformed markup / placeholder hrefs / dev-tools removal / contact section (Task 2), dead-file cleanup + running instructions (Task 4) — all spec sections have a corresponding task.
- **Placeholder scan:** no TBD/TODO-as-instruction items; the only `TODO` text is the intentional in-repo marker for the still-empty resume link, which the spec explicitly calls for.
- **Type/name consistency:** `#skills-container`, `#projects-container`, `#certifications-container`, `#contact-form` (fields `from_name`/`from_email`/`message`) are defined once in Task 2 and consumed with matching names in Task 3's `script.js`. `.is-placeholder`, `.card-surface`, `.btn` are defined once in Task 1 and reused verbatim in Tasks 2 and 3.
- **Scope:** contained to one plan; no sub-decomposition needed.

