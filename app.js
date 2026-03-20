/**
 * BRICK STORE - Main Application Logic
 * Handles Telegram integration, Cart state, UI rendering, and user flow.
 */

const app = {
    tg: null,
    supportUsername: "Chea_Vireak",
    searchQuery: "",
    minPrice: 0,
    maxPrice: 1000,
    absMinPrice: 0,
    absMaxPrice: 1000,
    isPriceFilterActive: false,
    cart: [],
    isPanelOpen: false,
    isLeftPanelOpen: false,
    isDarkMode: true,
    currentCategory: 'home',
    pendingOrderProductId: null,
    selectedCompany: null,
    currentVariant: null,

    init() {
        // Initialize Telegram Web App API securely
        try { 
            this.tg = window.Telegram?.WebApp; 
            this.tg?.expand?.(); 
            this.tg?.ready?.(); 
        } catch(e) { console.warn("Telegram WebApp API not detected."); }
        
        // Calculate Dynamic Price Bounds safely
        if (products && products.length > 0) {
            const prices = products.map(p => p.price);
            this.absMinPrice = Math.floor(Math.min(...prices));
            this.absMaxPrice = Math.ceil(Math.max(...prices));
        }
        this.minPrice = this.absMinPrice;
        this.maxPrice = this.absMaxPrice;
        
        const mi = document.getElementById('minPriceRange'); 
        const ma = document.getElementById('maxPriceRange');
        if (mi && ma) { 
            mi.min = this.absMinPrice; mi.max = this.absMaxPrice; mi.value = this.absMinPrice; 
            ma.min = this.absMinPrice; ma.max = this.absMaxPrice; ma.value = this.absMaxPrice; 
        }

        // Restore Cart and Theme preferences
        try { 
            this.isDarkMode = (localStorage.getItem('brickTheme') !== 'light'); 
            const savedCart = localStorage.getItem('brickStoreCart');
            if (savedCart) this.cart = JSON.parse(savedCart);
        } catch(e) { 
            this.isDarkMode = true; 
        }
        
        this.applyTheme(); 
        this.updateSliderUI(); 
        this.updateCartBadge();
        this.renderCatalog(); 
    },

    haptic(style = 'light') { 
        try { this.tg?.HapticFeedback?.impactOccurred?.(style); } catch (e) {} 
    },

    highlightText(text) { 
        if (!this.searchQuery) return text; 
        const regex = new RegExp(`(${this.searchQuery})`, 'gi'); 
        return text.replace(regex, '<span class="search-highlight">$1</span>'); 
    },

    // --- SEARCH & NAVIGATION ---

    handleSearch(event) {
        this.searchQuery = event.target.value.toLowerCase().trim();
        const suggestionsBox = document.getElementById('search-suggestions');
        
        if (this.searchQuery.length > 0) {
            const matches = products.filter(p => 
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.desc.toLowerCase().includes(this.searchQuery) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(this.searchQuery)))
            ).slice(0, 5);
            
            if (matches.length > 0) {
                suggestionsBox.innerHTML = matches.map(p => `
                    <div onclick="app.selectSuggestion(${p.id})" role="button" tabindex="0" class="p-3 hover:bg-premiumBlack cursor-pointer border-b border-premiumBorder last:border-0 flex items-center gap-3 transition-colors focus:outline-none focus:bg-premiumBlack">
                        <img src="${p.image}" alt="${p.name}" class="w-8 h-8 object-contain rounded bg-[#0a0a0a] p-1">
                        <span class="text-xs font-bold text-premiumWhite tracking-wide">${this.highlightText(p.name)}</span>
                    </div>
                `).join('');
                suggestionsBox.classList.remove('hidden'); 
                suggestionsBox.classList.add('flex');
            } else { 
                suggestionsBox.classList.add('hidden'); 
            }
        } else { 
            suggestionsBox.classList.add('hidden'); 
        }
        this.renderCatalog(); 
    },

    forceSearch(query) {
        this.haptic('light');
        const input = document.getElementById('searchInput');
        if (input) input.value = query;
        this.searchQuery = query.toLowerCase();
        document.getElementById('search-suggestions').classList.add('hidden');
        this.renderCatalog();
    },

    selectSuggestion(id) { 
        this.haptic('light'); 
        document.getElementById('search-suggestions').classList.add('hidden'); 
        document.getElementById('searchInput').value = ""; 
        this.searchQuery = ""; 
        this.viewProduct(id); 
    },

    // --- CORE RENDERING ---

    renderCatalog() {
        const grid = document.getElementById('product-grid'); 
        if(!grid) return;
        
        let list = [...products].filter(p => {
            const s = this.searchQuery;
            const matchesSearch = p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || (p.tags && p.tags.some(t => t.toLowerCase().includes(s)));
            let matchesPrice = true; 
            if (this.isPriceFilterActive) matchesPrice = (Number(p.price) >= this.minPrice) && (Number(p.price) <= this.maxPrice);
            return matchesSearch && matchesPrice;
        });

        // Apply Category Sorting
        if (this.currentCategory === 'new') { list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); list = list.slice(0, STORE_CONFIG.maxNewArrivals); } 
        else if (this.currentCategory === 'trending') { list.sort((a, b) => b.clicks - a.clicks); list = list.slice(0, STORE_CONFIG.maxTrending); }
        else if (this.currentCategory === 'deal') { list.sort((a, b) => Number(a.price) - Number(b.price)); list = list.slice(0, STORE_CONFIG.maxBestDeals); }
        else if (this.currentCategory === 'selling') { list.sort((a, b) => b.sales - a.sales); list = list.slice(0, STORE_CONFIG.maxBestSelling); }
        
        if (list.length === 0) { 
            let suggestionHtml = "";
            if (this.searchQuery.length > 2) {
                const popular = ["Karambit", "Butterfly", "Doppler", "Fade", "Tiger Tooth"];
                const suggestion = popular.find(t => t.toLowerCase() !== this.searchQuery) || "Karambit";
                suggestionHtml = `<p class="mt-4 text-xs text-premiumWhite">Did you mean: <button onclick="app.forceSearch('${suggestion}')" class="text-[#2AABEE] font-bold underline underline-offset-4 focus:outline-none">${suggestion}</button>?</p>`;
            }
            grid.innerHTML = `
                <div class="col-span-2 text-center py-12 px-4 fade-in">
                    <span class="text-4xl mb-4 grayscale filter block opacity-50">🔍</span>
                    <p class="text-premiumGray text-sm mb-2 font-medium">No items matched your search.</p>
                    ${suggestionHtml}
                    <button onclick="app.resetFilters()" class="text-premiumWhite font-bold uppercase text-xs mt-6 inline-block bg-premiumCard border border-premiumBorder px-6 py-3 rounded-lg active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500">Clear Filters</button>
                </div>`; 
            return; 
        }

        grid.innerHTML = list.map(p => `
            <div onclick="app.viewProduct(${p.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter') app.viewProduct(${p.id})" class="bg-premiumCard border border-premiumBorder rounded-xl overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 fade-in">
                <div class="w-full aspect-square bg-[#0a0a0a] flex items-center justify-center p-2 relative">
                    <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                </div>
                <div class="p-3 flex-1 border-t border-premiumBorder bg-premiumCard">
                    <div>
                        <h4 class="font-bold text-xs uppercase tracking-wider mb-1 leading-tight text-premiumWhite truncate" aria-label="Product: ${p.name}">${this.highlightText(p.name)}</h4>
                    </div>
                    <div class="mt-3 flex justify-between items-center">
                        <span class="text-premiumWhite font-black text-sm tracking-wide" aria-label="Price: $${p.price}">$${Number(p.price).toFixed(2)}</span>
                        <button onclick="app.animateAddToCart(${p.id}, event)" aria-label="Add ${p.name} to cart" class="w-7 h-7 rounded-full border border-premiumBorder flex items-center justify-center text-premiumWhite bg-premiumBlack hover:bg-premiumWhite hover:text-premiumBlack transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 z-10">
                            <svg class="w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                </div>
            </div>`).join('');
    },

    selectVariant(price, name) {
        this.haptic('light');
        const priceDisplay = document.getElementById('detail-price');
        if (priceDisplay) priceDisplay.innerText = `$${Number(price).toFixed(2)}`;
        this.currentVariant = { name: name, price: Number(price) };
    },

    viewProduct(id) {
        const p = products.find(i => i.id === id); 
        if (!p) return;
        
        // Initialize default variant safely
        this.currentVariant = (p.variants && p.variants.length > 0) ? p.variants[0] : { name: 'Standard', price: p.price };

        let gHTML = `<img src="${p.image}" alt="${p.name} Main View" class="w-full h-full object-contain p-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">`;
        if (p.gallery && p.gallery.length > 1) {
            gHTML = `<div class="flex overflow-x-auto snap-x snap-mandatory hide-scroll h-full w-full">` + 
                    p.gallery.map((img, idx) => `<img src="${img}" alt="${p.name} Gallery Image ${idx+1}" class="w-full h-full object-contain p-4 snap-center shrink-0 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">`).join('') + 
                    `</div>`;
        }
        
        let variantsHTML = '';
        if (p.variants && p.variants.length > 0) {
            variantsHTML = `
                <div class="mb-4 text-left">
                    <label for="variant-selector" class="text-[10px] text-premiumGray uppercase font-bold tracking-widest block mb-2">Select Variant</label>
                    <div class="relative">
                        <select id="variant-selector" aria-label="Select product variant" onchange="app.selectVariant(this.options[this.selectedIndex].dataset.price, this.value)" class="w-full bg-premiumCard border border-premiumBorder text-premiumWhite text-sm p-4 rounded-xl outline-none appearance-none cursor-pointer truncate focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow">
                            ${p.variants.map((v, i) => `<option value="${v.name}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>${v.name} (+$${(v.price - p.price).toFixed(2)})</option>`).join('')}
                        </select>
                        <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-premiumGray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>`;
        }

        const c = document.getElementById('product-detail-content');
        if (c) {
            c.innerHTML = `
                <div class="bg-premiumCard p-5 rounded-xl border border-premiumBorder mb-4 shadow-sm fade-in">
                    <div class="relative w-full aspect-square bg-[#0a0a0a] rounded-xl overflow-hidden mb-6 flex items-center justify-center border border-premiumBorder shadow-inner">
                        ${gHTML}
                        ${p.gallery && p.gallery.length > 1 ? `<div class="absolute bottom-2 w-full text-center text-[8px] text-premiumGray font-bold uppercase tracking-widest animate-pulse pointer-events-none">Swipe image →</div>` : ''}
                    </div>
                    <div class="text-center">
                        <h2 class="text-2xl font-black uppercase tracking-widest mb-2 text-premiumWhite leading-tight">${p.name}</h2>
                        <div class="flex justify-center items-baseline gap-3 mb-2">
                            <span id="detail-price" class="text-2xl font-black text-[#2AABEE] tracking-widest drop-shadow-sm">$${Number(this.currentVariant.price).toFixed(2)}</span>
                            <span class="text-lg font-medium text-premiumGray line-through decoration-red-500/70 block">$${Number(p.oldPrice).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                ${variantsHTML}
                <div class="bg-premiumCard p-4 rounded-xl border border-premiumBorder mb-8 shadow-sm">
                    <h4 class="text-[10px] text-premiumGray uppercase font-bold tracking-widest mb-2">Description</h4>
                    <p class="text-sm text-premiumWhite leading-relaxed text-justify opacity-90">${p.desc}</p>
                </div>
                <div class="space-y-3 pb-4">
                    <button onclick="app.animateAddToCart(${p.id}, event)" aria-label="Add to cart" class="w-full bg-premiumCard border border-premiumBorder text-premiumWhite font-bold uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-all shadow-sm hover:border-premiumGray focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> 
                        Add to Cart
                    </button>
                    <button onclick="app.openOrderSummary(${p.id})" aria-label="Buy Now immediately" class="w-full bg-premiumWhite text-premiumBlack font-black uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-all shadow-md hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-premiumWhite/50">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.26-3.95 2.58-.29.19-.55.29-.78.28-.26-.01-.76-.15-1.13-.27-.45-.15-.81-.23-.79-.49.01-.13.2-.27.56-.41 2.21-.96 3.68-1.59 4.41-1.89 2.09-.87 2.53-1.02 2.82-1.02.06 0 .2 0 .28.06.07.05.1.12.11.19-.01.07-.01.12-.02.16z"/></svg>
                        Buy Now
                    </button>
                </div>`;
            this.navigate('product');
        }
    },

    // --- CART & QUANTITY MANAGEMENT ---

    saveCart() { 
        localStorage.setItem('brickStoreCart', JSON.stringify(this.cart)); 
        this.updateCartBadge(); 
    },

    animateAddToCart(productId, event) {
        if(event) event.stopPropagation(); 
        this.haptic('medium'); 
        
        const p = products.find(i => i.id === productId); 
        if (!p) return;
        
        const variantToAdd = this.currentVariant || (p.variants ? p.variants[0] : { name: 'Standard', price: p.price });

        if (event && event.target) {
            const fly = document.createElement('img'); 
            fly.src = p.image; 
            fly.className = 'flying-item';
            const start = event.target.getBoundingClientRect(); 
            const end = document.getElementById('nav-cart').getBoundingClientRect();
            
            fly.style.top = `${start.top}px`; 
            fly.style.left = `${start.left}px`; 
            document.body.appendChild(fly);
            
            // Trigger animation
            setTimeout(() => { 
                fly.style.top = `${end.top + 10}px`; 
                fly.style.left = `${end.left + 10}px`; 
                fly.style.transform = 'scale(0.2) rotate(360deg)'; 
                fly.style.opacity = '0'; 
            }, 20);
            
            setTimeout(() => { fly.remove(); }, 700);
        }

        setTimeout(() => { 
            const existingIndex = this.cart.findIndex(i => i.id === productId && i.variant?.name === variantToAdd.name);
            if (existingIndex > -1) {
                this.cart[existingIndex].quantity += 1;
            } else {
                this.cart.push({ ...p, quantity: 1, variant: variantToAdd, cartPrice: variantToAdd.price });
            }
            this.saveCart();
            
            const c = document.getElementById('nav-cart'); 
            if(c) { 
                c.style.transform = 'scale(1.2)'; 
                setTimeout(() => c.style.transform = 'scale(1)', 150); 
            }
        }, event ? 700 : 0);
    },

    updateQuantity(index, delta) {
        this.haptic('light');
        if (this.cart[index].quantity + delta > 0) {
            this.cart[index].quantity += delta;
        } else {
            this.cart.splice(index, 1);
        }
        this.saveCart();
        this.renderCart();
    },

    removeFromCart(index) {
        this.haptic('light');
        this.cart.splice(index, 1);
        this.saveCart();
        this.renderCart();
    },

    renderCart() {
        try {
            const content = document.getElementById('cart-content');
            if(!content) return;
            
            if (this.cart.length === 0) {
                content.innerHTML = `
                    <div class="text-center py-20 fade-in">
                        <div class="w-24 h-24 bg-premiumCard rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
                            <span class="text-5xl grayscale filter opacity-40">🛒</span>
                        </div>
                        <h3 class="text-premiumWhite font-black uppercase tracking-widest mb-2 text-lg">Your cart is empty</h3>
                        <p class="text-xs text-premiumGray mb-8 font-medium">Looks like you haven't added any knives yet.</p>
                        <button aria-label="Go to Shop" onclick="app.navigate('home'); app.setCategory('home');" class="bg-premiumWhite text-premiumBlack font-black uppercase tracking-widest py-4 px-10 rounded-xl active:scale-95 transition-transform shadow-md hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-premiumWhite/50">Go to Shopping</button>
                    </div>`;
                return;
            }
            
            let total = 0;
            let cartItemsHTML = this.cart.map((item, index) => {
                if (!item) return '';
                const itemTotal = Number(item.cartPrice || item.price) * (item.quantity || 1);
                total += itemTotal;
                
                return `
                <div class="bg-premiumCard border border-premiumBorder p-3 rounded-xl flex items-center gap-4 mb-3 shadow-sm fade-in">
                    <div class="w-20 h-20 bg-[#0a0a0a] rounded-lg flex items-center justify-center p-2 border border-premiumBorder shadow-inner shrink-0 relative">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
                    </div>
                    <div class="flex-1 min-w-0 py-1">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-premiumWhite leading-tight truncate pr-2" title="${item.name}">${item.name}</h4>
                        <span class="text-[9px] text-premiumGray block truncate uppercase font-bold tracking-widest mt-1 opacity-80">${item.variant?.name || 'Standard'}</span>
                        <span class="text-[#2AABEE] text-sm font-black tracking-wide block mt-1 drop-shadow-sm">$${itemTotal.toFixed(2)}</span>
                    </div>
                    <div class="flex flex-col items-center gap-2 shrink-0 pr-1">
                        <button aria-label="Remove item" onclick="app.removeFromCart(${index})" class="w-7 h-7 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full flex items-center justify-center active:scale-90 transition-colors focus:outline-none">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <div class="flex items-center bg-premiumBlack rounded-lg border border-premiumBorder p-0.5">
                            <button aria-label="Decrease quantity" onclick="app.updateQuantity(${index}, -1)" class="w-6 h-6 text-premiumGray hover:text-premiumWhite flex items-center justify-center active:scale-90 transition-colors focus:outline-none"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"></path></svg></button>
                            <span class="text-xs font-black text-premiumWhite w-5 text-center" aria-live="polite">${item.quantity || 1}</span>
                            <button aria-label="Increase quantity" onclick="app.updateQuantity(${index}, 1)" class="w-6 h-6 text-premiumGray hover:text-premiumWhite flex items-center justify-center active:scale-90 transition-colors focus:outline-none"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg></button>
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            content.innerHTML = `
                <div class="pb-2">${cartItemsHTML}</div>
                <div class="mt-4 border-t border-premiumBorder pt-6 fade-in">
                    <div class="flex justify-between items-center mb-6 bg-premiumCard p-4 rounded-xl border border-premiumBorder shadow-sm">
                        <span class="text-premiumGray uppercase tracking-widest font-bold text-xs">Total Amount</span>
                        <span class="text-2xl font-black text-[#2AABEE] tracking-widest drop-shadow-sm">$${total.toFixed(2)}</span>
                    </div>
                    <button aria-label="Proceed to Checkout" onclick="app.openOrderSummary()" class="w-full bg-premiumWhite text-premiumBlack font-black uppercase tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-transform shadow-md hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-premiumWhite/50">
                        CHECKOUT NOW
                    </button>
                </div>`;
        } catch (e) { 
            console.error("Cart render failed:", e); 
        }
    },

    // --- CHECKOUT FLOW ---

    openOrderSummary(productId = null) {
        this.haptic('medium'); 
        this.pendingOrderProductId = productId; 
        this.selectedCompany = null;
        
        // Reset Error States
        ['delivery-error', 'phone-error', 'grab-phone-error', 'company-error'].forEach(e => { 
            const el = document.getElementById(e); 
            if(el) el.classList.add('hidden'); 
        });
        
        // Reset Form Values
        const dSelect = document.getElementById('modal-delivery'); if(dSelect) dSelect.value = "";
        ['modal-phone', 'modal-address', 'grab-phone', 'modal-note'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        
        // Hide Conditional Layouts
        const cFields = document.getElementById('conditional-fields'); if(cFields) cFields.classList.add('hidden');
        const gFields = document.getElementById('grab-fields'); if(gFields) gFields.classList.add('hidden');
        
        // Reset company selectors
        document.querySelectorAll('.company-box').forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-checked', 'false');
        });
        
        // Show Modal
        const modal = document.getElementById('order-modal'); 
        const content = document.getElementById('order-modal-content');
        if(!modal || !content) return;
        
        modal.classList.remove('hidden'); 
        modal.classList.add('flex');
        
        // Trigger animation frame
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0'); 
            modal.classList.add('opacity-100'); 
            content.classList.replace('scale-95', 'scale-100');
        });
    },

    closeOrderSummary() { 
        this.haptic('light'); 
        const modal = document.getElementById('order-modal'); 
        const content = document.getElementById('order-modal-content'); 
        if(!modal || !content) return; 
        
        modal.classList.remove('opacity-100'); 
        modal.classList.add('opacity-0'); 
        content.classList.replace('scale-100', 'scale-95'); 
        
        setTimeout(() => { 
            modal.classList.remove('flex'); 
            modal.classList.add('hidden'); 
        }, 300); 
    },

    handleDeliveryChange() {
        const d = document.getElementById('modal-delivery').value; 
        document.getElementById('delivery-error').classList.add('hidden');
        
        const isStandard = d.includes('Standard');
        const isGrab = d.includes('Grab');
        
        document.getElementById('conditional-fields').classList.toggle('hidden', !isStandard);
        document.getElementById('grab-fields').classList.toggle('hidden', !isGrab);
        
        if (isStandard) {
            setTimeout(() => document.getElementById('company-vet').focus(), 50);
        } else if (isGrab) {
            setTimeout(() => document.getElementById('grab-phone').focus(), 50);
        }
    },

    selectCompany(companyName) { 
        this.haptic('light'); 
        this.selectedCompany = companyName; 
        document.getElementById('company-error').classList.add('hidden'); 
        
        document.querySelectorAll('.company-box').forEach(box => { 
            box.classList.remove('selected'); 
            box.setAttribute('aria-checked', 'false');
        }); 
        
        const targetId = companyName === 'VET' ? 'company-vet' : (companyName === 'J&T' ? 'company-jnt' : 'company-l192');
        const targetBox = document.getElementById(targetId);
        
        if(targetBox) {
            targetBox.classList.add('selected'); 
            targetBox.setAttribute('aria-checked', 'true');
        }
    },

    clearPhoneError() { document.getElementById('phone-error').classList.add('hidden'); },
    clearGrabPhoneError() { document.getElementById('grab-phone-error').classList.add('hidden'); },

    submitFinalOrder() {
        this.haptic('medium'); 
        let valid = true; 
        const d = document.getElementById('modal-delivery').value;
        
        if (!d) { 
            document.getElementById('delivery-error').classList.remove('hidden'); 
            valid = false; 
        }
        
        const isStandard = d.includes('Standard');
        const isGrab = d.includes('Grab');
        
        if (isStandard) { 
            if (!this.selectedCompany) { 
                document.getElementById('company-error').classList.remove('hidden'); 
                valid = false; 
            } 
            if (!document.getElementById('modal-phone').value.trim()) { 
                document.getElementById('phone-error').classList.remove('hidden'); 
                valid = false; 
            } 
        }
        if (isGrab) { 
            if (!document.getElementById('grab-phone').value.trim()) { 
                document.getElementById('grab-phone-error').classList.remove('hidden'); 
                valid = false; 
            } 
        }
        if (!valid) return;

        // Compile Order Data
        let items = []; 
        let total = 0; 
        
        if (this.pendingOrderProductId) { 
            const p = products.find(i => i.id === this.pendingOrderProductId); 
            if(p) { 
                const variant = this.currentVariant || (p.variants ? p.variants[0] : {name:'Standard', price:p.price});
                items.push({...p, quantity: 1, variant: variant}); 
                total = Number(variant.price); 
            } 
        } else { 
            items = [...this.cart]; 
            items.forEach(i => total += Number(i.cartPrice || i.price) * (i.quantity || 1)); 
        }
        
        let msg = `🛒 *NEW ORDER*\nMethod: ${d}\n\n`;
        if (isStandard) {
            msg += `🏢 Company: ${this.selectedCompany}\n`;
            msg += `📍 Province: ${document.getElementById('modal-province').value}\n`;
            msg += `🏠 Address: ${document.getElementById('modal-address').value || 'N/A'}\n`;
            msg += `📞 Phone: ${document.getElementById('modal-phone').value}\n\n`;
        }
        if (isGrab) {
            msg += `📞 Phone: ${document.getElementById('grab-phone').value}\n\n`;
        }
        
        const note = document.getElementById('modal-note').value.trim();
        msg += `📝 Note: ${note || 'None'}\n\n`;
        
        msg += `📦 *Items:*\n`;
        msg += items.map((i, idx) => `${idx+1}. ${i.name} (${i.variant?.name || 'Standard'}) - ${i.quantity || 1}x @ $${Number(i.cartPrice || i.price).toFixed(2)}`).join('\n');
        msg += `\n\n💰 *Total: $${total.toFixed(2)}*`;
        
        // UX UPGRADE: Success State Transformation
        const contentArea = document.getElementById('order-modal-content');
        const originalHTML = contentArea.innerHTML;
        
        contentArea.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10 fade-in">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(34,197,94,0.4)] transform transition-transform duration-500 scale-110">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-xl font-black text-premiumWhite uppercase tracking-widest mb-2">Order Confirmed!</h3>
                <p class="text-xs text-premiumGray text-center px-4 leading-relaxed">Your order details have been securely prepared. Redirecting to our support chat...</p>
                <div class="mt-8 w-8 h-8 border-2 border-premiumBorder border-t-[#2AABEE] rounded-full animate-spin"></div>
            </div>
        `;

        // Execution and Redirect
        setTimeout(() => {
            const url = `https://t.me/${this.supportUsername.replace('@', '')}?text=${encodeURIComponent(msg)}`;
            const inTelegram = this.tg && this.tg.initDataUnsafe && Object.keys(this.tg.initDataUnsafe).length > 0;
            
            if (inTelegram) {
                try {
                    if (this.tg.openTelegramLink) this.tg.openTelegramLink(url);
                    else this.tg.openLink(url);
                } catch (err) {
                    window.location.href = url; // Fallback
                }
                // Force close Mini App to drop user directly into the pre-filled chat
                setTimeout(() => { this.tg.close(); }, 300);
            } else {
                window.location.href = url; 
            }
            
            // Empty Cart if this was a cart checkout
            if (!this.pendingOrderProductId) {
                this.cart = []; 
                this.saveCart(); 
                this.renderCart();
            }
            
            // Background restore
            setTimeout(() => {
                this.closeOrderSummary();
                setTimeout(() => contentArea.innerHTML = originalHTML, 300); 
            }, 800);
            
        }, 1800);
    },

    // --- UI/UX UTILITIES ---

    openSocial(url) {
        this.haptic('light');
        if (this.tg && this.tg.openLink) {
            this.tg.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    },

    togglePanel() { 
        this.haptic('light'); 
        if(this.isLeftPanelOpen) this.toggleLeftPanel(); 
        
        this.isPanelOpen = !this.isPanelOpen; 
        const p = document.getElementById('side-panel'); 
        const o = document.getElementById('panel-overlay'); 
        if(!p || !o) return; 
        
        if (this.isPanelOpen) { 
            p.classList.replace('translate-x-full', 'translate-x-0'); 
            o.classList.remove('hidden'); 
            requestAnimationFrame(() => o.classList.add('opacity-100')); 
        } else { 
            p.classList.replace('translate-x-0', 'translate-x-full'); 
            o.classList.remove('opacity-100'); 
            setTimeout(() => o.classList.add('hidden'), 300); 
        } 
    },
    
    toggleLeftPanel() { 
        this.haptic('light'); 
        if(this.isPanelOpen) this.togglePanel(); 
        
        this.isLeftPanelOpen = !this.isLeftPanelOpen; 
        const p = document.getElementById('left-panel'); 
        const o = document.getElementById('left-panel-overlay'); 
        if(!p || !o) return; 
        
        if (this.isLeftPanelOpen) { 
            p.classList.replace('-translate-x-full', 'translate-x-0'); 
            o.classList.remove('hidden'); 
            requestAnimationFrame(() => o.classList.add('opacity-100')); 
        } else { 
            p.classList.replace('translate-x-0', '-translate-x-full'); 
            o.classList.remove('opacity-100'); 
            setTimeout(() => o.classList.add('hidden'), 300); 
        } 
    },

    navigate(viewId) { 
        this.haptic('light'); 
        if(this.isPanelOpen) this.togglePanel(); 
        if(this.isLeftPanelOpen) this.toggleLeftPanel(); 
        
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active')); 
        
        setTimeout(() => { 
            const v = document.getElementById(`view-${viewId}`); 
            if(v) v.classList.add('active'); 
        }, 50); 
        
        const h = document.getElementById('nav-home'); 
        const c = document.getElementById('nav-cart'); 
        
        if (viewId === 'home' || viewId === 'cart') { 
            if(h) h.className = `flex flex-col items-center transition-colors ${viewId==='home'?'text-premiumWhite':'text-premiumGray hover:text-premiumWhite'} focus:outline-none focus:text-blue-500`; 
            if(c) c.className = `flex flex-col items-center transition-colors relative ${viewId==='cart'?'text-premiumWhite':'text-premiumGray hover:text-premiumWhite'} focus:outline-none focus:text-blue-500`; 
            try { this.tg?.BackButton?.hide?.(); } catch(e){} 
        } else { 
            try { this.tg?.BackButton?.show?.(); } catch(e){} 
        } 
        
        if (viewId === 'cart') this.renderCart(); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    },

    handlePriceFilter(type) { 
        this.isPriceFilterActive = true; 
        const mi = document.getElementById('minPriceRange'); 
        const ma = document.getElementById('maxPriceRange'); 
        let min = Number(mi.value); 
        let max = Number(ma.value); 
        
        if (type === 'min' && min > max - 1) { min = max - 1; mi.value = min; } 
        if (type === 'max' && max < min + 1) { max = min + 1; ma.value = max; } 
        
        this.minPrice = min; 
        this.maxPrice = max; 
        this.updateSliderUI(); 
        this.renderCatalog(); 
    },

    updateSliderUI() { 
        const l = document.getElementById('priceValue'); 
        if(l) l.innerText = `$${this.minPrice.toFixed(2)} — $${this.maxPrice.toFixed(2)}`; 
        const t = document.getElementById('slider-track'); 
        if(t) { 
            const rangeTotal = this.absMaxPrice - this.absMinPrice || 1; 
            t.style.left = (((this.minPrice - this.absMinPrice) / rangeTotal) * 100) + '%'; 
            t.style.right = (100 - (((this.maxPrice - this.absMinPrice) / rangeTotal) * 100)) + '%'; 
        } 
    },

    updateCartBadge() { 
        const b = document.getElementById('cart-badge'); 
        if(b){ 
            const totalQty = this.cart.reduce((acc, curr) => acc + (curr.quantity || 1), 0); 
            b.innerText = totalQty; 
            b.classList.toggle('hidden', totalQty === 0); 
        } 
    },

    setCategory(cat) { 
        this.haptic('medium'); 
        this.currentCategory = cat; 
        this.searchQuery = ""; 
        const si = document.getElementById('searchInput'); 
        if(si) si.value = ""; 
        if(this.isLeftPanelOpen) this.toggleLeftPanel(); 
        this.navigate('home'); 
        this.renderCatalog(); 
    },

    resetFilters() { 
        this.haptic('medium'); 
        this.searchQuery = ""; 
        const s = document.getElementById('searchInput'); 
        if (s) s.value = ""; 
        this.minPrice = this.absMinPrice; 
        this.maxPrice = this.absMaxPrice; 
        this.isPriceFilterActive = false; 
        
        const mi = document.getElementById('minPriceRange'); 
        const ma = document.getElementById('maxPriceRange'); 
        if(mi) mi.value = this.absMinPrice; 
        if(ma) ma.value = this.absMaxPrice; 
        
        this.updateSliderUI(); 
        this.setCategory('home'); 
    },

    applyTheme() { 
        const k = document.getElementById('theme-toggle-knob'); 
        document.body.classList.toggle('dark', this.isDarkMode); 
        if(k) k.classList.toggle('translate-x-6', this.isDarkMode); 
        try { 
            this.tg?.setHeaderColor?.(this.isDarkMode ? '#000000' : '#f4f4f5'); 
            this.tg?.setBackgroundColor?.(this.isDarkMode ? '#000000' : '#f4f4f5'); 
        } catch(e) {} 
    },

    toggleTheme() { 
        this.haptic('medium'); 
        this.isDarkMode = !this.isDarkMode; 
        try { localStorage.setItem('brickTheme', this.isDarkMode ? 'dark' : 'light'); } catch(e) {} 
        this.applyTheme(); 
    },

    shareApp() { 
        const l = "https://t.me/BrickStoreApp_bot/Homepage"; 
        const t = "Check out BRICK STORE for premium CS2 desk toys!"; 
        try { 
            if (this.tg?.openTelegramLink) {
                this.tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(l)}&text=${encodeURIComponent(t)}`); 
            } else {
                window.open(`https://t.me/share/url?url=${encodeURIComponent(l)}&text=${encodeURIComponent(t)}`, '_blank'); 
            }
        } catch(e) {} 
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => { app.init(); });
