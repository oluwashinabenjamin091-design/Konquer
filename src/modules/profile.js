import { getState, setState } from './state.js';
import { showToast } from './ui.js';
import { logoutUser } from './auth.js';

export function initTheme() {
  const state = getState();
  applyTheme(state.theme || 'dark');
}

export function toggleTheme() {
  const state = getState();
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  setState({ theme: newTheme });
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode 🎨`);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function renderProfile(container) {
  if (!container) return;
  const state = getState();
  const user = state.user || { displayName: 'User', email: 'user@konquer.app' };
  const initials = (user.displayName || user.email || 'K').slice(0, 2).toUpperCase();

  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${initials}</div>
      <div>
        <h2 style="font-size: 1.25rem; font-weight: 700;">${user.displayName || 'Konquer User'}</h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">${user.email}</p>
      </div>
    </div>

    <!-- Gamification & Streak Stats -->
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-number">${state.stats.goalsAchieved}</div>
        <div class="stat-label">Goals achieved</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${state.stats.streakKept} 🔥</div>
        <div class="stat-label">Streak kept</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${state.stats.highProgress}</div>
        <div class="stat-label">High progress</div>
      </div>
    </div>

    <!-- Settings Menu -->
    <div class="menu-list">
      <div class="menu-item" id="edit-profile-btn">
        <div class="menu-item-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Edit Profile</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      <div class="menu-item" id="theme-toggle-btn">
        <div class="menu-item-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <span>Change Theme</span>
        </div>
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--accent-primary); text-transform: uppercase;">
          ${state.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      <div class="menu-item" id="renew-streak-btn">
        <div class="menu-item-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/>
          </svg>
          <span>Renew Streak</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      <div class="menu-item" id="logout-btn" style="border-color: rgba(255, 118, 117, 0.3);">
        <div class="menu-item-left" style="color: var(--accent-danger);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
  document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
  document.getElementById('renew-streak-btn')?.addEventListener('click', () => {
    setState(prev => ({ stats: { ...prev.stats, streakKept: prev.stats.streakKept + 1 } }));
    renderProfile(container);
    showToast('Streak renewed! 🔥');
  });
}
