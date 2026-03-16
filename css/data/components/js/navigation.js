import { tg } from './telegram.js';

export let currentView = 'home';

export function navigate(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show new view
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
        target.classList.add('active');
        currentView = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle Telegram Back Button
    if (viewId === 'home') {
        tg.BackButton.hide();
    } else {
        tg.BackButton.show();
    }
}