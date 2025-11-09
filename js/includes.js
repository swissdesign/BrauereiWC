const basePath = document.body?.dataset.basePath || '.';

async function loadPartial(element) {
  const includeName = element.dataset.include;
  if (!includeName) return;

  const response = await fetch(`${basePath}/partials/${includeName}.html`);
  if (!response.ok) {
    console.error(`Failed to load partial: ${includeName}`);
    return;
  }

  const raw = await response.text();
  const html = raw.replace(/__BASE__/g, basePath);
  element.innerHTML = html;
}

const includeTargets = Array.from(document.querySelectorAll('[data-include]'));
if (includeTargets.length) {
  await Promise.all(includeTargets.map(loadPartial));
}

document.body.dataset.partialsLoaded = 'true';
document.dispatchEvent(new CustomEvent('partials:loaded'));
