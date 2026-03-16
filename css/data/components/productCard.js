export function renderProductCard(product) {
    return `
        <div class="glass-card rounded-2xl p-4 hover-scale cursor-pointer flex flex-col justify-between h-full" onclick="window.app.goToProduct(${product.id})">
            <div class="w-full h-32 flex items-center justify-center bg-gray-900/50 rounded-xl mb-3 p-2">
                <img src="${product.image}" alt="${product.name}" class="max-h-full object-contain drop-shadow-lg">
            </div>
            <div>
                <span class="text-[10px] uppercase tracking-wider text-gray-400">${product.category}</span>
                <h3 class="font-bold text-sm leading-tight mt-1 truncate">${product.name}</h3>
                <div class="flex justify-between items-end mt-3">
                    <span class="text-logiBlue font-bold text-lg">$${product.price}</span>
                    <button class="bg-gray-800 hover:bg-logiBlue hover:text-black p-2 rounded-full transition" onclick="event.stopPropagation(); window.app.addToCart(${product.id})">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}