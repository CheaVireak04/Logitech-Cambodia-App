export function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'bg-logiBlue text-black font-bold px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 translate-y-[-100%] opacity-0';
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Animate In
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-100%]', 'opacity-0');
    });

    // Animate Out
    setTimeout(() => {
        toast.classList.add('translate-y-[-100%]', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

export function updateDOM(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}
