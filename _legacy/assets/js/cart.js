// =========================================================
// CART FUNCTIONS
// =========================================================
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }

  localStorage.setItem('raveplus_cart', JSON.stringify(cart));
  renderCart();
  toggleDrawer('cart');
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('raveplus_cart', JSON.stringify(cart));
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      localStorage.setItem('raveplus_cart', JSON.stringify(cart));
      renderCart();
    }
  }
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const badge = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');

  if (!container || !badge || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-neutral-400 italic text-center py-20">The House is currently empty.</p>';
    badge.textContent = '0';
    totalEl.textContent = '₦0';
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  badge.textContent = count;
  totalEl.textContent = `₦${total.toLocaleString()}`;

  container.innerHTML = cart.map(item => `
    <div class="flex gap-6 items-center border-b border-neutral-50 pb-6">
      <div class="w-16 h-20 bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0">
        ${item.image ? 
          `<img src="${item.image}" class="max-w-full max-h-full object-contain" loading="lazy">` : 
          `<div class="text-3xl opacity-20">${item.icon || '✨'}</div>`
        }
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h4 class="luxury-heading text-lg">${item.name}</h4>
          <button onclick="removeFromCart('${item.id}')" class="text-neutral-300 hover:text-orange-600 transition-colors">✕</button>
        </div>
        <p class="text-neutral-400 text-xs mb-3">₦${item.price.toLocaleString()}</p>
        
        <!-- Cart Qty Manager -->
        <div class="flex items-center gap-4">
          <button onclick="updateQty('${item.id}', -1)" class="w-6 h-6 border border-neutral-200 rounded-full flex items-center justify-center text-xs hover:border-neutral-900 transition-colors">−</button>
          <span class="text-xs font-bold">${item.qty}</span>
          <button onclick="updateQty('${item.id}', 1)" class="w-6 h-6 border border-neutral-200 rounded-full flex items-center justify-center text-xs hover:border-neutral-900 transition-colors">+</button>
        </div>
      </div>
    </div>
  `).join('');
}
