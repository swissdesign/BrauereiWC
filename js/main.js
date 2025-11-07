/**
 * Brauerei Andermatt - Main JavaScript File
 *
 * This file contains modular JavaScript for site-wide functionality.
 * It is loaded on all pages and initializes modules upon DOM content load.
 *
 * Table of Contents:
 * 1. Global Initializer
 * 2. Mobile Navigation Toggle
 * 3. Language Switcher
 * 4. Dynamic Year for Footer
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Module 2: Mobile Navigation Toggle
     * Handles the opening and closing of the mobile navigation menu.
     */
    const mobileNav = (() => {
        const menuButton = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuButton || !mobileMenu) {
            console.error("Mobile navigation elements not found.");
            return; // Exit if essential elements are missing
        }

        menuButton.addEventListener('click', () => {
            // Instead of toggling 'hidden', we toggle a CSS class for animations
            mobileMenu.classList.toggle('active');
            
            // Optional: Change button icon on toggle
            const iconPath = mobileMenu.classList.contains('active') 
                ? 'M6 18L18 6M6 6l12 12' // Close (X) icon
                : 'M4 6h16M4 12h16m-7 6h7'; // Hamburger icon
            menuButton.querySelector('svg path').setAttribute('d', iconPath);
        });
    })();


    /**
     * Module 3: Language Switcher
     * Toggles content between German (de) and English (en) using data attributes.
     * Stores the selected language in localStorage to persist the choice.
     */
    const languageToggle = (() => {
        const switcher = document.getElementById('lang-switcher');
        if (!switcher) {
            console.error("Language switcher not found.");
            return;
        }

        const langDe = switcher.querySelector('.lang-de');
        const langEn = switcher.querySelector('.lang-en');
        const translatableElements = document.querySelectorAll('[data-de], [data-en]');
        const htmlTag = document.documentElement;

        const updateContent = (lang) => {
            translatableElements.forEach(el => {
                const text = el.getAttribute(`data-${lang}`);
                // Only update if text exists, otherwise keep current
                if (text) {
                    // Handle special cases like title tag
                    if (el.tagName === 'TITLE') {
                        document.title = text;
                    } else {
                        el.innerHTML = text;
                    }
                }
            });
            
            // Update HTML lang attribute for accessibility
            htmlTag.setAttribute('lang', lang);

            // Update switcher UI
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

        // Initialize on page load
        const initialLang = localStorage.getItem('brauereiLang') || 'de';
        updateContent(initialLang);
    })();


    /**
     * Module 4: Dynamic Year for Footer
     * Sets the current year in the footer copyright notice.
     */
    const dynamicYear = (() => {
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    })();

});
