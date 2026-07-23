import { getState, setState } from './state.js';
import { showView } from './ui.js';

const onboardingData = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    title: "Conquer every single task with Konquer",
    description: "Organize your workflow, conquer procrastination, and streamline your daily projects effortlessly."
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    title: "Get a brief task of what you want to do",
    description: "Schedule your days, set precise focus timers, and track your ongoing projects in real-time."
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    title: "Complete your task without procrastination",
    description: "Earn streak rewards, achieve your goals, and unlock maximum daily productivity."
  }
];

let currentIndex = 0;

export function renderOnboarding(container) {
  if (!container) return;
  
  const current = onboardingData[currentIndex];
  
  container.innerHTML = `
    <div class="onboarding-screen">
      <div class="onboarding-illustration">
        ${current.icon}
      </div>
      <div class="onboarding-content">
        <h2>${current.title}</h2>
        <p>${current.description}</p>
        
        <div class="carousel-indicators">
          ${onboardingData.map((_, idx) => `
            <div class="indicator ${idx === currentIndex ? 'active' : ''}"></div>
          `).join('')}
        </div>
        
        <button id="onboarding-next-btn" class="btn-primary">
          ${currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  `;

  document.getElementById('onboarding-next-btn')?.addEventListener('click', () => {
    if (currentIndex < onboardingData.length - 1) {
      currentIndex++;
      renderOnboarding(container);
    } else {
      setState({ onboarded: true });
      showView('login');
    }
  });
}
