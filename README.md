# Brauerei Andermatt — P. Heiniger Design

This repository contains the prototype for the **Brauerei Andermatt** website.  It has been refactored for rapid AI‑assisted prototyping: all JavaScript has been consolidated into a single `app.js`, and all custom styles live in one `styles.css`.  The goal is to provide a future‑proof foundation for a high‑end, award‑winning website.

├── index.html        # Landing page: hero, bar showcase and latest diary posts
├── app.js            # Single entry point; preloader, scroll triggers, modals, diary and contact form
├── styles.css        # Single stylesheet: variables, theme definitions, resets and overrides
├── media/            # Video, images, icons and optional 3D assets
├── data/
│   └── posts.json    # Local cache of diary posts (populated on first load or via CMS)
└── README.md         # This file

## Key features

- **Preloader:** An animated brewery logo plays once on load and fades into the page using GSAP.
- **Scroll‑controlled hero:** The hero video scrubs in sync with scroll and fades to black before transitioning to the bar section.
- **Beer carousel:** Horizontally‑arranged beer slides with modal pop‑ups for detailed information.
- **Partner marquee:** An infinite marquee of partner logos that loops smoothly.
- **Diary section:** Renders the latest posts from `data/posts.json` on the landing page; the full blog page (if present) lists all posts.
- **Contact form:** A modal “Whisper” form with a simple honeypot and success message.

## Building / running

This prototype uses CDN versions of GSAP and Tailwind CSS; no build step is required.  Simply serve the project via a static server and open `index.html` (or `brewery.html` / `blog.html`) in your browser.  For local testing of the diary posts you may need to serve the files over HTTP rather than opening via `file://` to avoid CORS restrictions when fetching `data/posts.json`.

Hand‑coded with help from AI by P. Heiniger Design.
