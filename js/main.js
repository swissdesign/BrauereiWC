/**
 * Brauerei Andermatt - Main JavaScript File
 *
 * This file contains modular JavaScript for site-wide functionality.
 * It is loaded on all pages and initializes modules upon DOM content load
 * once shared partials (header, footer, etc.) are available.
 *
 * Table of Contents:
 * 1. Initialization Orchestrator
 * 2. Mobile Navigation Toggle
 * 3. Language Switcher
 * 4. Dynamic Year for Footer
 */

let initializersRan = false;

function initMobileNav() {
  const menuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuButton || !mobileMenu) {
    return;
  }

  const toggleMenu = () => {
    const isActive = !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', isActive);
    mobileMenu.classList.toggle('hidden', !isActive);
    menuButton.setAttribute('aria-expanded', String(isActive));

    const iconPath = isActive
      ? 'M6 18L18 6M6 6l12 12'
      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12';
    const icon = menuButton.querySelector('svg path');
    if (icon) {
      icon.setAttribute('d', iconPath);
    }
  };

  menuButton.addEventListener('click', toggleMenu);
}

function initLanguageToggle() {
  const switcher = document.getElementById('lang-switcher');
  if (!switcher) {
    return;
  }

  const langDe = switcher.querySelector('.lang-de');
  const langEn = switcher.querySelector('.lang-en');
  const translatableElements = document.querySelectorAll('[data-de], [data-en]');
  const htmlTag = document.documentElement;

  const updateContent = (lang) => {
    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.tagName === 'TITLE') {
          document.title = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    htmlTag.setAttribute('lang', lang);

    if (langDe && langEn) {
      if (lang === 'de') {
        langDe.classList.add('font-bold');
        langDe.classList.remove('text-stone-400');
        langEn.classList.remove('font-bold');
        langEn.classList.add('text-stone-400');
      } else {
        langEn.classList.add('font-bold');
        langEn.classList.remove('text-stone-400');
        langDe.classList.remove('font-bold');
        langDe.classList.add('text-stone-400');
      }
    }
  };

  const setLanguage = (lang) => {
    localStorage.setItem('brauereiLang', lang);
    updateContent(lang);
  };

  switcher.addEventListener('click', () => {
    const currentLang = localStorage.getItem('brauereiLang') || 'de';
    const newLang = currentLang === 'de' ? 'en' : 'de';
    setLanguage(newLang);
  });

  const initialLang = localStorage.getItem('brauereiLang') || 'de';
  updateContent(initialLang);
}

function initDynamicYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function runInitializers() {
  if (initializersRan) {
    return;
  }
  initializersRan = true;

  initMobileNav();
  initLanguageToggle();
  initDynamicYear();
}

document.addEventListener('partials:loaded', runInitializers);

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-include]') || document.body.dataset.partialsLoaded === 'true') {
    runInitializers();
  }
});
