// =========================================================
// INSTAGRAM FEED & CAPTION PARSER
// =========================================================

function parsePriceFromCaption(caption) {
  if (!caption) return 0;
  const nairaMatch = caption.match(/[₦N]\s?(\d{1,3}(?:,\d{3})*)/);
  if (nairaMatch) return parseInt(nairaMatch[1].replace(/,/g, '')) || 0;
  const kMatch = caption.match(/(\d+)\s?[kK]/);
  if (kMatch) return parseInt(kMatch[1]) * 1000;
  return 0;
}

async function loadInstagramProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="col-span-full py-20 text-center text-neutral-400 italic">Connecting to the House of Fashion...</div>';

  const fallback = [
    { id: 'insta-1', name: 'Luxury Silk Boubou', price: 45000, icon: '👘', description: 'Handcrafted luxury ₦45,000' },
    { id: 'insta-2', name: 'Royal Gold Agbada', price: 85000, icon: '👑', description: 'Embrace royalty ₦85,000' },
    { id: 'insta-3', name: 'Ankara Couture', price: 32000, icon: '👗', description: 'Modern chic ₦32,000' }
  ];

  try {
    if (!INSTAGRAM_FEED_URL) {
      PRODUCTS = fallback;
    } else {
      const response = await fetch(INSTAGRAM_FEED_URL);
      const data = await response.json();
      const posts = Array.isArray(data) ? data : (data.posts || []);
      if (posts.length === 0) {
        PRODUCTS = fallback;
      } else {
        PRODUCTS = posts.map(post => ({
          id: post.id,
          name: post.caption ? post.caption.split('\n')[0].substring(0, 30) : 'RavePlus Exclusive',
          price: parsePriceFromCaption(post.caption) || 0,
          image: post.mediaUrl || post.media_url,
          description: post.caption || '',
          permalink: post.permalink
        }));
      }
    }
    renderProducts();
  } catch (error) {
    PRODUCTS = fallback;
    renderProducts();
  }
}

// =========================================================
// QUICK VIEW FUNCTIONS
// =========================================================
let currentQuickViewQty = 1;

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentQuickViewQty = 1; // Reset qty
  const qtyEl = document.getElementById('qvQty');
  if (qtyEl) qtyEl.textContent = currentQuickViewQty;

  const overlay = document.getElementById('quickViewOverlay');
  const img = document.getElementById('qvImage');
  const name = document.getElementById('qvName');
  const price = document.getElementById('qvPrice');
  const desc = document.getElementById('qvDesc');
  const addBtn = document.getElementById('qvAddToCart');
  const instaBtn = document.getElementById('qvInstagram');

  if (img) img.src = product.image || '';
  if (name) name.textContent = product.name;
  if (price) price.textContent = `₦${product.price.toLocaleString()}`;
  if (desc) desc.textContent = product.description;
  if (addBtn) addBtn.onclick = () => { addToCart(product.id, currentQuickViewQty); closeQuickView(); };
  
  if (instaBtn) {
    instaBtn.href = product.permalink || '#';
    instaBtn.style.display = product.permalink ? 'block' : 'none';
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateQuickViewQty(delta) {
  currentQuickViewQty += delta;
  if (currentQuickViewQty < 1) currentQuickViewQty = 1;
  const qtyEl = document.getElementById('qvQty');
  if (qtyEl) qtyEl.textContent = currentQuickViewQty;
}

function closeQuickView() {
  const overlay = document.getElementById('quickViewOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// =========================================================
// PRODUCTS RENDERING
// =========================================================
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (PRODUCTS.length === 0) {
    grid.innerHTML = '<div class="col-span-full py-20 text-center text-neutral-400 italic">The collection is currently backstage.</div>';
    return;
  }

  grid.innerHTML = PRODUCTS.map(product => `
    <div class="group product-card cursor-pointer" onclick="openQuickView('${product.id}')">
      <div class="aspect-[4/5] image-container mb-6 shadow-md hover:shadow-2xl transition-all duration-500">
        ${product.image ? 
          `<img src="${product.image}" class="product-image" loading="lazy">` : 
          `<div class="w-full h-full flex items-center justify-center text-7xl opacity-20">${product.icon || '✨'}</div>`
        }
        <button onclick="event.stopPropagation(); addToCart('${product.id}', 1)" class="absolute bottom-0 left-0 w-full py-5 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 z-10">
          Reserve Item
        </button>
      </div>
      <div class="space-y-1">
        <div class="flex justify-between items-baseline gap-4">
          <h3 class="luxury-heading text-xl truncate">${product.name}</h3>
          <p class="text-orange-600 font-bold text-sm shrink-0">₦${product.price.toLocaleString()}</p>
        </div>
        <span class="text-[9px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-orange-600 transition-colors inline-block">Tap for Details</span>
      </div>
    </div>
  `).join('');
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  loadInstagramProducts();
  if (typeof renderCart === 'function') renderCart();
  if (typeof updateAuthUI === 'function') updateAuthUI();
});
