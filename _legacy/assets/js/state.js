// =========================================================
// GLOBAL STATE MANAGEMENT
// =========================================================
let cart = JSON.parse(localStorage.getItem('raveplus_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('raveplus_user')) || null;
let users = JSON.parse(localStorage.getItem('raveplus_users')) || [];

// This will be populated by Instagram or fallbacks
let PRODUCTS = [];

// REPLACE THIS with your Behold.so API URL later
const INSTAGRAM_FEED_URL = 'https://feeds.behold.so/TDdo656OMW8LTIsK0I0m'; 

function updateUserData() {
  localStorage.setItem('raveplus_user', JSON.stringify(currentUser));
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    localStorage.setItem('raveplus_users', JSON.stringify(users));
  }
}

// Global utility functions
function toggleDrawer(id) {
  const drawer = document.getElementById(id);
  const overlay = document.getElementById(id + 'Overlay');
  if (drawer) drawer.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

function toggleModal(id) {
  const modal = document.getElementById(id + 'Overlay');
  if (modal) modal.classList.toggle('active');
}
