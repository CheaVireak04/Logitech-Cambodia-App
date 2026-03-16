export const Navigation = {
    current: 'home',
    
    goTo: (viewId) => {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show target view
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.add('active');
            Navigation.current = viewId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};