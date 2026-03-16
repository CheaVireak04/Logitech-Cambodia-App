export function renderProductCard(product) {
    return `
        <div data-action="view-product" data-id="${product.id}" class="glass-card rounded-2xl p-4 cursor-pointer flex flex-col justify-between active:scale-95 transition-transform">
            <div class="w-full h-32 flex items-center justify-center bg-black/40 rounded-xl mb-3 p-2 text-5xl">
                ${product.icon}
            </div>
            <div>
                <span class="text-[10px] uppercase tracking-wider text-gray-500">${product.category}</span>
                <h3 class="font-bold text-sm leading-tight mt-1 truncate">${product.name}</h3>
                <div class="flex justify-between items-end mt-3">
                    <span class="text-logiBlue font-bold text-lg">$${product.price}</span>
                    <button data-action="add-to-cart" data-id="${product.id}" class="bg-gray-800 hover:bg-logiBlue hover:text-black p-2 rounded-full transition-colors z-10 relative">
                        <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}