P. Heiniger Design Website structure designed specifically for a future proof sebsite for the Brauerei Andermatt this serves as a strong foundation for a high end award winning website design.

BrauereiWC/
├── index.html               # Landing page – intro film, bar showcase and latest diary posts
├── brewery.html             # Detailed “About the brewery” page (accessible via link and scroll)
├── blog.html                # Full list of diary entries
├── css/
│   ├── tailwind.css         # Tailwind preflight and utilities
│   ├── styles.css           # Custom variables, dark mode styles, overrides
│   └── animations.css       # Optional keyframes (e.g., flicker, shimmer)
├── js/
│   ├── main.js              # Entry point that imports modules and registers service worker
│   ├── videoScroll.js       # Handles scroll‑scrubbing of the hero video and fade‑to‑black overlay
│   ├── carousel.js          # Controls beer‑can horizontal movement and partner logos marquee
│   ├── modal.js             # Opens/closes product modals and loads 3D models or images
│   ├── diary.js             # Fetches blog data from Google Sheets and renders posts
│   ├── contactForm.js       # Shows/hides the whisper form and submits data
│   └── vendors/
│       ├── gsap.min.js
│       ├── ScrollTrigger.min.js
│       ├── ScrollToPlugin.min.js
│       ├── Lenis.min.js
│       ├── three.min.js
│       └── axios.min.js
├── media/
│   ├── video/
│   │   ├── hero.mp4         # Drone fly‑through (optimised for modern codecs)
│   │   └── hero.webm        # WebM version (better compression on some browsers)
│   ├── images/
│   │   ├── products/
│   │   │   ├── ipa.webp
│   │   │   ├── helles.webp
│   │   │   ├── weizen.webp
│   │   │   └── keg.webp
│   │   ├── backgrounds/
│   │   │   └── bar.jpg      # Wooden bar photo (scaled for desktop & mobile)
│   │   ├── logos/
│   │   │   └── partner1.svg
│   │   └── brand/
│   │       ├── logo.svg     # Scalable vector logo for the brewery
│   │       └── favicon.ico
│   └── 3d/
│       └── cans.glb         # Optional GLB model for rotating cans
├── fonts/
│   └── inter-variable.woff2
├── data/
│   └── posts.json           # Local cache of blog entries (populated on first load)
├── manifest.json            # PWA manifest defining icons and theme colours
├── sw.js                    # Service worker for caching assets
├── robots.txt               # Robots directives for search engines
└── README.md                # Instructions for developers and build tools

Hand coded with help from AI by p. heiniger Design. 
