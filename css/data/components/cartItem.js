export function renderCartItem(item, index) {
    return `
        <div class="glass-card p-3 rounded-xl flex items-center gap-4 mb-3 border border-gray-800/50">
            <div class="w-16 h-16 bg-black/50 rounded-lg flex items-center justify-center text-3xl shrink-0">
                ${item.icon}
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-sm line-clamp-1">${item.name}</h4>
                <span class="text-logiBlue font-bold block mt-1">$${item.price}</span>
            </div>
            <button data-action="remove-from-cart" data-index="${index}" class="text-gray-500 hover:text-red-500 p-2 active:scale-90 transition-transform">
                <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;
}