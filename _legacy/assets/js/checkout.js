// =========================================================
// CHECKOUT FUNCTIONS
// =========================================================
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx'; // ✏️ Replace with your key

function proceedToCheckout() {
  if (cart.length === 0) return;

  if (!currentUser) {
    alert('Please login or create an account to checkout');
    toggleDrawer('cart');
    toggleModal('login');
    return;
  }

  // Ensure user has an address
  if (!currentUser.addresses || currentUser.addresses.length === 0) {
    alert('Please add a shipping address in your account before checkout.');
    openAccountModal();
    switchAccountTab('addresses');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const reference = 'RAVE-' + Date.now();

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: currentUser.email,
    amount: total * 100, // Kobo
    currency: 'NGN',
    ref: reference,
    metadata: {
      custom_fields: [
        { display_name: 'Customer', variable_name: 'customer', value: currentUser.name },
        { display_name: 'Items', variable_name: 'items', value: cart.map(i => `${i.name} x${i.qty}`).join(', ') }
      ]
    },
    callback: function(response) {
      // Payment successful!
      handleSuccessfulPayment(response, reference, total);
    },
    onClose: function() {
      alert('Transaction cancelled.');
    }
  });

  handler.openIframe();
}

function handleSuccessfulPayment(response, reference, total) {
  // Get the address used (assuming the first one for simplicity, or we can let them pick)
  const shippingAddress = currentUser.addresses[0]; 

  const order = {
    id: reference,
    date: new Date().toISOString(),
    items: [...cart],
    total: total,
    status: 'Confirmed',
    paymentRef: response.reference,
    address: shippingAddress
  };
  
  if (!currentUser.orders) currentUser.orders = [];
  currentUser.orders.push(order);
  updateUserData();

  // Send Email Notifications
  fetch('/api/send-order-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order, customer: currentUser })
  }).catch(err => console.error('Email failed to send:', err));
  
  // Clear cart
  cart = [];
  localStorage.setItem('raveplus_cart', JSON.stringify(cart));
  if (typeof renderCart === 'function') renderCart();
  toggleDrawer('cart');
  
  alert('Masterpiece Reserved! Your order has been confirmed. Check your email for details.');
}
