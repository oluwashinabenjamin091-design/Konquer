import { getState, setState } from './state.js';

export function addProject(projectData) {
  const state = getState();
  const newProject = {
    id: 'proj_' + Date.now(),
    title: projectData.title,
    category: projectData.category || 'Mobile App',
    progress: 0,
    dueDate: projectData.dueDate || 'Monday 20th',
    createdAt: new Date().toISOString()
  };

  setState({ projects: [...state.projects, newProject] });
  return newProject;
}

export function updateProjectsProgress() {
  const state = getState();
  if (state.tasks.length === 0) return;

  const completedCount = state.tasks.filter(t => t.completed).length;
  const overallPercentage = Math.round((completedCount / state.tasks.length) * 100);

  const updatedProjects = state.projects.map(p => ({
    ...p,
    progress: overallPercentage
  }));

  setState({ projects: updatedProjects });
}

export function renderProjectsList(container) {
  if (!container) return;
  const state = getState();

  if (state.projects.length === 0) {
    container.innerHTML = `
      <div style="min-width: 280px; padding: 24px 16px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg); text-align: center; color: var(--text-muted);">
        <p style="font-size: 0.9rem; font-weight: 500;">No projects scheduled yet.</p>
        <p style="font-size: 0.78rem; margin-top: 4px; color: var(--text-secondary);">Create a project or task to track progress here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.projects.map(p => `
    <div class="project-card">
      <span class="project-tag">${p.category}</span>
      <h3>${p.title}</h3>
      <p>Due ${p.dueDate}</p>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 6px;">
          <span>Progress</span>
          <span>${p.progress}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${p.progress}%;"></div>
        </div>
      </div>
    </div>
  `).join('');
}
