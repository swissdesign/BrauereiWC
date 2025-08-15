/*
 * Product modal handling for beer items.
 * When a user clicks on a beer item, this script displays detailed
 * information in a modal.  Beer metadata is defined below.
 */

(() => {
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('product-modal-body');
  const closeButtons = document.querySelectorAll('.product-modal-close');
  if (!modal || !modalBody) return;

  // Data for each beer; adjust as needed or fetch from a JSON endpoint
  const beerData = {
    ipa: {
      name: 'IPA',
      abv: '5.6 % ABV',
      tagline: 'More hops than a mountain goat.',
      notes: 'Bright citrus, pine resin and a crisp, bitter finish that echoes off the peaks.',
      pairs: 'Spicy food, sharp cheddar and summiting your goals.',
    },
    helles: {
      name: 'Helles',
      abv: '5.0 % ABV',
      tagline: 'Crisper than the alpine air.',
      notes: 'Subtle malt sweetness with a clean, refreshing finish.',
      pairs: 'Bratwurst, pretzels and lakeside afternoons.',
    },
    weizen: {
      name: 'Weizen',
      abv: '5.0 % ABV',
      tagline: 'Cloudy with a chance of genius.',
      notes: 'Classic notes of banana and clove with a soft, full‑bodied mouthfeel.',
      pairs: 'Weisswurst, salads and sunny patios.',
    },
  };

  // Attach click handlers to each beer item
  document.querySelectorAll('.beer-item').forEach((item) => {
    item.addEventListener('click', () => {
      const type = item.dataset.beer;
      const data = beerData[type];
      if (!data) return;
      // Build modal content
      modalBody.innerHTML = `
        <div class="flex flex-col items-center text-center">
          <div class="w-32 h-32 mb-4">
            <img src="./media/images/products/${type}.webp" alt="${data.name}" class="w-full h-full object-contain" />
          </div>
          <h3 class="font-playfair text-3xl mb-2">${data.name}</h3>
          <p class="italic mb-4">${data.tagline}</p>
          <p class="text-sm mb-2"><strong>ABV:</strong> ${data.abv}</p>
          <div class="text-left space-y-2">
            <p><strong>Tasting Notes:</strong> ${data.notes}</p>
            <p><strong>Pairs With:</strong> ${data.pairs}</p>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    });
  });

  // Close modal when clicking X or outside of content
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
})();