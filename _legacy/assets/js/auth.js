// =========================================================
// AUTH FUNCTIONS
// =========================================================
function handleAccountClick() {
  if (currentUser) {
    openAccountModal();
  } else {
    toggleModal('login');
  }
}

function switchToSignup() {
  toggleModal('login');
  toggleModal('signup');
}

function switchToLogin() {
  toggleModal('signup');
  toggleModal('login');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem('raveplus_user', JSON.stringify(user));
    updateAuthUI();
    toggleModal('login');
    errorEl.classList.add('hidden');
  } else {
    errorEl.textContent = 'Invalid email or password';
    errorEl.classList.remove('hidden');
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const errorEl = document.getElementById('signupError');

  // Validation
  if (password !== confirm) {
    errorEl.textContent = 'Passwords do not match';
    errorEl.classList.remove('hidden');
    return;
  }

  if (users.find(u => u.email === email)) {
    errorEl.textContent = 'Email already registered';
    errorEl.classList.remove('hidden');
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password,
    addresses: [],
    orders: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('raveplus_users', JSON.stringify(users));
  
  currentUser = newUser;
  localStorage.setItem('raveplus_user', JSON.stringify(newUser));
  
  updateAuthUI();
  toggleModal('signup');
  errorEl.classList.add('hidden');

  alert('Account created successfully! Welcome to RavePlus Collections.');
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    currentUser = null;
    localStorage.removeItem('raveplus_user');
    updateAuthUI();
    toggleModal('account');
  }
}

function updateAuthUI() {
  const btn = document.getElementById('accountBtn');
  if (btn) {
    if (currentUser) {
      btn.textContent = currentUser.name.split(' ')[0].toUpperCase();
    } else {
      btn.textContent = 'LOGIN';
    }
  }
}

function openAccountModal() {
  const nameEl = document.getElementById('accountName');
  const emailEl = document.getElementById('accountEmail');
  const profNameEl = document.getElementById('profileName');
  const profPhoneEl = document.getElementById('profilePhone');

  if (nameEl) nameEl.textContent = `Welcome, ${currentUser.name}`;
  if (emailEl) emailEl.textContent = currentUser.email;
  if (profNameEl) profNameEl.value = currentUser.name;
  if (profPhoneEl) profPhoneEl.value = currentUser.phone;
  
  if (typeof renderOrders === 'function') renderOrders();
  if (typeof renderAddresses === 'function') renderAddresses();
  
  toggleModal('account');
}

function switchAccountTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
  
  const activeBtn = event.currentTarget;
  if (activeBtn) activeBtn.classList.add('active');
  const activeTab = document.getElementById(tab + 'Tab');
  if (activeTab) activeTab.classList.remove('hidden');
}

function renderOrders() {
  const container = document.getElementById('ordersList');
  if (!container) return;
  if (!currentUser.orders || currentUser.orders.length === 0) {
    container.innerHTML = '<p class="text-neutral-400 italic py-12 text-center">No orders yet. Start shopping!</p>';
    return;
  }

  container.innerHTML = currentUser.orders.map(order => `
    <div class="border border-neutral-200 p-6 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="font-bold">Order #${order.id}</p>
          <p class="text-xs text-neutral-400">${new Date(order.date).toLocaleDateString()}</p>
        </div>
        <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">${order.status}</span>
      </div>
      <div class="space-y-2 mb-4">
        ${order.items.map(item => `
          <p class="text-sm text-neutral-600">${item.name} x${item.qty} - ₦${(item.price * item.qty).toLocaleString()}</p>
        `).join('')}
      </div>
      <p class="font-bold text-right">Total: ₦${order.total.toLocaleString()}</p>
    </div>
  `).join('');
}

// =========================================================
// STATE SUGGESTIONS (NIGERIA)
// =========================================================
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

function showStateSuggestions() {
  const list = document.getElementById('stateSuggestions');
  list.classList.remove('hidden');
  renderStateSuggestions(NIGERIAN_STATES);
}

function filterStateSuggestions() {
  const query = document.getElementById('addrState').value.toLowerCase();
  const filtered = NIGERIAN_STATES.filter(s => s.toLowerCase().includes(query));
  renderStateSuggestions(filtered);
}

function renderStateSuggestions(states) {
  const list = document.getElementById('stateSuggestions');
  if (states.length === 0) {
    list.innerHTML = '<div class="p-3 text-xs text-neutral-400 italic">No state found</div>';
    return;
  }
  list.innerHTML = states.map(s => `
    <div onclick="selectState('${s}')" class="p-3 text-sm hover:bg-neutral-50 cursor-pointer transition-colors border-b border-neutral-50 last:border-0">
      ${s}
    </div>
  `).join('');
}

function selectState(state) {
  document.getElementById('addrState').value = state;
  document.getElementById('stateSuggestions').classList.add('hidden');
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  const list = document.getElementById('stateSuggestions');
  const input = document.getElementById('addrState');
  if (list && input && !list.contains(e.target) && e.target !== input) {
    list.classList.add('hidden');
  }
});

function renderAddresses() {
  const container = document.getElementById('addressesList');
  if (!container) return;
  if (!currentUser.addresses || currentUser.addresses.length === 0) {
    container.innerHTML = '<p class="text-neutral-400 italic py-12 text-center">No saved addresses yet.</p>';
    return;
  }

  container.innerHTML = currentUser.addresses.map((addr, i) => `
    <div class="border border-neutral-200 p-8 rounded-lg flex justify-between items-start hover:border-orange-600 transition-colors">
      <div class="space-y-1">
        <p class="font-bold text-xs uppercase tracking-widest text-orange-600 mb-2">${addr.label}</p>
        <p class="text-lg luxury-heading">${addr.street}</p>
        <p class="text-sm text-neutral-500">${addr.city}, ${addr.state}, ${addr.country}</p>
        <div class="pt-4 flex gap-4">
          <p class="text-[10px] text-neutral-400 uppercase tracking-widest">Primary: ${currentUser.phone}</p>
          ${addr.secondaryPhone ? `<p class="text-[10px] text-neutral-400 uppercase tracking-widest">Secondary: ${addr.secondaryPhone}</p>` : ''}
        </div>
      </div>
      <button onclick="deleteAddress(${i})" class="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 font-bold">Remove</button>
    </div>
  `).join('');
}

function addNewAddress() {
  // Clear previous values
  document.getElementById('addrLabel').value = '';
  document.getElementById('addrStreet').value = '';
  document.getElementById('addrCity').value = '';
  document.getElementById('addrState').value = '';
  document.getElementById('addrCountry').value = 'Nigeria';
  document.getElementById('addrSecondaryPhone').value = '';

  toggleModal('address');
}

function handleSaveAddress(e) {
  e.preventDefault();

  const newAddress = {
    label: document.getElementById('addrLabel').value,
    street: document.getElementById('addrStreet').value,
    city: document.getElementById('addrCity').value,
    state: document.getElementById('addrState').value,
    country: document.getElementById('addrCountry').value,
    secondaryPhone: document.getElementById('addrSecondaryPhone').value
  };

  if (!currentUser.addresses) currentUser.addresses = [];
  currentUser.addresses.push(newAddress);
  
  updateUserData();
  renderAddresses();
  toggleModal('address');
}

function deleteAddress(index) {
  if (confirm('Are you sure you want to remove this shipping address?')) {
    currentUser.addresses.splice(index, 1);
    updateUserData();
    renderAddresses();
  }
}

function updateProfile(e) {
  e.preventDefault();
  currentUser.name = document.getElementById('profileName').value;
  currentUser.phone = document.getElementById('profilePhone').value;
  updateUserData();
  updateAuthUI();
  alert('Profile updated successfully!');
}
