export const DOM = {
    get: (id) => document.getElementById(id),
    update: (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }
};

export function showToast(message) {
    const container = DOM.get('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'bg-logiBlue text-black font-bold px-5 py-3 rounded-full shadow-[0_0_15px_rgba(0,184,252,0.4)] transform transition-all duration-300 translate-y-[-150%] opacity-0 flex items-center gap-2';
    toast.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${message}`;
    
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-150%]', 'opacity-0');
    });

    // Remove automatically
    setTimeout(() => {
        toast.classList.add('translate-y-[-150%]', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}