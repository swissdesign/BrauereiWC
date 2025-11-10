const STORAGE_KEY = 'brauerei-language';
const DEFAULT_LANG = 'de';
const basePath = document.body?.dataset.basePath || '.';
const cache = new Map();
let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
let currentTranslations = null;
const subscribers = new Set();

function resolveKey(path, data) {
  return path.split('.').reduce((value, segment) => {
    if (value && typeof value === 'object' && segment in value) {
      return value[segment];
    }
    return undefined;
  }, data);
}

function applyTranslations(translations) {
  if (!translations) return;
  document.documentElement.lang = currentLang;
  const elements = document.querySelectorAll('[data-lang-key]');
  elements.forEach((element) => {
    const key = element.dataset.langKey;
    if (!key) return;
    const value = resolveKey(key, translations);
    if (value === undefined || value === null) {
      return;
    }
    const attribute = element.dataset.langAttr;
    if (attribute) {
      element.setAttribute(attribute, value);
    } else {
      element.innerHTML = value;
    }
  });

  document.querySelectorAll('[data-lang-switch]').forEach((button) => {
    const isActive = button.dataset.langSwitch === currentLang;
    button.classList.toggle('is-active', isActive);
  });

  document.dispatchEvent(
    new CustomEvent('i18n:applied', {
      detail: { lang: currentLang, translations },
    }),
  );
}

async function loadLanguage(lang) {
  if (cache.has(lang)) {
    return cache.get(lang);
  }

  const response = await fetch(`${basePath}/i18n/${lang}.json`, {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error(`Failed to load language file: ${lang}`);
  }
  const data = await response.json();
  cache.set(lang, data);
  return data;
}

async function setLanguage(lang = DEFAULT_LANG) {
  if (!lang) {
    lang = DEFAULT_LANG;
  }
  if (lang === currentLang && currentTranslations) {
    applyTranslations(currentTranslations);
    return currentTranslations;
  }

  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, currentLang);
  try {
    currentTranslations = await loadLanguage(currentLang);
    applyTranslations(currentTranslations);
    subscribers.forEach((callback) => {
      try {
        callback(currentLang, currentTranslations);
      } catch (error) {
        console.error('i18n subscriber failed', error);
      }
    });
  } catch (error) {
    console.error('Unable to switch language', error);
  }
  return currentTranslations;
}

function getCurrentLanguage() {
  return currentLang;
}

function subscribe(callback) {
  if (typeof callback !== 'function') return () => {};
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function handleLanguageToggle(event) {
  const target = event.target.closest('[data-lang-switch]');
  if (!target) return;
  event.preventDefault();
  const lang = target.dataset.langSwitch;
  if (lang) {
    setLanguage(lang);
  }
}

document.addEventListener('click', handleLanguageToggle);

document.addEventListener('partials:loaded', () => {
  if (currentTranslations) {
    applyTranslations(currentTranslations);
  } else {
    setLanguage(currentLang);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});

window.BrauereiI18n = {
  setLanguage,
  getLanguage: getCurrentLanguage,
  subscribe,
  resolveKey,
  DEFAULT_LANG,
};
