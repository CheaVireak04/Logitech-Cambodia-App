import tg from './telegram.js';
import { DOM, showToast } from './ui.js';
import { CartManager } from './cart.js';
import { Navigation } from './navigation.js';
import { products } from '../data/products.js';

import { renderBottomNav } from '../components/navbar.js';
import { renderProductCard } from '../components/productCard.js';
import { renderCartItem } from '../components/cartItem.js';

// --- 1. Layout Initialization ---
function initApp() {
    tg.expand();
    tg.ready();
    tg.setHeaderColor('#0a0a0a');

    // Build the structural HTML for all views
    DOM.update('app-root', `
        <div id="view-home" class="view-section active p-4">
            <header class="flex justify-between items-center mb-6 pt-2">
                <h1 class="text-2xl font-black tracking-widest text-logiBlue uppercase">LOGI<span class="text-white">TECH</span> KH</h1>
            </header>
            
            <div class="glass-card rounded-3xl p-6 mb-8 relative overflow-hidden bg-gradient-to-br from-gray-800 to-black">
                <span class="text-[10px] bg-logiBlue text-black font-bold px-3 py-1 rounded-full uppercase">Gaming Weekend</span>
                <h2 class="text-3xl font-black mt-4 mb-1">G PRO X 2</h2>
                <p class="text-gray-400 text-sm">Zero Opposition.</p>
            </div>

            <h3 class="text-lg font-bold mb-4 text-gray-300">All Gear</h3>
            <div class="grid grid-cols-2 gap-4" id="home-product-list"></div>
        </div>

        <div id="view-product" class="view-section p-4 pb-20" x-data>
            <div id="product-detail-content"></div>
        </div>

        <div id="view-cart" class="view-section p-4">
            <h2 class="text-3xl font-black mb-6">Your Cart</h2>
            <div id="cart-content"></div>
        </div>

        <div id="view-checkout" class="view-section p-4">
            <h2 class="text-3xl font-black mb-6">Checkout</h2>
            <div class="bg-tgCard p-6 rounded-3xl border border-gray-800 space-y-4">
                <input type="text" id="cust-name" placeholder="Full Name" class="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-logiBlue">
                <input type="tel" id="cust-phone" placeholder="Phone Number" class="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-logiBlue">
                <textarea id="cust-address" placeholder="Delivery Address" class="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:outline-none focus:border-logiBlue h-24"></textarea>
                
                <div class="pt-4 border-t border-gray-800 mt-4">
                    <div class="flex justify-between items-center text-xl font-black mb-6"><span>Total</span> <span class="text-logiBlue" id="checkout-total">$0</span></div>
                    <button data-action="confirm-order" class="w-full bg-logiBlue text-black font-black py-4 rounded-xl active:scale-95 transition-transform flex justify-center items-center gap-2">
                        CONFIRM ORDER
                    </button>
                </div>
            </div>
        </div>
    `);

    // Initial Renders
    DOM.update('home-product-list', products.map(renderProductCard).join(''));
    updateNav();
    setupGlobalEventListeners();
}

// --- 2. Render Functions ---
function updateNav() {
    DOM.update('bottom-nav', renderBottomNav(CartManager.getCart().length, Navigation.current));
}

function renderProductDetail(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;

    DOM.update('product-detail-content', `
        <div class="bg-tgCard rounded-3xl p-6 mb-6 flex justify-center items-center h-64 border border-gray-800 text-8xl drop-shadow-2xl">
            ${p.icon}
        </div>
        <div class="flex justify-between items-start mb-6">
            <div>
                <span class="text-logiBlue text-xs font-bold uppercase tracking-widest">${p.category}</span>
                <h2 class="text-3xl font-black mt-1">${p.name}</h2>
            </div>
            <span class="text-2xl font-bold text-logiBlue">$${p.price}</span>
        </div>
        <div class="space-y-3 mb-8">
            <h3 class="font-bold text-gray-500 uppercase text-xs">Specifications</h3>
            ${p.specs.map(s => `<div class="bg-black p-3 rounded-xl text-sm border border-gray-800 flex items-center text-gray-300"><div class="w-2 h-2 bg-logiBlue rounded-full mr-3"></div>${s}</div>`).join('')}
        </div>
        <button data-action="add-to-cart" data-id="${p.id}" class="w-full bg-logiBlue text-black font-black text-lg py-4 rounded-2xl active:scale-95 transition-transform">
            ADD TO CART
        </button>
    `);
    
    toggleTelegramBackButton(true);
    Navigation.goTo('product');
    updateNav();
}

function renderCart() {
    const cart = CartManager.getCart();
    
    if (cart.length === 0) {
        DOM.update('cart-content', `
            <div class="text-center py-20 text-gray-500">
                <span class="text-6xl mb-4 block opacity-50">🛒</span>
                <p class="text-lg">Your cart is empty.</p>
            </div>
        `);
        tg.MainButton.hide();
    } else {
        const total = CartManager.getTotal();
        let html = cart.map((item, index) => renderCartItem(item, index)).join('');
        html += `
            <div class="mt-8 pt-4 border-t border-gray-800">
                <div class="flex justify-between text-gray-400 mb-2"><span>Subtotal</span> <span class="text-white font-bold">$${total}</span></div>
                <div class="flex justify-between text-gray-400 mb-4 pb-4 border-b border-gray-800"><span>Delivery Est.</span> <span class="text-white font-bold">+$2</span></div>
                <div class="flex justify-between text-xl font-black mb-6"><span>Total</span> <span class="text-logiBlue">$${total + 2}</span></div>
                <button data-action="nav" data-target="checkout" class="w-full bg-gray-100 text-black font-black py-4 rounded-xl active:scale-95 transition-transform">PROCEED TO CHECKOUT</button>
            </div>
        `;
        DOM.update('cart-content', html);
    }
    
    toggleTelegramBackButton(Navigation.current !== 'home');
}

// --- 3. Event Delegation (The Proficient Way) ---
function setupGlobalEventListeners() {
    document.body.addEventListener('click', (e) => {
        // Find the closest element with a data-action attribute
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');

        // Navigation Action
        if (action === 'nav') {
            const viewId = target.getAttribute('data-target');
            Navigation.goTo(viewId);
            if (viewId === 'cart') renderCart();
            updateNav();
            toggleTelegramBackButton(viewId !== 'home');
            tg.HapticFeedback.impactOccurred('light');
        }

        // View Product Action
        if (action === 'view-product') {
            const id = target.getAttribute('data-id');
            renderProductDetail(id);
        }

        // Add to Cart Action
        if (action === 'add-to-cart') {
            e.stopPropagation(); // Prevent triggering 'view-product'
            const id = target.getAttribute('data-id');
            const product = products.find(p => p.id === id);
            if (product) {
                CartManager.add(product);
                showToast(`${product.name} Added!`);
                tg.HapticFeedback.impactOccurred('medium');
                updateNav();
                
                // If they clicked add from the product page, send them home
                if (Navigation.current === 'product') {
                    Navigation.goTo('home');
                    toggleTelegramBackButton(false);
                    updateNav();
                }
            }
        }

        // Remove from Cart Action
        if (action === 'remove-from-cart') {
            const index = target.getAttribute('data-index');
            CartManager.remove(index);
            tg.HapticFeedback.impactOccurred('light');
            renderCart();
            updateNav();
        }

        // Confirm Order Action
        if (action === 'confirm-order') {
            handleCheckout();
        }
    });

    // Telegram Back Button Event
    tg.BackButton.onClick(() => {
        if (Navigation.current === 'checkout') {
            Navigation.goTo('cart');
            renderCart();
        } else {
            Navigation.goTo('home');
        }
        updateNav();
        toggleTelegramBackButton(false);
    });
}

function handleCheckout() {
    const name = DOM.get('cust-name').value;
    const phone = DOM.get('cust-phone').value;

    if (!name || !phone) {
        showToast('Name and Phone are required!');
        tg.HapticFeedback.notificationOccurred('error');
        return;
    }

    const orderData = {
        customer: name,
        phone: phone,
        items: CartManager.getCart().map(i => i.name),
        total: CartManager.getTotal() + 2
    };

    tg.HapticFeedback.notificationOccurred('success');
    tg.sendData(JSON.stringify(orderData));
    tg.close();
}

function toggleTelegramBackButton(show) {
    if (show) tg.BackButton.show();
    else tg.BackButton.hide();
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', initApp);