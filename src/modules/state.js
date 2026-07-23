const STATE_KEY = 'konquer_app_state';

const defaultState = {
  user: null, // { uid, email, displayName, photoURL }
  theme: 'dark', // 'dark' | 'light'
  onboarded: false,
  projects: [], // User starts clean (no pre-populated sample data as requested)
  tasks: [],
  timer: {
    durationMinutes: 25,
    secondsLeft: 25 * 60,
    isRunning: false,
    history: []
  },
  stats: {
    goalsAchieved: 0,
    streakKept: 1,
    highProgress: 0
  }
};

let state = loadState();

export function getState() {
  return state;
}

export function loadState() {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
  return { ...defaultState };
}

export function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function setState(updater) {
  if (typeof updater === 'function') {
    state = updater(state);
  } else {
    state = { ...state, ...updater };
  }
  saveState();
  return state;
}
