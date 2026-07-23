import { getState } from './state.js';
import { renderProjectsList } from './projects.js';
import { renderTaskList } from './tasks.js';
import { renderProfile } from './profile.js';
import { initTimer } from './timer.js';
import { renderOnboarding } from './onboarding.js';

let activeView = 'home';

export function showView(viewId) {
  activeView = viewId;
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(sec => sec.classList.remove('active'));

  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.add('active');
  }

  // Update tab bar active status
  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach(tab => {
    if (tab.dataset.target === viewId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Hide tab bar on onboarding & auth screens
  const tabBar = document.getElementById('tab-bar');
  const fabAdd = document.getElementById('fab-add');
  if (['onboarding', 'login', 'signup', 'otp-verify'].includes(viewId)) {
    if (tabBar) tabBar.style.display = 'none';
    if (fabAdd) fabAdd.style.display = 'none';
  } else {
    if (tabBar) tabBar.style.display = 'flex';
    if (fabAdd) fabAdd.style.display = 'flex';
  }

  // Render view specific dynamic content
  refreshCurrentView();
}

export function refreshCurrentView() {
  const state = getState();
  
  if (activeView === 'onboarding') {
    renderOnboarding(document.getElementById('onboarding-container'));
  } else if (activeView === 'home') {
    const userNameEl = document.getElementById('home-user-name');
    if (userNameEl) userNameEl.textContent = `Hi ${state.user?.displayName || 'Jennifer'}!`;
    renderProjectsList(document.getElementById('home-projects-container'));
    renderTaskList(document.getElementById('home-tasks-container'));
  } else if (activeView === 'tasks') {
    renderTaskList(document.getElementById('full-tasks-container'));
  } else if (activeView === 'profile') {
    renderProfile(document.getElementById('profile-container'));
  } else if (activeView === 'timer') {
    const timerDigitsEl = document.getElementById('timer-digits');
    const timerStatusEl = document.getElementById('timer-status');
    initTimer(timerDigitsEl, timerStatusEl);
    renderTimerHistory(document.getElementById('timer-history-container'));
  }
}

function renderTimerHistory(container) {
  if (!container) return;
  const state = getState();
  const history = state.timer.history || [];

  if (history.length === 0) {
    container.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-muted);">No recent timer sessions.</p>`;
    return;
  }

  container.innerHTML = history.map(h => `
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 10px 0; border-bottom: 1px solid var(--border-subtle);">
      <span style="font-weight: 600; color: var(--text-primary);">${h.duration}</span>
      <span style="color: var(--text-secondary);">${h.date} ${h.timestamp}</span>
    </div>
  `).join('');
}

export function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderColor = type === 'error' ? 'var(--accent-danger)' : 'var(--accent-primary)';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? 'var(--accent-danger)' : 'var(--accent-success)'}" stroke-width="2.5">
      ${type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
