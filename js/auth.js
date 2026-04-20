const AUTH_KEY = 'gradion_auth_v1';
const PASS_HASH = 'gradion2025'; // Change this for production

function checkAuth() {
  if (sessionStorage.getItem(AUTH_KEY) !== 'authenticated') {
    window.location.href = 'login.html';
  }
}

function login(password) {
  if (password === PASS_HASH) {
    sessionStorage.setItem(AUTH_KEY, 'authenticated');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'authenticated';
}

function showToast(message, type = 'default', duration = 3000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', default: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || icons.default}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}
