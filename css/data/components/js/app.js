import { tg, initTelegram, hapticImpact, hapticNotification } from './telegram.js';
import { products } from '../Data/products.js';
import { renderProductCard } from '../components/productCard.js';
import { renderCartItem } from '../components/cartItem.js';
import { renderBottomNav } from '../components/navbar.js';
import { cart, addToCart, removeFromCart, getCartTotal } from './cart.js';
import { navigate, currentView } from './navigation.js';
import { updateDOM } from './ui.js';

// Global binding for inline HTML onclick handlers
window.app = {
    addToCart,
    removeFromCart,
    goToProduct: (id) => renderProductDetail(id),
    updateNav: renderNav,
    renderCartView
};

// --- View Definitions (HTML Structure injection) ---
function initLayout() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div id="view-home" class="view-section active p-4">
            <header class="flex justify-between items-center mb-6 pt-2">
                <h1 class="text-2xl font-bold tracking-widest text-logiBlue uppercase">Logitech KH</h1>
                <div class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">👤</div>
            </header>
            
            <div class="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden bg-gradient-to-r from-gray-900 to-black">
                <div class="absolute top-0 right-0 w-32 h-32 bg-logiBlue opacity-20 blur-3xl rounded-full"></div>
                <span class="text-[10px] bg-logiBlue text-black font-bold px-2 py-1 rounded-sm uppercase tracking-wider">New Arrival</span>
                <h2 class="text-3xl font-bold mt-3 mb-1">G PRO X</h2>
                <p class="text-gray-400 text-sm mb-4">Zero Opposition.</p>
                <img src="https://resource.logitechg.com/w_386,c_limit,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png" class="absolute -right-10 -bottom-10 w-48 drop-shadow-2xl">
            </div>

            <h3 class="text-lg font-bold mb-4">Trending Gear</h3>
            <div class="grid grid-cols-2 gap-4" id="home-products"></div>
        </div>

        <div id="view-product" class="view-section p-4 pb-24"></div>

        <div id="view-cart" class="view-section p-4">
            <h2 class="text-2xl font-bold mb-6">Shopping Cart</h2>
            <div id="cart-list"></div>
        </div>

        <div id="view-checkout" class="view-section p-4">
            <h2 class="text-2xl font-bold mb-6">Checkout</h2>
            <div class="space-y-4">
                <input type="text" id="cust-name" placeholder="Full Name" class="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl focus:border-logiBlue focus:outline-none transition">
                <input type="tel" id="cust-phone" placeholder="Phone Number" class="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl focus:border-logiBlue focus:outline-none transition">
                <textarea id="cust-address" placeholder="Delivery Address" class="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl focus:border-logiBlue focus:outline-none transition h-24"></textarea>
                <select id="del-method" class="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl focus:border-logiBlue focus:outline-none transition appearance-none">
                    <option value="2">Phnom Penh Express (+$2)</option>
                    <option value="3">Province Delivery (+$3)</option>
                </select>
            </div>
        </div>
    `;
    
    // Initial Renders
    updateDOM('home-products', products.map(renderProductCard).join(''));
    renderNav();
}

// --- Render Logic ---
function renderNav() {
    updateDOM('bottom-nav', renderBottomNav(cart.length));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            hapticImpact('light');
            const target = e.currentTarget.dataset.target;
            if (target === 'cart') renderCartView();
            navigate(target);
            setupMainButton();
        });
    });
}

function renderProductDetail(id) {
    const p = products.find(x => x.id === id);
    const html = `
        <div class="glass-card rounded-3xl p-6 mb-6 flex justify-center items-center h-64 mt-4">
            <img src="${p.image}" class="max-h-full drop-shadow-2xl">
        </div>
        <div class="flex justify-between items-start mb-4">
            <div>
                <span class="text-logiBlue text-xs font-bold uppercase tracking-widest">${p.category}</span>
                <h2 class="text-3xl font-bold mt-1">${p.name}</h2>
            </div>
            <span class="text-2xl font-bold">$${p.price}</span>
        </div>
        <div class="space-y-3 mt-6">
            <h3 class="font-bold text-gray-400 uppercase text-xs tracking-wider">Specifications</h3>
            ${p.specs.map(spec => `<div class="bg-gray-900 p-3 rounded-xl text-sm border border-gray-800 flex items-center"><div class="w-1.5 h-1.5 bg-logiBlue rounded-full mr-3"></div>${spec}</div>`).join('')}
        </div>
    `;
    updateDOM('view-product', html);
    navigate('product');
    
    tg.MainButton.setText(`ADD TO CART - $${p.price}`);
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
        addToCart(id);
        navigate('home');
        setupMainButton();
    });
}

function renderCartView() {
    const list = document.getElementById('cart-list');
    if (cart.length === 0) {
        list.innerHTML = `<div class="text-center text-gray-500 mt-20 flex flex-col items-center"><span class="text-6xl mb-4">🛒</span><p>Your cart is empty</p></div>`;
        tg.MainButton.hide();
        return;
    }
    
    list.innerHTML = cart.map(renderCartItem).join('');
    
    const subtotal = getCartTotal();
    list.innerHTML += `
        <div class="mt-8 border-t border-gray-800 pt-4">
            <div class="flex justify-between items-center mb-2"><span class="text-gray-400">Subtotal</span><span class="font-bold">$${subtotal}</span></div>
            <div class="flex justify-between items-center"><span class="text-gray-400">Delivery Est.</span><span class="font-bold">+$2</span></div>
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-800"><span class="text-lg font-bold">Total</span><span class="text-xl font-bold text-logiBlue">$${subtotal + 2}</span></div>
        </div>
    `;
    
    tg.MainButton.setText("PROCEED TO CHECKOUT");
    tg.MainButton.show();
    tg.MainButton.offClick(handleCheckoutClick);
    tg.MainButton.onClick(() => {
        navigate('checkout');
        setupCheckoutButton();
    });
}

function setupCheckoutButton() {
    tg.MainButton.setText("CONFIRM ORDER WITH ABA");
    tg.MainButton.show();
    tg.MainButton.offClick(handleCheckoutClick);
    tg.MainButton.onClick(handleCheckoutClick);
}

function handleCheckoutClick() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    
    if (!name || !phone) {
        tg.showAlert("Please fill in your Name and Phone Number.");
        hapticNotification('error');
        return;
    }
    
    const total = getCartTotal() + parseInt(document.getElementById('del-method').value);
    
    tg.showConfirm(`Total is $${total}. Proceed to send order to Logitech KH?`, (confirmed) => {
        if (confirmed) {
            hapticNotification('success');
            const order = { name, phone, items: cart.map(i => i.name), total };
            tg.sendData(JSON.stringify(order));
            tg.close();
        }
    });
}

function setupMainButton() {
    tg.MainButton.offClick(handleCheckoutClick);
    if (currentView === 'home') tg.MainButton.hide();
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    initLayout();
    
    tg.BackButton.onClick(() => {
        if (currentView === 'checkout') { renderCartView(); navigate('cart'); setupMainButton(); }
        else if (currentView !== 'home') { navigate('home'); setupMainButton(); }
    });
});
