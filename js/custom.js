document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 0.5s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    });

    // Typed.js Initialization (requires Typed.js library)
    const typedEl = document.querySelector('.element');
    if (typedEl && typeof Typed !== 'undefined') {
        const strings = Array.from(typedEl.querySelectorAll('.sub-element')).map(el => el.textContent);
        new Typed('.element', {
            strings: strings,
            typeSpeed: 30,
            backSpeed: 20,
            backDelay: 2000,
            loop: true
        });
    }

    // Smooth scroll for links with data-scroll
    document.querySelectorAll('a[data-scroll]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar background toggle on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-dark', 'navbar-dark');
            navbar.classList.remove('bg-light', 'navbar-light');
        } else {
            navbar.classList.remove('bg-dark', 'navbar-dark');
            navbar.classList.add('bg-light', 'navbar-light');
        }
    });

    // Collapse navbar on link click (mobile)
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});