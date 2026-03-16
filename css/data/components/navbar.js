export function renderBottomNav(cartCount) {
    return `
        <div class="flex justify-around items-center p-3">
            <button class="nav-btn flex flex-col items-center text-gray-400 hover:text-logiBlue transition" data-target="home">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="text-[10px] font-bold">Shop</span>
            </button>
            <button class="nav-btn flex flex-col items-center text-gray-400 hover:text-logiBlue transition relative" data-target="cart">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span class="text-[10px] font-bold">Cart</span>
                ${cartCount > 0 ? `<span class="absolute -top-1 right-2 bg-logiBlue text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">${cartCount}</span>` : ''}
            </button>
        </div>
    `;
}
