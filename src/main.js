import { getState, setState } from './modules/state.js';
import { initAuth, loginUser, signupUser, loginWithGoogle } from './modules/auth.js';
import { showView, openModal, closeModal } from './modules/ui.js';
import { addTask, toggleTask, deleteTask } from './modules/tasks.js';
import { startTimer, pauseTimer, resetTimer, setTimerDuration } from './modules/timer.js';
import { initTheme } from './modules/profile.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme (Dark/Light mode)
  initTheme();

  // Initialize Firebase Auth listener
  initAuth();

  const state = getState();
  
  // Set initial view state
  if (!state.onboarded) {
    showView('onboarding');
  } else if (!state.user) {
    showView('login');
  } else {
    showView('home');
  }

  // Set default task date input to today
  const taskDateInput = document.getElementById('task-date-input');
  if (taskDateInput) {
    taskDateInput.value = new Date().toISOString().split('T')[0];
  }

  // Tab navigation event listeners
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      showView(btn.dataset.target);
    });
  });

  // Header profile button click
  document.getElementById('header-profile-btn')?.addEventListener('click', () => {
    showView('profile');
  });

  // Auth switch links
  document.getElementById('to-signup-link')?.addEventListener('click', () => showView('signup'));
  document.getElementById('to-login-link')?.addEventListener('click', () => showView('login'));

  // Auth Forms Submission
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await loginUser(email, password);
  });

  document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    await signupUser(name, email, password);
  });

  // Google Login / Signup buttons
  document.getElementById('google-login-btn')?.addEventListener('click', () => loginWithGoogle());
  document.getElementById('google-signup-btn')?.addEventListener('click', () => loginWithGoogle());

  // OTP Verification button
  document.getElementById('verify-otp-btn')?.addEventListener('click', () => {
    setState({ onboarded: true });
    showView('home');
  });

  // Add Task Modal triggers
  const openModalHandler = () => openModal('add-task-modal');
  document.getElementById('fab-add')?.addEventListener('click', openModalHandler);
  document.getElementById('open-add-task-header-btn')?.addEventListener('click', openModalHandler);
  document.getElementById('close-add-task-modal')?.addEventListener('click', () => closeModal('add-task-modal'));

  // Add Task Form Submit
  document.getElementById('add-task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title-input').value;
    const summary = document.getElementById('task-summary-input').value;
    const date = document.getElementById('task-date-input').value;
    const time = document.getElementById('task-time-input').value;

    if (title.trim()) {
      addTask({ title, summary, date, time });
      closeModal('add-task-modal');
      document.getElementById('add-task-form').reset();
      showView('tasks');
    }
  });

  // Focus Timer Controls
  const timerToggleBtn = document.getElementById('timer-toggle-btn');
  const timerResetBtn = document.getElementById('timer-reset-btn');
  const timerDigitsEl = document.getElementById('timer-digits');
  const timerStatusEl = document.getElementById('timer-status');

  timerToggleBtn?.addEventListener('click', () => {
    const currentState = getState();
    if (currentState.timer.isRunning) {
      pauseTimer(timerStatusEl);
      timerToggleBtn.textContent = 'Start Focus';
    } else {
      startTimer(timerDigitsEl, timerStatusEl);
      timerToggleBtn.textContent = 'Pause';
    }
  });

  timerResetBtn?.addEventListener('click', () => {
    resetTimer(timerDigitsEl, timerStatusEl);
    if (timerToggleBtn) timerToggleBtn.textContent = 'Start Focus';
  });

  // Global window helpers for inline onclicks
  window.konquerToggleTask = (id) => toggleTask(id);
  window.konquerDeleteTask = (id) => deleteTask(id);
  window.konquerSetTimer = (mins) => {
    setTimerDuration(mins, timerDigitsEl, timerStatusEl);
    if (timerToggleBtn) timerToggleBtn.textContent = 'Start Focus';
  };
});
