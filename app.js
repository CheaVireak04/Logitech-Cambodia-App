// =========================================================================
// ⚠️ APPLICATION LOGIC (V7 Modular & Optimized)
// =========================================================================

const app = {
    tg: null, supportUsername: "Chea_Vireak", searchQuery: "",
    minPrice: 0, maxPrice: 1000, absMinPrice: 0, absMaxPrice: 1000,
    isPriceFilterActive: false, cart: [], isPanelOpen: false, isLeftPanelOpen: false,
    isDarkMode: true, currentCategory: 'home', pendingOrderProductId: null,
    selectedCompany: null, currentVariant: null,

    init() {
        try { this.tg = window.Telegram?.WebApp; this.tg?.expand?.(); this.tg?.ready?.(); } catch(e) {}
        
        // UPGRADE 9: DYNAMIC PRICE RANGE CALCULATION
        const prices = products.map(p => p.price);
        this.absMinPrice = Math.floor(Math.min(...prices));
        this.absMaxPrice = Math.ceil(Math.max(...prices));
        this.minPrice = this.absMinPrice;
        this.maxPrice = this.absMaxPrice;
        
        const mi = document.getElementById('minPriceRange'); 
        const ma = document.getElementById('maxPriceRange');
        if(mi && ma) { 
            mi.min = this.absMinPrice; mi.max = this.absMaxPrice; mi.value = this.absMinPrice; 
            ma.min = this.absMinPrice; ma.max = this.absMaxPrice; ma.value = this.absMaxPrice; 
        }

        // UPGRADE 1: CART PERSISTENCE
        try { 
            this.isDarkMode = (localStorage.getItem('brickTheme') !== 'light'); 
            const savedCart = localStorage.getItem('brickStoreCart');
            if (savedCart) this.cart = JSON.parse(savedCart);
        } catch(e) { this.isDarkMode = true; }
        
        this.applyTheme(); 
        this.updateSliderUI(); 
        this.updateCartBadge();
        this.renderCatalog(); 
    },

    haptic(style = 'light') { try { this.tg?.HapticFeedback?.impactOccurred?.(style); } catch (e) {} },
    highlightText(text) { if (!this.searchQuery) return text; const regex = new RegExp(`(${this.searchQuery})`, 'gi'); return text.replace(regex, '<span class="search-highlight">$1</span>'); },

    // UPGRADE 5: BROADER SEARCH MATCHING
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
                suggestionsBox.innerHTML = matches.map(p => `<div onclick="app.selectSuggestion(${p.id})" role="button" tabindex="0" class="p-3 hover:bg-premiumBlack cursor-pointer border-b border-premiumBorder last:border-0 flex items-center gap-3 transition-colors"><img src="${p.image}" alt="${p.name}" class="w-8 h-8 object-contain rounded bg-[#0a0a0a] p-1"><span class="text-xs font-bold text-premiumWhite tracking-wide">${this.highlightText(p.name)}</span></div>`).join('');
                suggestionsBox.classList.remove('hidden'); suggestionsBox.classList.add('flex');
            } else { suggestionsBox.classList.add('hidden'); }
        } else { suggestionsBox.classList.add('hidden'); }
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

    selectSuggestion(id) { this.haptic('light'); document.getElementById('search-suggestions').classList.add('hidden'); document.getElementById('searchInput').value = ""; this.searchQuery = ""; this.viewProduct(id); },

    // UPGRADE 2 & 3: ADAPTING ANIMATION TO USE SELECTED VARIANTS
    animateAddToCart(productId, event) {
        if(event) event.stopPropagation(); 
        this.haptic('medium'); 
        
        const p = products.find(i => i.id === productId); 
        if (!p) return;
        
        // Determine variant (if triggered from grid, use default. If from detail page, use currentVariant)
        const variantToAdd = this.currentVariant || p.variants[0];

        if (event && event.target) {
            const fly = document.createElement('img'); fly.src = p.image; fly.className = 'flying-item';
            const start = event.target.getBoundingClientRect(); const end = document.getElementById('nav-cart').getBoundingClientRect();
            fly.style.top = `${start.top}px`; fly.style.left = `${start.left}px`; document.body.appendChild(fly);
            setTimeout(() => { fly.style.top = `${end.top + 10}px`; fly.style.left = `${end.left + 10}px`; fly.style.transform = 'scale(0.2) rotate(360deg)'; fly.style.opacity = '0'; }, 20);
            setTimeout(() => { fly.remove(); }, 700);
        }

        setTimeout(() => { 
            // Check if exact product + variant is already in cart
            const existingIndex = this.cart.findIndex(i => i.id === productId && i.variant.name === variantToAdd.name);
            if (existingIndex > -1) {
                this.cart[existingIndex].quantity += 1;
            } else {
                this.cart.push({ ...p, quantity: 1, variant: variantToAdd, cartPrice: variantToAdd.price });
            }
            this.saveCart();
            const c = document.getElementById('nav-cart'); 
            if(c) { c.style.transform = 'scale(1.2)'; setTimeout(() => c.style.transform = 'scale(1)', 150); }
        }, event ? 700 : 0);
    },

// Inside your existing app object in app.js...

    renderCatalog() {
        const grid = document.getElementById('product-grid'); if(!grid) return;
        
        let list = [...products].filter(p => {
            const s = this.searchQuery;
            const matchesSearch = p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || (p.tags && p.tags.some(t => t.toLowerCase().includes(s)));
            let matchesPrice = true; 
            if (this.isPriceFilterActive) matchesPrice = (Number(p.price) >= this.minPrice) && (Number(p.price) <= this.maxPrice);
            return matchesSearch && matchesPrice;
        });

        // NEW: Handles the new category system map (Audio, Keyboards, Mice, etc.)
        if (this.currentCategory !== 'home' && !['new', 'trending', 'deal', 'selling'].includes(this.currentCategory)) {
            list = list.filter(p => p.category === this.currentCategory);
        } else if (this.currentCategory === 'new') { 
            list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); list = list.slice(0, STORE_CONFIG.maxNewArrivals); 
        } else if (this.currentCategory === 'trending') { 
            list.sort((a, b) => b.clicks - a.clicks); list = list.slice(0, STORE_CONFIG.maxTrending); 
        }

        if (list.length === 0) { 
            grid.innerHTML = `<div class="col-span-2 text-center py-12 px-4 glass-panel rounded-xl mt-4 border-dashed border-premiumBorder"><span class="text-4xl mb-4 block drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">📡</span><p class="text-premiumGray text-sm mb-2 font-tech uppercase tracking-widest">No signals found.</p><a href="#" onclick="app.resetFilters(); return false;" class="text-black font-tech font-bold uppercase text-xs mt-6 inline-block neon-btn px-6 py-3 rounded-lg">Reset Scanners</a></div>`; 
            return; 
        }

        // Updated Template Literal to match Cyberpunk UI structure
        grid.innerHTML = list.map(p => `
            <div onclick="app.viewProduct(${p.id})" role="button" tabindex="0" class="glass-panel rounded-xl overflow-hidden active:scale-95 transition-transform cursor-pointer hover:border-neon focus:outline-none group relative">
                ${p.price < p.oldPrice ? `<div class="absolute top-2 left-2 z-10 bg-neon text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-sm">SALE</div>` : ''}
                
                <div class="w-full aspect-square bg-gradient-to-t from-[#0a0a0c] to-transparent flex items-center justify-center p-3">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-3 flex-1 border-t border-premiumBorder bg-black/40">
                    <div><h4 class="font-tech font-bold text-[11px] uppercase tracking-wider mb-1 leading-tight text-premiumWhite line-clamp-2">${this.highlightText(p.name)}</h4></div>
                    <div class="mt-3 flex justify-between items-center">
                        <span class="text-neon font-tech font-bold text-sm">$${Number(p.price).toFixed(2)}</span>
                        <button onclick="app.animateAddToCart(${p.id}, event)" aria-label="Add ${p.name} to cart" class="w-7 h-7 rounded-md border border-premiumBorder flex items-center justify-center text-white bg-black hover:bg-neon hover:text-black hover:border-neon transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                </div>
            </div>`).join('');
    },

    // Updated `viewProduct` to apply styling directly to dynamic product HTML injection
    viewProduct(id) {
        const p = products.find(i => i.id === id); if (!p) return;
        this.currentVariant = p.variants ? p.variants[0] : null;

        let gHTML = `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain p-6 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">`;
        if (p.gallery && p.gallery.length > 1) gHTML = `<div class="flex overflow-x-auto snap-x snap-mandatory hide-scroll h-full w-full">` + p.gallery.map((img, idx) => `<img src="${img}" alt="${p.name} view ${idx+1}" class="w-full h-full object-contain p-6 snap-center shrink-0 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">`).join('') + `</div>`;
        
        let variantsHTML = '';
        if (p.variants) {
            variantsHTML = `<div class="mb-6 text-left"><label class="text-[10px] text-neon uppercase font-tech tracking-widest block mb-2">Configure Specification</label><select aria-label="Select variant" onchange="app.selectVariant(this.options[this.selectedIndex].dataset.price, this.value)" class="w-full glass-panel text-white text-sm p-3 rounded-xl outline-none appearance-none cursor-pointer truncate neon-border">` + 
            p.variants.map((v, i) => `<option value="${v.name}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>${v.name} (+$${(v.price - p.price).toFixed(2)})</option>`).join('') + `</select></div>`;
        }

        const c = document.getElementById('product-detail-content');
        if(c) c.innerHTML = `
            <div class="glass-panel p-1 rounded-xl mb-4">
                <div class="relative w-full aspect-square bg-gradient-to-br from-[#1a1a24] to-[#050505] rounded-[10px] overflow-hidden flex items-center justify-center relative">
                    <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, var(--neon-accent) 0, var(--neon-accent) 1px, transparent 1px, transparent 50%); background-size: 10px 10px;"></div>
                    ${gHTML}
                </div>
            </div>
            <div class="text-center mb-6 mt-2">
                <h2 class="text-2xl font-tech font-bold uppercase tracking-widest mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">${p.name}</h2>
                <div class="flex justify-center items-baseline gap-3 mb-2">
                    <span id="detail-price" class="text-2xl font-tech font-black text-neon tracking-widest drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">$${Number(this.currentVariant ? this.currentVariant.price : p.price).toFixed(2)}</span>
                    ${p.oldPrice > p.price ? `<span class="text-sm font-tech text-premiumGray line-through block">$${Number(p.oldPrice).toFixed(2)}</span>` : ''}
                </div>
            </div>
            ${variantsHTML}
            
            <h4 class="font-tech text-xs uppercase text-premiumGray mb-2 border-b border-premiumBorder pb-2">Technical Specs</h4>
            <p class="text-sm text-premiumGray leading-relaxed mb-8 px-2 text-justify">${p.desc}</p>
            
            <div class="space-y-3 pb-8">
                <button onclick="app.animateAddToCart(${p.id}, event)" aria-label="Add to cart" class="w-full glass-panel border border-premiumBorder hover:border-neon text-white font-tech font-bold uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-all">
                    ADD TO CART
                </button>
                <button onclick="app.openOrderSummary(${p.id})" aria-label="Buy Now" class="w-full neon-btn font-tech uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 font-black">QUICK BUY</button>
            </div>`;
        this.navigate('product');
    }

    openOrderSummary(productId = null) {
        this.haptic('medium'); this.pendingOrderProductId = productId; this.selectedCompany = null;
        const errors = ['delivery-error', 'phone-error', 'grab-phone-error', 'company-error'];
        errors.forEach(e => { const el = document.getElementById(e); if(el) el.classList.add('hidden'); });
        const dSelect = document.getElementById('modal-delivery'); if(dSelect) dSelect.value = "";
        const cFields = document.getElementById('conditional-fields'); if(cFields) cFields.classList.add('hidden');
        const gFields = document.getElementById('grab-fields'); if(gFields) gFields.classList.add('hidden');
        const gPhone = document.getElementById('grab-phone'); if(gPhone) gPhone.value = "";
        document.querySelectorAll('.company-box').forEach(b => b.classList.remove('selected'));
        const modal = document.getElementById('order-modal'); const content = document.getElementById('order-modal-content');
        if(!modal || !content) return;
        modal.classList.remove('hidden'); modal.classList.add('flex');
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.classList.add('opacity-100'); content.classList.replace('scale-95', 'scale-100'); }, 10);
    },

    closeOrderSummary() { this.haptic('light'); const modal = document.getElementById('order-modal'); const content = document.getElementById('order-modal-content'); if(!modal || !content) return; modal.classList.remove('opacity-100'); modal.classList.add('opacity-0'); content.classList.replace('scale-100', 'scale-95'); setTimeout(() => { modal.classList.remove('flex'); modal.classList.add('hidden'); }, 300); },

    handleDeliveryChange() {
        const d = document.getElementById('modal-delivery').value; document.getElementById('delivery-error').classList.add('hidden');
        document.getElementById('conditional-fields').classList.toggle('hidden', !d.includes('Standard'));
        document.getElementById('grab-fields').classList.toggle('hidden', !d.includes('Grab'));
    },

    selectCompany(companyName) { this.haptic('light'); this.selectedCompany = companyName; document.getElementById('company-error').classList.add('hidden'); document.querySelectorAll('.company-box').forEach(box => { box.classList.remove('selected'); }); if(companyName === 'VET') document.getElementById('company-vet').classList.add('selected'); if(companyName === 'J&T') document.getElementById('company-jnt').classList.add('selected'); if(companyName === 'L192') document.getElementById('company-l192').classList.add('selected'); },
    clearPhoneError() { document.getElementById('phone-error').classList.add('hidden'); },
    clearGrabPhoneError() { document.getElementById('grab-phone-error').classList.add('hidden'); },

    // UPGRADE 4: ORDER CONFIRMATION UX
    submitFinalOrder() {
        this.haptic('medium'); let valid = true; const d = document.getElementById('modal-delivery').value;
        if (!d) { document.getElementById('delivery-error').classList.remove('hidden'); valid = false; }
        
        const isStandard = d.includes('Standard');
        const isGrab = d.includes('Grab');
        
        if (isStandard) { 
            if (!this.selectedCompany) { document.getElementById('company-error').classList.remove('hidden'); valid = false; } 
            if (!document.getElementById('modal-phone').value.trim()) { document.getElementById('phone-error').classList.remove('hidden'); valid = false; } 
        }
        if (isGrab) { 
            if (!document.getElementById('grab-phone').value.trim()) { document.getElementById('grab-phone-error').classList.remove('hidden'); valid = false; } 
        }
        if (!valid) return;

        let items = []; let total = 0; 
        if (this.pendingOrderProductId) { 
            const p = products.find(i => i.id === this.pendingOrderProductId); 
            if(p) { items.push({...p, quantity: 1, variant: this.currentVariant || p.variants[0]}); total = Number(this.currentVariant ? this.currentVariant.price : p.price); } 
        } else { 
            items = [...this.cart]; items.forEach(i => total += Number(i.cartPrice * i.quantity)); 
        }
        
        let msg = `🛒 NEW ORDER\nMethod: ${d}\n`;
        if (isStandard) msg += `Company: ${this.selectedCompany}\nProvince: ${document.getElementById('modal-province').value}\nAddress: ${document.getElementById('modal-address').value || 'N/A'}\nPhone: ${document.getElementById('modal-phone').value}\n`;
        if (isGrab) msg += `Phone: ${document.getElementById('grab-phone').value}\n`;
        msg += `Note: ${document.getElementById('modal-note').value || 'None'}\n\nItems:\n` + items.map((i, idx) => `${idx+1}. ${i.name} (${i.variant.name}) - ${i.quantity}x @ $${i.cartPrice.toFixed(2)}`).join('\n') + `\nTotal: $${total.toFixed(2)}`;
        
        // Transform Modal to Success State UX before redirecting
        const contentArea = document.getElementById('order-modal-content');
        const originalHTML = contentArea.innerHTML;
        contentArea.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-xl font-black text-premiumWhite uppercase tracking-widest mb-2">Order Prepared</h3>
                <p class="text-xs text-premiumGray text-center">Redirecting securely to Telegram...</p>
                <div class="mt-6 w-8 h-8 border-2 border-premiumBorder border-t-[#2AABEE] rounded-full animate-spin"></div>
            </div>
        `;

        setTimeout(() => {
            const url = `https://t.me/${this.supportUsername.replace('@', '')}?text=${encodeURIComponent(msg)}`;
            const inTelegram = this.tg && this.tg.initDataUnsafe && Object.keys(this.tg.initDataUnsafe).length > 0;
            if (inTelegram && this.tg.sendData) {
                this.tg.sendData(JSON.stringify({ method: d, items: items, total: total }));
            } else if (this.tg && this.tg.openTelegramLink) {
                this.tg.openTelegramLink(url);
            } else {
                window.open(url, '_blank');
            }
            
            // Empty Cart if this was a cart checkout
            if (!this.pendingOrderProductId) {
                this.cart = [];
                this.saveCart();
                this.renderCart();
            }
            
            setTimeout(() => {
                this.closeOrderSummary();
                setTimeout(() => contentArea.innerHTML = originalHTML, 300); // restore HTML hidden
            }, 500);
            
        }, 1500); // 1.5 second confirmation UX delay
    },

    // UPGRADE 1 & 2: CART PERSISTENCE AND QUANTITY MANAGEMENT
    saveCart() {
        localStorage.setItem('brickStoreCart', JSON.stringify(this.cart));
        this.updateCartBadge();
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

    renderCart() {
        try {
            const content = document.getElementById('cart-content');
            if(!content) return;
            if (this.cart.length === 0) {
                content.innerHTML = `<div class="text-center py-20"><span class="text-6xl mb-6 block opacity-30 grayscale filter">🛒</span><h3 class="text-premiumWhite font-bold uppercase tracking-widest mb-2">Your cart is empty</h3><p class="text-xs text-premiumGray mb-8">Looks like you haven't added any knives yet.</p><button onclick="app.navigate('home'); app.setCategory('home');" class="bg-premiumWhite text-premiumBlack font-black uppercase tracking-widest py-3 px-8 rounded-xl active:scale-95 transition-transform shadow-sm">Go to Shopping</button></div>`;
                return;
            }
            let total = 0;
            let cartItemsHTML = this.cart.map((item, index) => {
                if (!item) return '';
                const itemTotal = Number(item.cartPrice || item.price) * item.quantity;
                total += itemTotal;
                return `
                <div class="bg-premiumCard border border-premiumBorder p-3 rounded-xl flex items-center gap-4 mb-3 shadow-sm">
                    <div class="w-16 h-16 bg-[#0a0a0a] rounded-lg flex items-center justify-center p-2 border border-premiumBorder shadow-inner">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-xs uppercase tracking-wider text-premiumWhite leading-tight">${item.name}</h4>
                        <span class="text-[9px] text-premiumGray block truncate w-32 uppercase font-bold tracking-widest">${item.variant?.name || 'Standard'}</span>
                        <span class="text-[#2AABEE] text-sm font-bold block mt-1">$${itemTotal.toFixed(2)}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-premiumBlack rounded-lg border border-premiumBorder p-1">
                        <button onclick="app.updateQuantity(${index}, -1)" aria-label="Decrease quantity" class="w-7 h-7 text-premiumWhite flex items-center justify-center active:scale-90"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button>
                        <span class="text-xs font-black text-premiumWhite w-4 text-center">${item.quantity}</span>
                        <button onclick="app.updateQuantity(${index}, 1)" aria-label="Increase quantity" class="w-7 h-7 text-premiumWhite flex items-center justify-center active:scale-90"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                    </div>
                </div>`;
            }).join('');
            content.innerHTML = `<div>${cartItemsHTML}</div><div class="mt-8 border-t border-premiumBorder pt-6"><div class="flex justify-between items-center mb-6"><span class="text-premiumGray uppercase tracking-widest font-bold text-xs">Total Price</span><span class="text-2xl font-black text-premiumWhite tracking-widest">$${total.toFixed(2)}</span></div><button onclick="app.openOrderSummary()" class="w-full bg-premiumWhite text-premiumBlack font-black uppercase tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-transform shadow-sm">CHECKOUT NOW</button></div>`;
        } catch (e) { console.error("Cart render failed:", e); }
    },

    openSocial(url) { this.haptic('light'); if (this.tg && this.tg.openLink) { this.tg.openLink(url); } else { window.open(url, '_blank'); } },
    togglePanel() { this.haptic('light'); if(this.isLeftPanelOpen) this.toggleLeftPanel(); this.isPanelOpen = !this.isPanelOpen; const p = document.getElementById('side-panel'); const o = document.getElementById('panel-overlay'); if(!p || !o) return; if (this.isPanelOpen) { p.classList.replace('translate-x-full', 'translate-x-0'); o.classList.remove('hidden'); setTimeout(() => o.classList.add('opacity-100'), 10); } else { p.classList.replace('translate-x-0', 'translate-x-full'); o.classList.replace('opacity-100', 'opacity-0'); setTimeout(() => o.classList.add('hidden'), 300); } },
    toggleLeftPanel() { this.haptic('light'); if(this.isPanelOpen) this.togglePanel(); this.isLeftPanelOpen = !this.isLeftPanelOpen; const p = document.getElementById('left-panel'); const o = document.getElementById('left-panel-overlay'); if(!p || !o) return; if (this.isLeftPanelOpen) { p.classList.replace('-translate-x-full', 'translate-x-0'); o.classList.remove('hidden'); setTimeout(() => o.classList.add('opacity-100'), 10); } else { p.classList.replace('translate-x-0', '-translate-x-full'); o.classList.replace('opacity-100', 'opacity-0'); setTimeout(() => o.classList.add('hidden'), 300); } },
    navigate(viewId) { this.haptic('light'); if(this.isPanelOpen) this.togglePanel(); if(this.isLeftPanelOpen) this.toggleLeftPanel(); document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active')); setTimeout(() => { const v = document.getElementById(`view-${viewId}`); if(v) v.classList.add('active'); }, 50); const h = document.getElementById('nav-home'); const c = document.getElementById('nav-cart'); if (viewId === 'home' || viewId === 'cart') { if(h) h.className = `flex flex-col items-center transition-colors ${viewId==='home'?'text-premiumWhite':'text-premiumGray hover:text-premiumWhite'}`; if(c) c.className = `flex flex-col items-center transition-colors relative ${viewId==='cart'?'text-premiumWhite':'text-premiumGray hover:text-premiumWhite'}`; try { this.tg?.BackButton?.hide?.(); } catch(e){} } else { try { this.tg?.BackButton?.show?.(); } catch(e){} } if (viewId === 'cart') this.renderCart(); window.scrollTo(0, 0); },
    handlePriceFilter(type) { this.isPriceFilterActive = true; const mi = document.getElementById('minPriceRange'); const ma = document.getElementById('maxPriceRange'); let min = Number(mi.value); let max = Number(ma.value); if (type === 'min' && min > max - 1) { min = max - 1; mi.value = min; } if (type === 'max' && max < min + 1) { max = min + 1; ma.value = max; } this.minPrice = min; this.maxPrice = max; this.updateSliderUI(); this.renderCatalog(); },
    updateSliderUI() { 
        const l = document.getElementById('priceValue'); if(l) l.innerText = `$${this.minPrice.toFixed(2)} — $${this.maxPrice.toFixed(2)}`; 
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
            const totalQty = this.cart.reduce((acc, curr) => acc + curr.quantity, 0);
            b.innerText = totalQty; 
            b.classList.toggle('hidden', totalQty === 0); 
        } 
    },
    setCategory(cat) { this.haptic('medium'); this.currentCategory = cat; this.searchQuery = ""; const si = document.getElementById('searchInput'); if(si) si.value = ""; if(this.isLeftPanelOpen) this.toggleLeftPanel(); this.navigate('home'); this.renderCatalog(); },
    resetFilters() { this.haptic('medium'); this.searchQuery = ""; const s = document.getElementById('searchInput'); if (s) s.value = ""; this.minPrice = this.absMinPrice; this.maxPrice = this.absMaxPrice; this.isPriceFilterActive = false; const mi = document.getElementById('minPriceRange'); const ma = document.getElementById('maxPriceRange'); if(mi) mi.value = this.absMinPrice; if(ma) ma.value = this.absMaxPrice; this.updateSliderUI(); this.setCategory('home'); },
    applyTheme() { const k = document.getElementById('theme-toggle-knob'); document.body.classList.toggle('dark', this.isDarkMode); if(k) k.classList.toggle('translate-x-6', this.isDarkMode); try { this.tg?.setHeaderColor?.(this.isDarkMode?'#000000':'#f4f4f5'); this.tg?.setBackgroundColor?.(this.isDarkMode?'#000000':'#f4f4f5'); } catch(e){} },
    toggleTheme() { this.haptic('medium'); this.isDarkMode = !this.isDarkMode; try{localStorage.setItem('brickTheme', this.isDarkMode?'dark':'light');}catch(e){} this.applyTheme(); },
    shareApp() { const l = "https://t.me/BrickStoreApp_bot/Homepage"; const t = "Check out BRICK STORE!"; try { if (this.tg?.openTelegramLink) this.tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(l)}&text=${encodeURIComponent(t)}`); else window.open(`https://t.me/share/url?url=${encodeURIComponent(l)}&text=${encodeURIComponent(t)}`, '_blank'); } catch(e){} }
};

document.addEventListener('DOMContentLoaded', () => { app.init(); });
