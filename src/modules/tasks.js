import { getState, setState } from './state.js';
import { showToast } from './ui.js';
import { updateProjectsProgress } from './projects.js';

export function addTask(taskData) {
  const state = getState();
  const newTask = {
    id: 'task_' + Date.now(),
    title: taskData.title,
    summary: taskData.summary || '',
    category: taskData.category || 'General',
    date: taskData.date || new Date().toISOString().split('T')[0],
    time: taskData.time || '09:00 AM',
    completed: false,
    createdAt: new Date().toISOString()
  };

  const updatedTasks = [newTask, ...state.tasks];
  setState({ tasks: updatedTasks });
  
  updateProjectsProgress();
  showToast('Congratulations! Your task has been added.');
  return newTask;
}

export function toggleTask(taskId) {
  const state = getState();
  let wasCompleted = false;
  
  const updatedTasks = state.tasks.map(t => {
    if (t.id === taskId) {
      wasCompleted = !t.completed;
      return { ...t, completed: wasCompleted };
    }
    return t;
  });

  // Calculate updated stats
  const completedCount = updatedTasks.filter(t => t.completed).length;
  const newStats = {
    ...state.stats,
    goalsAchieved: completedCount,
    streakKept: Math.max(state.stats.streakKept, completedCount > 0 ? state.stats.streakKept : 1)
  };

  setState({ tasks: updatedTasks, stats: newStats });
  updateProjectsProgress();

  if (wasCompleted) {
    showToast('Task completed! Keep the streak going 🔥');
  }
}

export function deleteTask(taskId) {
  const state = getState();
  const updatedTasks = state.tasks.filter(t => t.id !== taskId);
  setState({ tasks: updatedTasks });
  updateProjectsProgress();
  showToast('Task removed');
}

export function renderTaskList(container, filterDate = null) {
  if (!container) return;
  const state = getState();
  
  let tasks = state.tasks;
  if (filterDate) {
    tasks = tasks.filter(t => t.date === filterDate);
  }

  if (tasks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.6;">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p style="font-size: 0.95rem; font-weight: 500;">No tasks found.</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Tap the '+' button to schedule a new task.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = tasks.map(t => `
    <div class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
      <div class="task-left">
        <div class="custom-checkbox" onclick="window.konquerToggleTask('${t.id}')">
          ${t.completed ? `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ` : ''}
        </div>
        <div class="task-info">
          <h4 class="task-title">${t.title}</h4>
          <p>${t.time} ${t.summary ? '• ' + t.summary : ''}</p>
        </div>
      </div>
      <button class="task-delete-btn" onclick="window.konquerDeleteTask('${t.id}')" title="Delete Task">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}
