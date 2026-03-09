// =========================================================
// ADMIN CREDENTIALS
// =========================================================
const ADMIN_CREDENTIALS = {
  email: 'admin@raveplus.com',
  password: 'raveadmin123'
};

let isAdminLoggedIn = false;

// =========================================================
// LOGIN HANDLER
// =========================================================
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('loginError');

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    isAdminLoggedIn = true;
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadDashboardData();
  } else {
    errorEl.textContent = 'Invalid credentials';
    errorEl.classList.remove('hidden');
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    isAdminLoggedIn = false;
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
  }
}

function switchTab(tab) {
  document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
  event.currentTarget.classList.add('active');

  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
  document.getElementById(tab + 'Tab').classList.remove('hidden');

  const titles = { overview: 'Dashboard Overview', orders: 'Order Management', products: 'Product Catalog', customers: 'Customer Database', settings: 'Settings' };
  document.getElementById('pageTitle').textContent = titles[tab];
}

// =========================================================
// LOAD LIVE DATA
// =========================================================
function loadDashboardData() {
  const users = JSON.parse(localStorage.getItem('raveplus_users')) || [];
  
  // Flatten all orders from all users
  const allOrders = [];
  users.forEach(user => {
    if (user.orders) {
      user.orders.forEach(order => {
        allOrders.push({ ...order, customerName: user.name, customerEmail: user.email, customerPhone: user.phone });
      });
    }
  });

  // Calculate Stats
  const totalSales = allOrders.reduce((sum, o) => sum + o.total, 0);
  
  document.getElementById('totalSales').textContent = `₦${totalSales.toLocaleString()}`;
  document.getElementById('totalOrders').textContent = allOrders.length;
  document.getElementById('totalCustomers').textContent = users.length;

  renderRecentOrders(allOrders);
  renderAllOrders(allOrders);
  renderCustomersList(users);
}

function renderRecentOrders(orders) {
  const container = document.getElementById('recentOrdersList');
  if (!container) return;

  const recent = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">No orders yet</p>';
    return;
  }

  container.innerHTML = recent.map(order => `
    <div class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p class="font-semibold text-gray-800">#${order.id}</p>
        <p class="text-sm text-gray-500">${order.customerName}</p>
      </div>
      <div class="text-right">
        <p class="font-bold text-gray-800">₦${order.total.toLocaleString()}</p>
        <p class="text-[10px] uppercase text-green-600 font-bold">${order.status}</p>
      </div>
    </div>
  `).join('');
}

function renderAllOrders(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => `
    <tr>
      <td class="px-6 py-4 text-sm font-mono text-gray-800">#${order.id}</td>
      <td class="px-6 py-4">
        <p class="text-sm font-bold text-gray-800">${order.customerName}</p>
        <p class="text-xs text-gray-500">${order.customerPhone}</p>
      </td>
      <td class="px-6 py-4 text-sm text-gray-600">${new Date(order.date).toLocaleDateString()}</td>
      <td class="px-6 py-4 text-sm font-bold text-gray-800">₦${order.total.toLocaleString()}</td>
      <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase">${order.status}</span></td>
      <td class="px-6 py-4">
        <button onclick="viewOrderDetails('${order.id}')" class="text-orange-600 hover:text-orange-800 text-xs font-bold uppercase tracking-widest">Details</button>
      </td>
    </tr>
  `).join('');
}

function renderCustomersList(users) {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  tbody.innerHTML = users.map(user => {
    const orders = user.orders || [];
    const spent = orders.reduce((sum, o) => sum + o.total, 0);
    return `
      <tr>
        <td class="px-6 py-4 text-sm font-bold text-gray-800">${user.name}</td>
        <td class="px-6 py-4 text-sm text-gray-600">${user.email}</td>
        <td class="px-6 py-4 text-sm text-gray-600">${user.phone}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${orders.length}</td>
        <td class="px-6 py-4 text-sm font-bold text-gray-800">₦${spent.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
}

function viewOrderDetails(id) {
  alert('Order detail view coming in next update! Order ID: ' + id);
}
