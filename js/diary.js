/*
 * Diary module responsible for fetching blog posts and rendering them on the
 * home page (latest posts) and the blog page.
 * Posts are loaded from a local JSON file (data/posts.json).  In a real
 * deployment you would fetch from a serverless function that proxies a
 * Google Sheet, as described in the website plan.
 */

(() => {
  const latestContainer = document.getElementById('posts-container');
  const blogContainer = document.getElementById('blog-posts');

  async function fetchPosts() {
    try {
      const res = await fetch('./data/posts.json');
      const posts = await res.json();
      // Sort by date descending
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      return posts;
    } catch (err) {
      console.error('Failed to load posts', err);
      return [];
    }
  }

  function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800';
    card.innerHTML = `
      <div class="h-48 w-full overflow-hidden">
        <img src="${post.image}" alt="${post.name}" class="w-full h-full object-cover" loading="lazy" />
      </div>
      <div class="p-4">
        <h3 class="font-playfair text-xl mb-1">${post.name}</h3>
        <time class="block text-xs text-gray-500 mb-2" datetime="${post.date}">${new Date(post.date).toLocaleDateString('de-CH')}</time>
        <p class="text-sm">${post.caption}</p>
      </div>
    `;
    return card;
  }

  // Render posts on page
  fetchPosts().then((posts) => {
    if (latestContainer) {
      posts.slice(0, 3).forEach((post) => {
        latestContainer.appendChild(createPostCard(post));
      });
    }
    if (blogContainer) {
      posts.forEach((post) => {
        blogContainer.appendChild(createPostCard(post));
      });
    }
  });
})();