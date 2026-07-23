import { getState, setState } from './state.js';
import { showToast } from './ui.js';

let timerInterval = null;

export function initTimer(timerDigitsEl, timerStatusEl) {
  updateTimerDisplay(timerDigitsEl, timerStatusEl);
}

export function startTimer(timerDigitsEl, timerStatusEl) {
  const state = getState();
  if (state.timer.isRunning) return;

  setState(prev => ({
    timer: { ...prev.timer, isRunning: true }
  }));

  if (timerStatusEl) timerStatusEl.textContent = 'FOCUS IN PROGRESS';

  timerInterval = setInterval(() => {
    const currentState = getState();
    if (currentState.timer.secondsLeft <= 1) {
      pauseTimer(timerStatusEl);
      onTimerFinished(timerDigitsEl, timerStatusEl);
    } else {
      const newSeconds = currentState.timer.secondsLeft - 1;
      setState(prev => ({
        timer: { ...prev.timer, secondsLeft: newSeconds }
      }));
      updateTimerDisplay(timerDigitsEl, timerStatusEl);
    }
  }, 1000);
}

export function pauseTimer(timerStatusEl) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  setState(prev => ({
    timer: { ...prev.timer, isRunning: false }
  }));
  if (timerStatusEl) timerStatusEl.textContent = 'PAUSED';
}

export function resetTimer(timerDigitsEl, timerStatusEl) {
  pauseTimer(timerStatusEl);
  const state = getState();
  const resetSeconds = state.timer.durationMinutes * 60;
  setState(prev => ({
    timer: { ...prev.timer, secondsLeft: resetSeconds }
  }));
  updateTimerDisplay(timerDigitsEl, timerStatusEl);
  if (timerStatusEl) timerStatusEl.textContent = 'READY TO FOCUS';
}

export function setTimerDuration(minutes, timerDigitsEl, timerStatusEl) {
  pauseTimer(timerStatusEl);
  const seconds = minutes * 60;
  setState(prev => ({
    timer: { ...prev.timer, durationMinutes: minutes, secondsLeft: seconds }
  }));
  updateTimerDisplay(timerDigitsEl, timerStatusEl);
  if (timerStatusEl) timerStatusEl.textContent = `${minutes} MIN TIMER SET`;
}

function updateTimerDisplay(timerDigitsEl, timerStatusEl) {
  if (!timerDigitsEl) return;
  const state = getState();
  const totalSecs = state.timer.secondsLeft;
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hrs > 0) {
    timerDigitsEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    timerDigitsEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

function onTimerFinished(timerDigitsEl, timerStatusEl) {
  playChime();
  const state = getState();
  const historyEntry = {
    duration: `${state.timer.durationMinutes} mins`,
    date: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updatedHistory = [historyEntry, ...(state.timer.history || [])].slice(0, 5);

  setState(prev => ({
    timer: {
      ...prev.timer,
      secondsLeft: prev.timer.durationMinutes * 60,
      history: updatedHistory
    }
  }));

  updateTimerDisplay(timerDigitsEl, timerStatusEl);
  if (timerStatusEl) timerStatusEl.textContent = 'TIMER COMPLETED 🎉';
  showToast('Great job! Focus session completed 🎉');
}

function playChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.warn('Audio chime unsupported or blocked:', e);
  }
}
