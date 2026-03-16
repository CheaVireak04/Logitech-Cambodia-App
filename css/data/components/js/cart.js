import { tg, hapticImpact } from './telegram.js';
import { showToast } from './ui.js';
import { products } from '../data/products.js';

export let cart = [];

export function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    hapticImpact('medium');
    showToast(`${product.name} Added`);
    window.app.updateNav(); // Refresh cart badge
}

export function removeFromCart(index) {
    cart.splice(index, 1);
    hapticImpact('light');
    window.app.renderCartView();
    window.app.updateNav();
}

export function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}